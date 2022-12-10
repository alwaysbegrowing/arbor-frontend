import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { ActionButton } from '@/components/auction/Claimer'
import Tooltip from '@/components/common/Tooltip'
import { useBond } from '@/hooks/useBond'
import { useOrderbookPair } from '@/hooks/useOrderbook'

const OrderbookManagement = () => {
  const [orderbookVisible, setOrderbookVisible] = useState(false)
  const { bondId } = useParams()

  const { data: bond, loading: loadingBond } = useBond(bondId)

  const useOrderbook = () => {
    const {
      asks,
      bids,
      loading: loadingOrderbook,
    } = useOrderbookPair('0x5a2d26d95b07c28d735ff76406bd82fe64222dc1', bondId)
    if (!bids?.records && !asks?.records) return
    return (
      <>
        <table className="table h-full w-full overflow-scroll">
          <thead className="sticky top-0 z-[1]">
            <tr className="border-b border-b-[#D5D5D519]">
              <th className="bg-transparent text-xs font-normal tracking-widest text-[#696969]">
                <Tooltip tip="Investors currently selling bonds" /> Current Sell Orders
              </th>
            </tr>
            <tr>
              {/* Maker */}
              <th className="w-40">Seller</th>
              <th>Bond Amount</th>
            </tr>
          </thead>
          <tbody className="h-[57px] bg-transparent text-sm text-[#D2D2D2]">
            {bids?.records?.map(
              ({ metaData: { remainingFillableTakerAmount }, order: { maker } }) => (
                <>
                  <tr>
                    <td>
                      <div className="h-full w-40 overflow-x-scroll">{maker}</div>
                    </td>
                    <td>{remainingFillableTakerAmount}</td>
                  </tr>
                </>
              ),
            )}
          </tbody>
        </table>
        <table className="table h-full w-full">
          <thead className="sticky top-0 z-[1]">
            <tr className="border-b border-b-[#D5D5D519]">
              <th className="bg-transparent text-xs font-normal tracking-widest text-[#696969]">
                <Tooltip tip="Investors currently buying bonds" /> Current Buy Orders
              </th>
            </tr>
            <tr>
              {/* Taker */}
              <th>Buyer</th>
              <th>USDC Amount</th>
            </tr>
          </thead>
          <tbody className="h-[57px] bg-transparent text-sm text-[#D2D2D2]">
            {/* Double check that taker is the correct variable here */}
            {asks?.records?.map(
              ({ metaData: { remainingFillableTakerAmount }, order: { maker } }) => (
                <>
                  <tr>
                    <td>
                      <div className="h-full w-40 overflow-x-scroll">{maker}</div>
                    </td>
                    <td>{remainingFillableTakerAmount}</td>
                  </tr>
                </>
              ),
            )}{' '}
          </tbody>
        </table>
      </>
    )
  }

  return (
    <>
      <div>
        <ActionButton className="mt-4" onClick={() => setOrderbookVisible(!orderbookVisible)}>
          Orderbook
        </ActionButton>
      </div>
      <div
        className="card-bordered card"
        style={{ visibility: orderbookVisible ? 'visible' : 'hidden' }}
      >
        <div className="card-body">
          <div className="flex justify-between">
            <h2 className="card-title">Orderbook</h2>
          </div>
          <div className="mb-6 space-y-6">
            <div className="text-base">
              <div className="flex w-full items-center justify-center">
                <a href="/orderbook/create">
                  <ActionButton className="mt-4">Create Limit Order</ActionButton>
                </a>
              </div>
            </div>
            <div className="overflow-x">{useOrderbook()}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderbookManagement
