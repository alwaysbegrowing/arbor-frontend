import React from 'react'
import { createGlobalStyle } from 'styled-components'

import { FormProvider, useForm } from 'react-hook-form'

import OrderbookTable from '@/components/OrderbookCreate/order/orderbookTable'
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorAndReload'

const GlobalStyle = createGlobalStyle`
  .siteHeader {
    background: #293327 !important;
  }
`

const columns = (showAmount = false) => [
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
    isVisible: !showAmount,
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

const Orderbook = () => {
  const methods = useForm({
    mode: 'onChange',
  })
  return (
    <>
      <FormProvider {...methods}>
        <GlobalStyle />
        <ErrorBoundaryWithFallback>
          <div className="pt-3">
            <OrderbookTable />
          </div>
        </ErrorBoundaryWithFallback>
      </FormProvider>
    </>
  )
}

export default Orderbook
