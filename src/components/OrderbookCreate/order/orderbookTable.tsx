import React, { useRef } from 'react'
import styled from 'styled-components'

import dayjs from 'dayjs'
import { useFormContext } from 'react-hook-form'
import { useTable } from 'react-table'

import { PageTitle } from '../../pureStyledComponents/PageTitle'

import { ReactComponent as ConvertIcon } from '@/assets/svg/convert.svg'
import { ReactComponent as SimpleIcon } from '@/assets/svg/simple.svg'
import { BondTokenDetails } from '@/components/ProductCreate/BondTokenDetails'
import { Selector } from '@/components/ProductCreate/selectors/BorrowTokenSelector'
import { NoBondFound } from '@/components/ProductCreate/selectors/CollateralTokenSelector'
import { ActiveStatusPill } from '@/components/auction/OrderbookTable'
import Tooltip from '@/components/common/Tooltip'
import { useBonds } from '@/hooks/useBond'
import { useBondsPortfolio } from '@/hooks/useBondsPortfolio'
import { useOrderbookPair } from '@/hooks/useOrderbook'

const Wrapper = styled.div`
  margin-top: -30px;
`

const SectionTitle = styled(PageTitle)`
  font-weight: 400;
  font-size: 42px;
  color: #e0e0e0;
  margin: 0;
`

const columns = [
  {
    Header: 'Type',
    accessor: 'type',
    align: 'flex-start',
    style: { height: '100%', justifyContent: 'center' },
    filter: 'searchInTags',
  },
  {
    Header: 'Maker Address',
    accessor: 'maker',
    tooltip: 'The address of the wallet making the order.',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'Maker Amount',
    accessor: 'makerAmount',
    tooltip: 'Amount of tokens the maker is selling.',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'Fillable Amount',
    accessor: 'remainingFillableAmount',
    tooltip: 'Amount of tokens needed to fulfill the order.',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'Taker Amount',
    accessor: 'takerAmount',
    tooltip: 'Amount of tokens maker is exchanging for the total maker amount.',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'Expiration Date',
    accessor: 'expiry',
    tooltip: 'Date the order expires.',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
]

const OrderbookTable = () => {
  const { watch } = useFormContext()

  const sectionHead = useRef(null)

  const [bondToAuction] = watch([
    'bondToAuction', // makerToken
  ])

  const { data: dataPortfolio } = useBondsPortfolio()

  const portfolioData = {}

  dataPortfolio?.forEach((bond) => {
    portfolioData[bond?.id] = bond
  })

  const { data: bondData, loading } = useBonds()

  console.log({ bondData })

  console.log({ portfolioData })

  const AllBondsList = () => {
    const fullData = bondData?.map((bond) => {
      if (bond.id in portfolioData) {
        const tokenBalances = portfolioData[bond.id].tokenBalances
        return { ...bond, tokenBalances }
      } else {
        return { ...bond }
      }
    })

    if (!bondData?.length && !loading) {
      return <Selector OptionEl={NoBondFound} disabled name="bondToAuction" options={fullData} />
    }
    return <Selector OptionEl={BondTokenDetails} name="bondToAuction" options={fullData} />
  }

  const {
    asks,
    bids,
    loading: loadingOrderbook,
  } = useOrderbookPair('0x5a2d26d95b07c28d735ff76406bd82fe64222dc1', bondToAuction?.id)
  console.log({ asks, bids })

  const data = []

  asks?.records?.forEach((record) => {
    data.push({
      type: <ActiveStatusPill title="Buy Bonds" />,
      maker: record.order.maker,
      makerAmount: record.order.makerAmount / 10 ** 6 + ' USDC',
      remainingFillableAmount: record.metaData.remainingFillableTakerAmount / 10 ** 6 + ' bonds',
      takerAmount: record.order.takerAmount / 10 ** 6 + ' bonds',
      expiry: dayjs.unix(record.order.expiry).local().format('L LT'),
    })
  })

  bids?.records?.forEach((record) => {
    data.push({
      type: <ActiveStatusPill title="Sell Bonds" />,
      maker: record.order.maker,
      makerAmount: record.order.makerAmount / 10 ** 6 + ' bonds',
      remainingFillableAmount: record.metaData.remainingFillableTakerAmount / 10 ** 6 + ' USDC',
      takerAmount: record.order.takerAmount / 10 ** 6 + ' USDC',
      expiry: dayjs.unix(record.order.expiry).local().format('L LT'),
    })
  })

  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } = useTable({
    columns,
    data,
  })

  return (
    <>
      <Wrapper ref={sectionHead}>
        <div className="mb-10 flex flex-wrap content-center items-end py-2 md:justify-between">
          <div className="flex flex-col space-y-4">
            <SectionTitle>Limit Orders</SectionTitle>
          </div>
          <div className="bg-[#1F2123]] form-control w-96">
            <AllBondsList />
          </div>
        </div>
        <div
          className="min-h-[492px] overflow-auto overscroll-contain scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-700"
          style={{
            maxHeight: !rows.length ? '100%' : 'calc(100vh - 391px)',
            height: !rows.length ? 'calc(100vh - 391px)' : 'inherit',
          }}
        >
          <table className="table h-full w-full" {...getTableProps()}>
            <thead className="sticky top-3 z-[1]">
              {headerGroups.map((headerGroup, i) => (
                <tr
                  className="border-b border-b-[#D5D5D519]"
                  key={i}
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {headerGroup.headers.map((column, i) => (
                    <th
                      className="bg-base-100 text-xs font-normal tracking-widest text-[#696969]"
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
                [...Array(10).keys()].map((z) => (
                  <tr className="h-[57px] bg-transparent text-sm text-[#D2D2D2]" key={z}>
                    {[...Array(columns.length).keys()].map((i) => (
                      <td className="bg-transparent text-center text-[#696969]" key={i}>
                        <div className="my-4 h-4 w-full max-w-sm animate-pulse rounded bg-gradient-to-r from-[#1F2123] to-[#181A1C]"></div>
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading && !rows.length && (
                <tr className="h-[57px] bg-transparent text-sm text-[#D2D2D2]">
                  <td
                    className="space-y-7 bg-transparent py-[100px] text-center text-[#696969]"
                    colSpan={columns.length}
                  >
                    <div className="flex justify-center space-x-4 opacity-60">
                      <>
                        <ConvertIcon height={36} width={36} /> <SimpleIcon height={36} width={36} />
                      </>
                    </div>
                    <div className="text-base text-[#696969]">
                      There are no orders at the moment
                    </div>
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((row, i) => {
                  prepareRow(row)
                  return (
                    <tr
                      className="hover cursor-pointer bg-transparent text-2sm text-[#D2D2D2]"
                      key={i}
                      {...row.getRowProps()}
                    >
                      {row.cells.map((cell, i) => (
                        <td
                          className="max-w-xs overflow-hidden text-ellipsis bg-transparent"
                          key={i}
                          {...cell.getCellProps()}
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </Wrapper>
    </>
  )
}

export default OrderbookTable
