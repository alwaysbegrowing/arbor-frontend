import React from 'react'
import { createGlobalStyle } from 'styled-components'

// import { formatUnits } from '@ethersproject/units'
// import dayjs from 'dayjs'

import { ReactComponent as AuctionsIcon } from '@/assets/svg/auctions.svg'
import { ReactComponent as ConvertIcon } from '@/assets/svg/convert.svg'
import { ReactComponent as SimpleIcon } from '@/assets/svg/simple.svg'
// import { ActiveStatusPill } from '@/components/auction/OrderbookTable'
import Table from '@/components/auctions/Table'
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorAndReload'
import TokenLogo from '@/components/token/TokenLogo'
import { useBonds } from '@/hooks/useBond'
import { useOrderbookPair } from '@/hooks/useOrderbook'

const GlobalStyle = createGlobalStyle`
  .siteHeader {
    background: #293327 !important;
  }
`

const columns = (showAmount = false) => [
  {
    Header: 'Bond',
    accessor: 'bond',
    align: 'flex-start',
    style: { height: '100%', justifyContent: 'center' },
    filter: 'searchInTags',
  },
  {
    Header: 'Amount issued',
    accessor: 'amountIssued',
    tooltip: 'The number of bonds the borrower issued.',
    align: 'flex-start',
    isVisible: !showAmount,
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'Issuance date',
    accessor: 'issuanceDate',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'Maturity Date',
    accessor: 'maturityDate',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'Currency',
    accessor: 'currency',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'Status',
    accessor: 'status',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
]

export const BondIcon = ({ auctionId = null, icon = null, id, name, symbol, type = null }) => {
  // used to get currentPrice of auction. might not need this yet
  // useOrderbookDataCallback({ auctionId }) // TODO this is bad it calls the gnosis api for all these auctions
  return (
    <div className="flex flex-row items-center space-x-4">
      <div className="flex">
        <TokenLogo
          size="41px"
          square
          token={{
            address: id,
            symbol: name,
          }}
        />
      </div>
      <div className="flex flex-col text-lg text-[#EEEFEB]">
        <div className="flex items-center space-x-2 capitalize">
          <span>{name.toLowerCase()} </span>
          {icon && <AuctionsIcon width={15} />}
          {type && (type === 'convert' ? <ConvertIcon width={15} /> : <SimpleIcon width={15} />)}
        </div>
        <p className="text-sm uppercase text-[#9F9F9F]">{symbol}</p>
      </div>
    </div>
  )
}

export const createTable = (data) => {
  console.log(data)
  data?.records?.map((metaData: { remainingFillableTakerAmount }, order: { maker }) => {
    return {
      metaData,
      order,
    }
  })
}

const Orderbook = () => {
  const {
    asks,
    bids,
    loading: loadingOrderbook,
  } = useOrderbookPair(
    '0x5a2d26d95b07c28d735ff76406bd82fe64222dc1',
    '0x21a6e009924989673ed8c487a6719cd248b227df',
  )
  // console.log({ asks, bids })

  // console.log(bids, typeof asks)

  // const askData = Object.values(asks?.records)

  // console.log({ askData })

  // const { data, loading } = useBonds()
  // const [tableFilter, setTableFilter] = useState(TABLE_FILTERS.ALL)

  const askData = !asks ? [] : createTable(asks)

  const { data: bonds, loading: loadingBonds } = useBonds()
  if (!bids?.records) return
  return (
    <>
      <GlobalStyle />
      <ErrorBoundaryWithFallback>
        <Table
          columns={columns()}
          data={askData}
          emptyActionClass="!bg-[#293327]"
          emptyDescription="There are no bonds at the moment"
          emptyLogo={
            <>
              <ConvertIcon height={36} width={36} /> <SimpleIcon height={36} width={36} />
            </>
          }
          legendIcons={undefined}
          loading={loadingOrderbook}
          name="bonds"
          title="Bonds"
        />
      </ErrorBoundaryWithFallback>
    </>
  )
}

export default Orderbook
