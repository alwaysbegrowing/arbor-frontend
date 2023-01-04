import React, { RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { formatUnits } from '@ethersproject/units'
import { DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { ceil } from 'lodash'

import { useAuction } from '../../../hooks/useAuction'
import { DerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { useOrderbookState } from '../../../state/orderbook/hooks'
import { abbreviation } from '../../../utils/numeral'
import { calculateInterestRate } from '../../form/InterestRateInputPanel'
import TokenLink from '../../token/TokenLink'
import { AuctionTimer } from '../AuctionTimer'
import { ExtraDetailsItem, Props as ExtraDetailsItemProps } from '../ExtraDetailsItem'
import { AuctionStatusPill } from '../OrderbookTable'

import { Auction } from '@/generated/graphql'
import { BOND_INFORMATION } from '@/pages/BondDetail'

const TokenValue = styled.span`
  line-height: 1.2;
  display: flex;
  margin-bottom: 1px;
  margin-right: 0.25em;
  text-align: center;
  white-space: nowrap;
`

interface Props {
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
  auctionInformationRef?: RefObject<HTMLHeadingElement>
  issuerInformationRef: RefObject<HTMLButtonElement>
}

export const TokenInfoWithLink = ({
  auction,
  value,
  withLink = true,
}: {
  auction: Pick<Auction, 'bidding'>
  value: number
  withLink: boolean
}) => (
  <TokenValue className="space-x-1">
    <span>
      {isBigNumberish(value)
        ? Number(formatUnits(value, auction?.bidding?.decimals)).toLocaleString()
        : Number(value).toLocaleString(undefined, {
            maximumFractionDigits: auction?.bidding?.decimals,
          })}
    </span>
    <TokenLink token={auction?.bidding} withLink={withLink} />
  </TokenValue>
)

const AuctionDetails = (props: Props) => {
  const { auctionIdentifier } = props
  const navigate = useNavigate()

  const { data: auction } = useAuction(auctionIdentifier?.auctionId)
  let { orderbookPrice: auctionCurrentPrice } = useOrderbookState()

  if (auctionCurrentPrice == 0 || auctionCurrentPrice > 1) {
    // use the price from the subgraph if not found on API
    auctionCurrentPrice = Number(auction.minimumBondPrice)
  }

  let totalBidVolume,
    offeringSize,
    minimumBondPrice,
    minimumFundingThreshold,
    minimumBidSize = {}

  let currentBondYTM,
    maxBondYTM = '-'

  if (auction) {
    offeringSize = {
      fullNumberHint: Number(
        formatUnits(auction.offeringSize, auction.bond.decimals),
      ).toLocaleString(),
      value: `${
        Number(formatUnits(auction.offeringSize, auction.bond.decimals)) < 1000000
          ? Number(formatUnits(auction.offeringSize, auction.bond.decimals)).toLocaleString()
          : abbreviation(formatUnits(auction.offeringSize, auction.bond.decimals))
      } bonds`,
    }
    totalBidVolume = {
      fullNumberHint: Number(
        formatUnits(auction.totalBidVolume, auction.bidding.decimals),
      ).toLocaleString(),
      value: (
        <TokenValue className="space-x-1">
          <span>
            {Math.round(
              Number(formatUnits(auction.totalBidVolume, auction.bidding.decimals)),
            ).toLocaleString()}
          </span>
          <TokenLink token={auction?.bidding} withLink={false} />
        </TokenValue>
      ),
    }
    minimumFundingThreshold = {
      fullNumberHint: Number(
        formatUnits(auction.minimumFundingThreshold, auction.bidding.decimals),
      ).toLocaleString(),
      value: (
        <TokenInfoWithLink
          auction={auction}
          value={auction.minimumFundingThreshold}
          withLink={false}
        />
      ),
    }
    minimumBondPrice = {
      fullNumberHint: auction?.minimumBondPrice.toLocaleString(),
      value: (
        <TokenInfoWithLink
          auction={auction}
          value={ceil(auction.minimumBondPrice, auction?.bidding?.decimals)}
          withLink={false}
        />
      ),
    }
    minimumBidSize = {
      fullNumberHint: Number(
        formatUnits(auction.minimumBidSize, auction.bidding.decimals),
      ).toLocaleString(),
      value: (
        <TokenInfoWithLink auction={auction} value={auction.minimumBidSize} withLink={false} />
      ),
    }
    currentBondYTM = calculateInterestRate({
      price: auctionCurrentPrice,
      maturityDate: auction.bond.maturityDate,
      startDate: auction.end,
    }) as string
    maxBondYTM = calculateInterestRate({
      price: auction.minimumBondPrice,
      maturityDate: auction.bond.maturityDate,
      startDate: auction.end,
    }) as string
  }

  const currentBondPrice = {
    fullNumberHint: auctionCurrentPrice.toLocaleString(),
    value: auctionCurrentPrice ? (
      <TokenValue className="space-x-1">
        <span>{auctionCurrentPrice.toLocaleString()}</span>
        <TokenLink token={auction?.bidding} />
      </TokenValue>
    ) : (
      '-'
    ),
  }

  type IssuerInformationRef = {
    issuerInformationRef: RefObject<HTMLButtonElement>
  }

  const extraDetails: Array<ExtraDetailsItemProps & IssuerInformationRef> = [
    {
      title: 'Current bond price',
      tooltip: `Current auction clearing price for a single auction. If the auction ended now, this would be the price set.`,
      value: '-',
      ...currentBondPrice,
      bordered: 'blue',
      valueText: 'text-[#75ed02]',
    },
    {
      title: 'Current bond YTM',
      value: currentBondYTM,
      tooltip:
        'Current bond yield to maturity calculated from the current bond price. If the auction ended now, this is the return bond purchasers would receive assuming no default.',
      bordered: 'blue',
      valueText: 'text-[#75ed02]',
    },
    {
      title: 'Total order volume',
      value: '-',
      ...totalBidVolume,
      tooltip: 'Sum of all order volume.',
      bordered: 'blue',
      valueText: 'text-[#75ed02]',
    },
    {
      title: 'Offering amount',
      value: '-',
      ...offeringSize,
      tooltip: 'Number of bonds being sold.',
    },
    {
      title: 'Minimum bond price',
      tooltip:
        'Minimum price a bond can be sold for. Orders below this price will not be accepted.',
      value: '-',
      ...minimumBondPrice,
    },
    {
      title: 'Maximum bond YTM',
      value: maxBondYTM,
      tooltip:
        'Maximum yield to maturity the issuer is willing to pay. This is calculated using the minimum bond price.',
    },
    {
      title: 'Min funding threshold',
      tooltip:
        'Minimum order volume required for auction to close. If this value is not reached, all funds will be returned and no bonds will be sold.',
      value: '-',
      ...minimumFundingThreshold,
    },
    {
      title: 'Minimum order amount',
      value: '-',
      ...minimumBidSize,
      tooltip: 'Minimum amount for a single order. Orders below this amount cannot be placed.',
    },
  ]

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title flex justify-between" ref={props.auctionInformationRef}>
          <span>Auction information</span>
          <AuctionStatusPill auction={auction} />
        </h2>
        <AuctionTimer
          color="blue"
          endDate={auction?.end}
          endText="End date"
          rightOfCountdown={
            auction?.bond.id in BOND_INFORMATION && (
              <button
                className="btn-primary btn-sm btn space-x-2 rounded-md bg-[#293327] !text-xxs font-normal"
                onClick={() => navigate(`/bonds/${auction?.bond.id || ''}`)}
                ref={props.issuerInformationRef}
              >
                <span>Issuer Information</span>
                <span>
                  <DoubleArrowRightIcon />
                </span>
              </button>
            )
          }
          startDate={auction?.start}
          startText="Start date"
          text="Ends in"
        />

        <div className="grid grid-cols-2 gap-x-12 gap-y-8 pt-12 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
          {extraDetails.map((item, index) => (
            <ExtraDetailsItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AuctionDetails
