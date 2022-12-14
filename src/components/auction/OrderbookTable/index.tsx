import React from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { formatUnits } from '@ethersproject/units'
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { round } from 'lodash'
import { usePagination, useTable } from 'react-table'

import { useActiveWeb3React } from '../../../hooks'
import { useAuctionBids } from '../../../hooks/useAuctionBids'
import { useBondMaturityForAuction } from '../../../hooks/useBondMaturityForAuction'
import { AuctionState, DerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { OrderStatus } from '../../../state/orders/reducer'
import { getExplorerLink, getTokenDisplay } from '../../../utils'
import { calculateInterestRate } from '../../form/InterestRateInputPanel'
import { orderStatusText } from '../OrdersTable'

import Tooltip from '@/components/common/Tooltip'
import { Auction } from '@/generated/graphql'
import { useGetAuctionProceeds } from '@/hooks/useClaimOrderCallback'
import { getAuctionStates } from '@/pages/Offerings'
import { RouteAuctionIdentifier, parseURL } from '@/state/orderPlacement/reducer'

export const OverflowWrap = styled.div`
  max-width: 100%;
  flex-grow: 1;
`
export const ordersTableColumns = [
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

export const calculateRow = (
  row,
  paymentToken,
  maturityDate,
  derivedAuctionInfo,
  auctionEndDate,
  bidStatus = '',
) => {
  let statusText = ''
  if (row.createtx) statusText = orderStatusText[OrderStatus.PLACED]
  if (!row.createtx) statusText = orderStatusText[OrderStatus.PENDING]
  if (bidStatus) statusText = bidStatus
  if (row.canceltx) statusText = 'Cancelled'
  const status = statusText
  const price = `${(row.payable / row.size).toLocaleString()} ${paymentToken}`
  const interestRate = calculateInterestRate({
    price: row.payable / row.size,
    maturityDate,
    startDate: auctionEndDate,
  })
  const interest = interestRate !== '-' ? `${interestRate}+` : interestRate
  const amount = `${round(
    Number(formatUnits(row.payable, derivedAuctionInfo?.biddingToken?.decimals)),
    2,
  ).toLocaleString()} ${paymentToken}`

  const bonds = `${round(
    Number(formatUnits(row.size, derivedAuctionInfo?.auctioningToken?.decimals)),
    3,
  ).toLocaleString()}+ bonds`

  const transaction = <BidTransactionLink order={row} />

  return { status, price, interest, amount, bonds, transaction }
}

export const TableDesign = ({
  columns,
  data,
  hidePagination = false,
  loading = false,
  showConnect = false,
  ...restProps
}) => {
  const { account } = useActiveWeb3React()

  // Use the state and functions returned from useTable to build your UI
  const {
    canNextPage,
    canPreviousPage,
    getTableBodyProps,
    getTableProps,
    headerGroups,
    nextPage,
    page,
    pageOptions,
    prepareRow,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    usePagination,
  )

  return (
    <div
      className="min-h-[385px] overflow-auto scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-700"
      {...restProps}
    >
      <table className="table h-full w-full" {...getTableProps()}>
        <thead className="sticky top-0 z-[1]">
          {headerGroups.map((headerGroup, i) => (
            <tr
              className="border-b border-b-[#D5D5D519]"
              key={i}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column, i) => (
                <th
                  className="bg-transparent text-xs font-normal tracking-widest text-[#696969]"
                  key={i}
                  {...column.getHeaderProps()}
                >
                  {column.tooltip ? (
                    <Tooltip left={column.Header} tip={column.tooltip} />
                  ) : (
                    column.render('Header')
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {loading &&
            [...Array(4).keys()].map((z) => (
              <tr className="h-[57px] bg-transparent text-sm text-[#D2D2D2]" key={z}>
                {[...Array(columns.length).keys()].map((i) => (
                  <td className="bg-transparent text-center text-[#696969]" key={i}>
                    <div className="my-4 h-4 w-full max-w-sm animate-pulse rounded bg-gradient-to-r from-[#1F2123] to-[#181A1C]"></div>
                  </td>
                ))}
              </tr>
            ))}
          {!loading && !page.length && (
            <tr className="h-[57px] bg-transparent text-sm text-[#D2D2D2]">
              <td
                className="space-y-4 bg-transparent py-[100px] text-center text-[#696969]"
                colSpan={columns.length}
              >
                {(account || !showConnect) && (
                  <svg
                    className="m-auto"
                    fill="none"
                    height="40"
                    viewBox="0 0 32 40"
                    width="32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.202 4.35355L27.2113 4.36285L27.2211 4.37165L31.5 8.22268V39.5H0.5V0.5H23.3484L27.202 4.35355Z"
                      stroke="white"
                      strokeOpacity="0.6"
                    />
                    <path d="M7 14H25" stroke="white" strokeOpacity="0.6" />
                    <path d="M7 19H25" stroke="white" strokeOpacity="0.6" />
                    <path d="M7 24H25" stroke="white" strokeOpacity="0.6" />
                    <path d="M7 29H25" stroke="white" strokeOpacity="0.6" />
                  </svg>
                )}
                {!account && showConnect && (
                  <svg
                    className="m-auto"
                    fill="none"
                    height="22"
                    viewBox="0 0 44 22"
                    width="44"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.45065 10.9993C4.45065 7.29435 7.46232 4.28268 11.1673 4.28268H19.834V0.166016H11.1673C5.18732 0.166016 0.333984 5.01935 0.333984 10.9993C0.333984 16.9793 5.18732 21.8327 11.1673 21.8327H19.834V17.716H11.1673C7.46232 17.716 4.45065 14.7043 4.45065 10.9993ZM13.334 13.166H30.6673V8.83268H13.334V13.166ZM32.834 0.166016H24.1673V4.28268H32.834C36.539 4.28268 39.5507 7.29435 39.5507 10.9993C39.5507 14.7043 36.539 17.716 32.834 17.716H24.1673V21.8327H32.834C38.814 21.8327 43.6673 16.9793 43.6673 10.9993C43.6673 5.01935 38.814 0.166016 32.834 0.166016Z"
                      fill="white"
                      fillOpacity="0.6"
                    />
                  </svg>
                )}
                <div className="text-base">
                  {!account && showConnect
                    ? 'Connect your wallet to view your orders'
                    : account && showConnect
                    ? 'You have not placed any orders'
                    : 'No orders have been placed'}
                </div>
              </td>
            </tr>
          )}
          {!loading &&
            page.map((row, i) => {
              prepareRow(row)
              return (
                <tr
                  className="h-[57px] bg-transparent text-sm text-[#D2D2D2]"
                  key={i}
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell, i) => {
                    return (
                      <td className="bg-transparent" key={i} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
        </tbody>
      </table>
      {!hidePagination && pageOptions.length > 0 && (
        <div className="absolute right-6 bottom-1 flex items-center justify-end space-x-2 !border-none text-[#696969]">
          <button className="btn btn-xs" disabled={!canPreviousPage} onClick={previousPage}>
            <DoubleArrowLeftIcon />
          </button>
          <span className="text-xs text-[#696969]">
            Page {pageIndex + 1} of {pageOptions.length}
          </span>
          <button className="btn btn-xs" disabled={!canNextPage} onClick={nextPage}>
            <DoubleArrowRightIcon />
          </button>
        </div>
      )}
    </div>
  )
}

interface OrderBookTableProps {
  derivedAuctionInfo: DerivedAuctionInfo
}

export const ActiveStatusPill = ({
  className = '',
  disabled = false,
  dot = true,
  title = 'Active',
  ...rest
}) => {
  return (
    <button
      className={`hover:none focus:none pointer-events-none relative inline-flex max-h-[30px] items-center space-x-2 rounded-full border border-transparent bg-[#1C701C] px-3 py-1 text-xs font-normal uppercase text-white shadow-sm focus:outline-none disabled:bg-[#696969] disabled:text-[#181A1C] ${className}`}
      disabled={disabled}
      type="button"
      {...rest}
    >
      {dot && !disabled && (
        <span className="relative flex h-[6px] w-[6px]">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#181A1C] opacity-25"></span>
          <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-[#181A1C] opacity-50"></span>
        </span>
      )}
      <span>{title}</span>
    </button>
  )
}

export const AuctionStatusPill = ({
  auction,
}: {
  auction: Pick<Auction, 'end' | 'orderCancellationEndDate' | 'clearingPrice'>
}) => {
  const { atStageEnded, status } = getAuctionStates(auction)
  return <ActiveStatusPill disabled={atStageEnded} title={atStageEnded ? 'ended' : status} />
}

export const BidTransactionLink = ({ order }) => {
  const hash = order.canceltx || order.claimtx || order.createtx

  if (!hash) return <span>N/A</span>

  return (
    <a href={getExplorerLink(hash, 'transaction')} rel="noreferrer" target="_blank">
      <svg
        fill="none"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.25 1H7.49292C7.90713 1 8.24292 1.33579 8.24292 1.75C8.24292 2.1297 7.96077 2.44349 7.59469 2.49315L7.49292 2.5H4.25C3.33183 2.5 2.57881 3.20711 2.5058 4.10647L2.5 4.25V11.75C2.5 12.6682 3.20711 13.4212 4.10647 13.4942L4.25 13.5H11.75C12.6682 13.5 13.4212 12.7929 13.4942 11.8935L13.5 11.75V8C13.5 7.58579 13.8358 7.25 14.25 7.25C14.6297 7.25 14.9435 7.53215 14.9932 7.89823L15 8V11.75C15 13.483 13.6435 14.8992 11.9344 14.9949L11.75 15H4.25C2.51697 15 1.10075 13.6435 1.00514 11.9344L1 11.75V4.25C1 2.51697 2.35645 1.10075 4.06558 1.00514L4.25 1ZM14.25 1L14.2674 1.0002C14.2875 1.00066 14.3075 1.00192 14.3274 1.00398L14.25 1C14.2968 1 14.3427 1.00429 14.3872 1.01251C14.398 1.01458 14.4097 1.01701 14.4214 1.01973C14.4448 1.02517 14.4673 1.03158 14.4893 1.03898C14.4991 1.0423 14.5095 1.04603 14.5198 1.04999C14.5391 1.05745 14.5575 1.06544 14.5755 1.07414C14.5893 1.08072 14.6032 1.08798 14.617 1.09571C14.6353 1.10603 14.653 1.11705 14.6703 1.12876C14.6807 1.13569 14.6911 1.14318 14.7014 1.15097C14.7572 1.19318 14.8068 1.24276 14.8488 1.29838L14.7803 1.21967C14.8148 1.25411 14.8452 1.29107 14.8715 1.32995C14.8825 1.34634 14.8932 1.36349 14.9031 1.38108C14.9113 1.39538 14.9189 1.41001 14.9261 1.42483C14.9335 1.44027 14.9406 1.45638 14.9471 1.47277C14.9512 1.48314 14.955 1.49324 14.9585 1.5034C14.9656 1.52376 14.9721 1.54529 14.9776 1.56722C14.9814 1.5828 14.9847 1.59822 14.9876 1.6137C14.9908 1.63097 14.9935 1.64933 14.9956 1.66788C14.9975 1.68621 14.9988 1.70389 14.9995 1.72159C14.9998 1.73042 15 1.74019 15 1.75V5.25C15 5.91884 14.1908 6.25316 13.7187 5.77937L12.502 4.558L8.53033 8.53033C8.23744 8.82322 7.76256 8.82322 7.46967 8.53033C7.2034 8.26406 7.1792 7.8474 7.39705 7.55379L7.46967 7.46967L11.443 3.495L10.2314 2.27937C9.76025 1.8065 10.0952 1 10.7627 1H14.25Z"
          fill="#9F9F9F"
        />
      </svg>
    </a>
  )
}

export const useBidStatus = (derivedAuctionInfo: DerivedAuctionInfo) => {
  const auctionIdentifier = parseURL(useParams<RouteAuctionIdentifier>())
  const { claimableBidFunds, claimableBonds } = useGetAuctionProceeds(
    auctionIdentifier,
    derivedAuctionInfo,
  )

  if (derivedAuctionInfo?.auctionState !== AuctionState.CLAIMING) return ''

  const claimBid = claimableBidFunds && Number(claimableBidFunds.toSignificant(6))
  const claimBond = claimableBonds && Number(claimableBonds.toSignificant(6))

  let bidStatus = ''
  if (!claimBid && claimBond) bidStatus = 'Filled'
  if (claimBid && claimBond) bidStatus = 'Partially filled'
  if (claimBid && !claimBond) bidStatus = 'Unfilled'

  return bidStatus
}

export const OrderBookTable: React.FC<OrderBookTableProps> = ({ derivedAuctionInfo }) => {
  const { data, loading } = useAuctionBids()
  const bids = data?.bids
  const { auctionEndDate, maturityDate } = useBondMaturityForAuction()
  const paymentToken = getTokenDisplay(derivedAuctionInfo?.biddingToken)
  const noBids = !Array.isArray(bids) || bids.length === 0
  const tableData = noBids
    ? []
    : bids.map((row) =>
        calculateRow(row, paymentToken, maturityDate, derivedAuctionInfo, auctionEndDate),
      )

  return <TableDesign columns={ordersTableColumns} data={tableData} loading={loading} />
}
