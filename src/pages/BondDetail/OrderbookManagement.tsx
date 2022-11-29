import React, { useState } from 'react'

import { ActionButton } from '@/components/auction/Claimer'

const OrderbookManagement = () => {
  const [orderbookVisible, setOrderbookVisible] = useState(false)

  return (
    <>
      <div>
        <ActionButton className="mt-4" onClick={() => setOrderbookVisible(!orderbookVisible)}>
          Orderbook
        </ActionButton>
      </div>
      <div
        className="card card-bordered"
        style={{ visibility: orderbookVisible ? 'visible' : 'hidden' }}
      >
        <div className="card-body">
          <div className="flex justify-between">
            <h2 className="card-title">Orderbook</h2>
          </div>
          <div className="mb-6 space-y-6">
            <div className="text-base">
              <div className="flex justify-center items-center w-full">
                <a href="/orderbook/create">
                  <ActionButton className="mt-4">Create Limit Order</ActionButton>
                </a>
              </div>
            </div>
            <div>
              <table className="table-auto">
                <thead>
                  <tr>
                    <th>Current Limit Orders</th>
                  </tr>
                  <tr>
                    <th>Maker</th>
                    <th>Bond Amount</th>
                    <th>Taker</th>
                    <th>USDC Amount</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderbookManagement
