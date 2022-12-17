import React, { RefObject, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { TokenAmount } from '@josojo/honeyswap-sdk'

import { LoadingBox } from '../../../pages/Auction'
import { DerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { parseURL } from '../../../state/orderPlacement/reducer'
import { useOrderbookState } from '../../../state/orderbook/hooks'
import OrderBookChart, { OrderBookError } from '../OrderbookChart'
import { OrderBookTable } from '../OrderbookTable'
import { processOrderbookData } from '../OrderbookWidget'

import { isGoerli } from '@/connectors'
import { useAuction } from '@/hooks/useAuction'

interface OrderbookGraphProps {
  derivedAuctionInfo: DerivedAuctionInfo
  orderbookChartRef: RefObject<HTMLHeadingElement>
  orderbookSelectorRef: RefObject<HTMLDivElement>
}

export const OrderBook: React.FC<OrderbookGraphProps> = (props) => {
  const { derivedAuctionInfo, orderbookChartRef, orderbookSelectorRef } = props
  const {
    asks,
    auctionId: orderbookAuctionId,
    bids,
    error,
    userOrderPrice,
    userOrderVolume,
  } = useOrderbookState()

  const [showOrderList, setShowOrderList] = useState(isGoerli)
  const [isMobile, setIsMobile] = useState(false)
  const auctionIdentifier = parseURL(useParams())
  const { data: graphData } = useAuction(auctionIdentifier.auctionId)
  const { auctionId } = auctionIdentifier

  useEffect(() => {
    if (window.innerWidth <= 800 && window.innerHeight <= 800) {
      setIsMobile(true)
    }
  }, [])

  const { auctioningToken: baseToken, biddingToken: quoteToken } = derivedAuctionInfo || {}

  const processedOrderbook = React.useMemo(() => {
    const data = { bids, asks }
    const minFundingThresholdAmount =
      graphData && new TokenAmount(quoteToken, graphData?.minimumFundingThreshold)

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
  }, [bids, asks, graphData, quoteToken, userOrderPrice, userOrderVolume, baseToken])

  const isLoading = orderbookAuctionId != auctionId
  const hasError = error || !asks || asks.length === 0

  if (isLoading) {
    return <LoadingBox height={521} />
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-5 flex flex-wrap justify-between">
          <h2 className="card-title" ref={orderbookChartRef}>
            Orderbook
          </h2>
          <div className="flex items-center" title="Graph is disabled on mobile and Goerli.">
            <div className="btn-group pointer-events-none	" ref={orderbookSelectorRef}>
              <button
                className={`btn ${!showOrderList && 'btn-active'} pointer-events-auto w-[85px]`}
                disabled={isGoerli || isMobile}
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

        {hasError && !showOrderList && <OrderBookError error={error} />}
        {!hasError && !showOrderList && (
          <OrderBookChart baseToken={baseToken} data={processedOrderbook} quoteToken={quoteToken} />
        )}

        {showOrderList && <OrderBookTable derivedAuctionInfo={derivedAuctionInfo} />}
      </div>
    </div>
  )
}
