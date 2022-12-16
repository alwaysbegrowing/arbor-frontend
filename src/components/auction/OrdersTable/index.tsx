import React, { useCallback, useState } from 'react'

import { BidTransactionLink, TableDesign, calculateRow } from '../OrderbookTable'

import ConfirmationDialog from '@/components/modals/ConfirmationDialog'
import { OopsWarning } from '@/components/modals/OopsWarning'
import { Bid } from '@/generated/graphql'
import { useBondMaturityForAuction } from '@/hooks/useBondMaturityForAuction'
import { useCancelOrderCallback } from '@/hooks/useCancelOrderCallback'
import { AuctionState, DerivedAuctionInfo, useAllUserOrders } from '@/state/orderPlacement/hooks'
import { AuctionIdentifier } from '@/state/orderPlacement/reducer'
import { OrderStatus } from '@/state/orders/reducer'
import { PartiallyOptional, getTokenDisplay } from '@/utils'

interface OrdersTableProps {
  bids: PartiallyOptional<Bid, 'account'>[]
  loading: boolean
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
}

export const orderStatusText = {
  [OrderStatus.PLACED]: 'Active',
  [OrderStatus.PENDING]: 'Pending',
  [OrderStatus.PENDING_CANCELLATION]: 'Cancelling',
}

const yourOrdersTableColumns = [
  {
    Header: 'Status',
    accessor: 'status',
  },
  {
    Header: 'Price',
    accessor: 'price',
  },
  {
    Header: 'Interest rate',
    accessor: 'interest',
  },
  {
    Header: 'Total cost',
    accessor: 'amount',
  },
  {
    Header: 'Amount',
    accessor: 'bonds',
  },
  {
    Header: 'Transaction',
    accessor: 'transaction',
  },
]

const OrdersTable: React.FC<OrdersTableProps> = (props) => {
  const { auctionIdentifier, bids, derivedAuctionInfo, loading } = props
  const { auctionEndDate, maturityDate } = useBondMaturityForAuction()
  const cancelOrderCallback = useCancelOrderCallback(
    auctionIdentifier,
    derivedAuctionInfo?.biddingToken,
  )
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [orderId, setOrderId] = useState<string>('')

  const onCancelOrder = useCallback(() => {
    return cancelOrderCallback(orderId)
  }, [cancelOrderCallback, orderId])

  const hasLastCancellationDate =
    derivedAuctionInfo?.auctionEndDate !== derivedAuctionInfo?.orderCancellationEndDate &&
    derivedAuctionInfo?.orderCancellationEndDate !== 0
  const orderCancellationEndMilliseconds = derivedAuctionInfo?.orderCancellationEndDate * 1000

  const now = Math.trunc(Date.now())
  const ordersEmpty = !bids || bids.length == 0

  // the array is frozen in strict mode, we will need to copy the array before sorting it
  const orderPlacingOnly = derivedAuctionInfo?.auctionState === AuctionState.ORDER_PLACING
  const isOrderCancellationExpired =
    hasLastCancellationDate && now > orderCancellationEndMilliseconds && orderPlacingOnly
  const orderSubmissionFinished = derivedAuctionInfo?.auctionState === AuctionState.CLAIMING
  const hideCancelButton = orderPlacingOnly || orderSubmissionFinished

  useAllUserOrders(auctionIdentifier, derivedAuctionInfo)

  const data = []
  const paymentToken = getTokenDisplay(derivedAuctionInfo?.biddingToken)

  !ordersEmpty &&
    bids.forEach((row) => {
      const items = calculateRow(
        row,
        paymentToken,
        maturityDate,
        derivedAuctionInfo,
        auctionEndDate,
      )

      items.transaction = (
        <div className="flex flex-row items-center space-x-5">
          <BidTransactionLink order={row} />
          <button
            className="btn-outline btn-xs btn !bg-transparent px-3 font-normal normal-case text-[#D25453] hover:text-white"
            disabled={!!row.canceltx || isOrderCancellationExpired || hideCancelButton}
            onClick={() => {
              setOrderId(row.bytes)
              setShowConfirm(true)
            }}
          >
            Cancel
          </button>
        </div>
      )

      data.push(items)
    })

  return (
    <>
      <TableDesign columns={yourOrdersTableColumns} data={data} loading={loading} showConnect />
      <ConfirmationDialog
        actionText="Cancel order"
        beforeDisplay={
          <OopsWarning
            message="Your order will be cancelled and your funds will be returned."
            title="Are you sure?"
          />
        }
        finishedText="Order cancelled"
        loadingText="Cancelling order"
        onOpenChange={setShowConfirm}
        open={showConfirm}
        pendingText="Confirm cancellation in wallet"
        placeOrder={onCancelOrder}
      />
    </>
  )
}

export default OrdersTable
