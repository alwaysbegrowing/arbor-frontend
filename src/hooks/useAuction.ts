import { BigNumber } from 'ethers'

import { gql, useQuery } from '@apollo/client'
import { Fraction, Token, TokenAmount } from '@josojo/honeyswap-sdk'
import dayjs from 'dayjs'

import { AllAuctionsDocument, SingleAuctionDocument } from '@/generated/graphql'
import { AuctionState, DerivedAuctionInfo } from '@/state/orderPlacement/hooks'
import { getLogger } from '@/utils/logger'

const logger = getLogger('useAuctions')

const auctionQuery = gql`
  query SingleAuction($auctionId: ID!) {
    auction(id: $auctionId) {
      id
      orderCancellationEndDate
      bond {
        id
        name
        symbol
        decimals
        owner
        maturityDate
        paymentToken {
          id
          symbol
        }
        collateralToken {
          id
          symbol
          name
        }
        collateralRatio
        convertibleRatio
        maxSupply
        state
        type
      }
      bidding {
        name
        id
        symbol
        decimals
      }
      start
      end
      bondsSold
      totalPaid
      offeringSize
      totalBidVolume
      minimumFundingThreshold
      minimumBidSize
      minimumBondPrice
      live
      clearingPrice
    }
  }
`

export const useAuction = (auctionId?: number) => {
  const { data, error, loading } = useQuery(SingleAuctionDocument, {
    variables: { auctionId: `${auctionId}` },
  })

  if (error) {
    logger.error('Error getting useAuction info', error)
  }

  return { data: data?.auction, loading }
}

export const getAuctionState = ({
  end,
  live,
  orderCancellationEndDate,
}: {
  end?: string
  orderCancellationEndDate?: string
  live: Boolean
}) => {
  if (!end || !orderCancellationEndDate) return AuctionState.CLAIMING
  const now = dayjs(new Date())
  const pastEnd = dayjs(end).utc().isBefore(now)
  const pastCancellation = dayjs(orderCancellationEndDate).utc().isBefore(now)

  if (!pastCancellation) return AuctionState.ORDER_PLACING_AND_CANCELING
  if (!pastEnd) return AuctionState.ORDER_PLACING
  if (live) return AuctionState.NEEDS_SETTLED
  else return AuctionState.CLAIMING
}

export const useGraphDerivedAuctionInfo = (auctionId?: number, chainId?: number) => {
  const { data: graphInfo, loading } = useAuction(auctionId)
  if (loading) {
    return { data: null, loading: true }
  }
  const auctioningToken = new Token(
    chainId as number,
    graphInfo?.bond?.id || '',
    parseInt(graphInfo?.bond?.decimals.toString() || '0', 16),
    graphInfo?.bond.symbol,
  )
  const biddingToken = new Token(
    chainId as number,
    graphInfo?.bidding.id || '',
    parseInt(graphInfo?.bidding?.decimals.toString() || '0', 16),
    graphInfo?.bidding.symbol,
  )
  const data: DerivedAuctionInfo = {
    auctionEndDate: graphInfo?.end / 1000,
    auctioningToken,
    auctionStartDate: graphInfo?.start / 1000,
    auctionState: getAuctionState(graphInfo),
    biddingToken,
    clearingPrice: graphInfo?.clearingPrice,
    clearingPriceOrder: {
      buyAmount: BigNumber.from(0),
      sellAmount: BigNumber.from(0),
      userId: BigNumber.from(0),
    },
    clearingPriceSellOrder: {
      buyAmount: new TokenAmount(auctioningToken, '0'),
      sellAmount: new TokenAmount(biddingToken, '0'),
    },
    clearingPriceVolume: graphInfo?.clearingPrice,
    initialAuctionOrder: graphInfo?.offeringSize,
    initialPrice: new Fraction(
      graphInfo?.offeringSize,
      BigInt(
        Math.round(
          Number(graphInfo?.minimumBondPrice) * Math.pow(10, Number(graphInfo?.bond.decimals)),
        ),
      ),
    ),
    minBiddingAmountPerOrder: '0',
    orderCancellationEndDate: graphInfo?.orderCancellationEndDate / 1000,
  }
  return { data, loading: false }
}

const auctionsQuery = gql`
  query AllAuctions {
    auctions(orderBy: end, orderDirection: desc, first: 100) {
      id
      orderCancellationEndDate
      offeringSize
      minimumBondPrice
      end
      live
      clearingPrice
      bond {
        paymentToken {
          id
          name
          symbol
          decimals
        }
        type
        id
        name
        state
        symbol
        collateralToken {
          id
          name
          symbol
          decimals
        }
        maturityDate
      }
      bidding {
        id
        decimals
        symbol
        name
      }
    }
  }
`

export const useAuctions = () => {
  const { data, error, loading } = useQuery(AllAuctionsDocument, {
    fetchPolicy: 'no-cache',
  })
  if (error) {
    logger.error('Error getting useAuctions info', error)
  }

  return { data: data?.auctions, loading }
}
