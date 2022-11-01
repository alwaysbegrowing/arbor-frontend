import { Signer } from 'ethers'
import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract, ContractFunction } from '@ethersproject/contracts'
import { Token } from '@josojo/honeyswap-sdk'
import { requiredChain } from 'src/connectors'

import { additionalServiceApi } from '../api'
import depositAndPlaceOrderABI from '../constants/abis/easyAuction/depositAndPlaceOrder.json'
import easyAuctionABI from '../constants/abis/easyAuction/easyAuction.json'
import { Result, useSingleCallResult } from '../state/multicall/hooks'
import { useOrderPlacementState } from '../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../state/orderPlacement/reducer'
import { useOrderbookActionHandlers } from '../state/orderbook/hooks'
import { useOrderActionHandlers } from '../state/orders/hooks'
import { OrderStatus } from '../state/orders/reducer'
import { useTransactionAdder } from '../state/transactions/hooks'
import {
  ChainId,
  DEPOSIT_AND_PLACE_ORDER,
  EASY_AUCTION_NETWORKS,
  calculateGasMargin,
  getContract,
  getEasyAuctionContract,
  getTokenDisplay,
  isTokenWETH,
} from '../utils'
import { getLogger } from '../utils/logger'
import { abbreviation } from '../utils/numeral'
import { convertPriceIntoBuyAndSellAmount } from '../utils/prices'
import { encodeOrder } from './Order'
import { useActiveWeb3React } from './index'
import { useContract } from './useContract'
import { useGasPrice } from './useGasPrice'

const logger = getLogger('usePlaceOrderCallback')

export const queueStartElement =
  '0x0000000000000000000000000000000000000000000000000000000000000001'
export const queueLastElement = '0xffffffffffffffffffffffffffffffffffffffff000000000000000000000001'

type EstimateAndParams = {
  estimate: ContractFunction<BigNumber>
  method: Function
  args: [number, [string], [string], string] | [number, [string], [string], [string], string]
  value: Maybe<BigNumber>
}
// returns a function that will place an order, if the parameters are all valid
// and the user has approved the transfer of tokens
export function usePlaceOrderCallback(
  auctionIdentifer: AuctionIdentifier,
  signature: string | null,
  auctioningToken: Token,
  biddingToken: Token,
): null | (() => Promise<string>) {
  const { account, chainId, signer } = useActiveWeb3React()
  const { auctionId } = auctionIdentifer

  const addTransaction = useTransactionAdder()
  const { onNewOrder } = useOrderActionHandlers()
  const { price: priceFromSwapState, sellAmount: bondsToPurchase } = useOrderPlacementState()
  const sellAmount = Number(bondsToPurchase).toString()
  const { onNewBid } = useOrderbookActionHandlers()
  const gasPrice = useGasPrice(chainId)

  const price = priceFromSwapState.toString()

  const easyAuctionInstance: Maybe<Contract> = useContract(
    EASY_AUCTION_NETWORKS[requiredChain.id as number],
    easyAuctionABI,
  )
  const userId: Result | undefined = useSingleCallResult(easyAuctionInstance, 'getUserId', [
    account == null ? undefined : account,
  ]).result
  console.log(userId) // why is this null?
  console.log(easyAuctionInstance) // this isn't
  console.log(account) // neither is this
  return useMemo(() => {
    let previousOrder: string

    return async function onPlaceOrder() {
      if (!chainId || !signer || !account || !userId || !signature) {
        console.log(!chainId, !signer, !account, !userId, !signature, 'missing deps')
        throw new Error('missing dependencies in onPlaceOrder callback')
      }

      const { buyAmountScaled, sellAmountScaled } = convertPriceIntoBuyAndSellAmount(
        auctioningToken,
        biddingToken,
        price,
        sellAmount,
      )

      if (sellAmountScaled == undefined || buyAmountScaled == undefined) {
        throw new Error('Price was not correct.')
      }

      try {
        previousOrder = await additionalServiceApi.getPreviousOrder({
          networkId: chainId,
          auctionId,
          order: {
            buyAmount: buyAmountScaled,
            sellAmount: sellAmountScaled,
            userId: BigNumber.from(0), // Todo: This could be optimized
          },
        })
      } catch (error) {
        logger.error(`Error trying to get previous order for auctionId ${auctionId}`)
      }

      const auctioningTokenDisplay = getTokenDisplay(auctioningToken)
      const biddingTokenDisplay = getTokenDisplay(biddingToken)

      const { args, estimate, method, value } = getEstimateParams(
        biddingToken,
        chainId,
        signer,
        account,
        buyAmountScaled,
        sellAmountScaled,
        previousOrder,
        auctionId || 0,
        signature,
      )

      return estimate(...args, value ? { value } : {})
        .then((estimatedGasLimit) =>
          method(...args, {
            ...(value ? { value } : {}),
            gasPrice,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          }),
        )
        .then((response) => {
          try {
            addTransaction(response?.hash, {
              summary: `Place ${abbreviation(
                sellAmount,
              )} ${biddingTokenDisplay} order for ${auctioningTokenDisplay} on auction ${auctionId}`,
            })

            const order = {
              buyAmount: buyAmountScaled,
              sellAmount: sellAmountScaled,
              userId: BigNumber.from(parseInt(userId.toString())), // If many people are placing orders, this might be incorrect
            }
            onNewOrder([
              {
                id: encodeOrder(order),
                sellAmount: parseFloat(sellAmount).toString(),
                price: price.toString(),
                status: OrderStatus.PENDING,
                chainId,
              },
            ])
            onNewBid({
              volume: parseFloat(sellAmount),
              price: parseFloat(price),
            })
          } catch (e) {
            console.log(e)
          }
          return response
        })
        .catch((error) => {
          logger.error(`Swap or gas estimate failed`, error)
          throw error
        })
    }
  }, [
    account,
    onNewBid,
    onNewOrder,
    addTransaction,
    auctionId,
    auctioningToken,
    biddingToken,
    chainId,
    gasPrice,
    signer,
    price,
    sellAmount,
    signature,
    userId,
  ])
}

const getEstimateParams = (
  biddingToken: Token,
  chainId: ChainId,
  signer: Signer,
  account: string,
  buyAmountScaled: BigNumber,
  sellAmountScaled: BigNumber,
  previousOrder: string,
  auctionId: number,
  signature: string,
): EstimateAndParams => {
  const easyAuctionContract: Contract = getEasyAuctionContract(signer)
  if (isTokenWETH(biddingToken.address, chainId)) {
    const depositAndPlaceOrderContract = getContract(
      DEPOSIT_AND_PLACE_ORDER[chainId],
      depositAndPlaceOrderABI,
      signer,
    )

    return {
      estimate: depositAndPlaceOrderContract.estimateGas.depositAndPlaceOrder,
      method: depositAndPlaceOrderContract.depositAndPlaceOrder,
      args: [
        auctionId,
        [buyAmountScaled.toString()],
        [previousOrder],
        signature ? signature : '0x',
      ],
      value: sellAmountScaled,
    }
  }
  return {
    estimate: easyAuctionContract.estimateGas.placeSellOrders,
    method: easyAuctionContract.placeSellOrders,
    args: [
      auctionId,
      [buyAmountScaled.toString()],
      [sellAmountScaled.toString()],
      [previousOrder],
      signature ? signature : '0x',
    ],
    value: null,
  }
}
