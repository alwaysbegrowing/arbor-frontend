import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { TokenAmount } from '@josojo/honeyswap-sdk'

import { useAuctionDetails } from '../../../hooks/useAuctionDetails'
import { LoadingBox } from '../../../pages/Auction'
import { DerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { parseURL } from '../../../state/orderPlacement/reducer'
import { useOrderbookState } from '../../../state/orderbook/hooks'
import OrderBookChart, { OrderBookError } from '../OrderbookChart'
import { OrderBookTable } from '../OrderbookTable'
import { processOrderbookData } from '../OrderbookWidget'

interface OrderbookGraphProps {
  derivedAuctionInfo: DerivedAuctionInfo
}

export const OrderBook: React.FC<OrderbookGraphProps> = (props) => {
  const { derivedAuctionInfo } = props
  const {
    asks,
    auctionId: orderbookAuctionId,
    bids,
    error,
    userOrderPrice,
    userOrderVolume,
  } = useOrderbookState()

  const [showOrderList, setShowOrderList] = useState(false)
  const auctionIdentifier = parseURL(useParams())
  const { auctionDetails } = useAuctionDetails(auctionIdentifier)
  const { auctionId } = auctionIdentifier

  const { auctioningToken: baseToken, biddingToken: quoteToken } = derivedAuctionInfo || {}

  const processedOrderbook = React.useMemo(() => {
    const data = { bids, asks }
    const minFundingThresholdAmount =
      auctionDetails && new TokenAmount(quoteToken, auctionDetails?.minFundingThreshold)

    return processOrderbookData({
      data,
      userOrder: {
        price: userOrderPrice,
        volume: userOrderVolume,
      },
      baseToken,
      quoteToken,
      minFundingThreshold: minFundingThresholdAmount,
    })
  }, [asks, baseToken, bids, quoteToken, userOrderPrice, userOrderVolume, auctionDetails])

  const isLoading = orderbookAuctionId != auctionId
  const hasError = error || !asks || asks.length === 0

  if (isLoading) {
    return <LoadingBox height={521} />
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-5 flex flex-wrap justify-between">
          <h2 className="card-title">Orderbook</h2>
          <div className="flex items-center">
            <div className="btn-group">
              <button
                className={`btn ${!showOrderList && 'btn-active'} w-[85px]`}
                onClick={() => showOrderList && setShowOrderList(false)}
              >
                Graph
              </button>
              <button
                className={`btn ${showOrderList && 'btn-active'} w-[85px]`}
                onClick={() => !showOrderList && setShowOrderList(true)}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {hasError && <OrderBookError error={error} />}
        {!hasError && !showOrderList && (
          <OrderBookChart baseToken={baseToken} data={processedOrderbook} quoteToken={quoteToken} />
        )}

        {showOrderList && <OrderBookTable derivedAuctionInfo={derivedAuctionInfo} />}
      </div>
    </div>
  )
}
