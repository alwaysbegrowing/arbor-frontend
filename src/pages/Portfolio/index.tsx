import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'

import Table from '../../components/auctions/Table'
import { ErrorBoundaryWithFallback } from '../../components/common/ErrorAndReload'
import { useActiveWeb3React } from '../../hooks'
import { useBondsPortfolio } from '../../hooks/useBondsPortfolio'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useSetNoDefaultNetworkId } from '../../state/orderPlacement/hooks'
import { AllButton, ConvertButtonOutline, SimpleButtonOutline } from '../Auction'
import { calculatePortfolioRow, getBondStates } from '../BondDetail'
import { BondIcon } from '../Bonds'

import ConnectIcon from '@/assets/svg/components/Connect'
import DividerIcon from '@/assets/svg/components/Divider'
import WalletIcon from '@/assets/svg/components/Wallet'
import { ActiveStatusPill } from '@/components/auction/OrderbookTable'

const columns = [
  {
    Header: 'Bond',
    accessor: 'bond',
    align: 'flex-start',
    style: { height: '100%', justifyContent: 'center' },
    filter: 'searchInTags',
  },
  {
    Header: 'Amount',
    accessor: 'amount',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'Cost',
    accessor: 'cost',
    align: 'flex-start',
    tooltip:
      'How much you paid for your bonds. To get this number, we assume you purchased the bonds through the Arbor protocol. If you purchased them off the platform through an OTC deal or AMM, this number may be incorrect.',
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'Value at maturity',
    accessor: 'maturityValue',
    align: 'flex-start',
    tooltip:
      'The amount your bonds are redeemable for at the maturity date assuming a default does not occur.',
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
    Header: 'Fixed YTM',
    tooltip: 'Yield to maturity',
    accessor: 'fixedYTM',
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

const GlobalStyle = createGlobalStyle`
  .siteHeader {
    background: #262728 !important;
  }
`

export const TABLE_FILTERS = {
  ALL: '',
  CONVERT: 'convert',
  SIMPLE: 'simple',
  AUCTION: 'auction',
  OTC: 'otc',
}

const Portfolio = () => {
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const navigate = useNavigate()
  const [tableFilter, setTableFilter] = useState(TABLE_FILTERS.ALL)

  const { data, loading } = useBondsPortfolio()

  const tableData = (
    data?.map((row) => ({
      ...calculatePortfolioRow(row),
      bond: <BondIcon id={row?.id} name={row?.name} symbol={row?.symbol} type={row?.type} />,
      type: row.type,
      url: `/bonds/${row.id}`,
      search: JSON.stringify(row),
      status: getBondStates(row).isMatured ? (
        <ActiveStatusPill disabled dot={false} title="Matured" />
      ) : (
        <ActiveStatusPill dot={false} title="Active" />
      ),
    })) || []
  ).filter(({ type }) => (!tableFilter ? true : type === tableFilter))

  const emptyActionText = account ? 'Go to offerings' : 'Connect wallet'
  const emptyActionClick = account ? () => navigate('/offerings') : toggleWalletModal
  const emptyDescription = account
    ? 'Your portfolio is empty'
    : 'Connect your wallet to view your portfolio'
  const emptyLogo = account ? (
    <WalletIcon height={49.5} width={51} />
  ) : (
    <ConnectIcon height={49.5} width={51} />
  )

  useSetNoDefaultNetworkId()

  return (
    <>
      <GlobalStyle />
      <ErrorBoundaryWithFallback>
        <Table
          columns={columns}
          data={tableData}
          emptyActionClick={emptyActionClick}
          emptyActionText={emptyActionText}
          emptyDescription={emptyDescription}
          emptyLogo={emptyLogo}
          legendIcons={
            <>
              <AllButton
                active={tableFilter === TABLE_FILTERS.ALL}
                onClick={() => setTableFilter(TABLE_FILTERS.ALL)}
              />
              <DividerIcon />
              <ConvertButtonOutline
                active={tableFilter === TABLE_FILTERS.CONVERT}
                onClick={() => setTableFilter(TABLE_FILTERS.CONVERT)}
              />
              <SimpleButtonOutline
                active={tableFilter === TABLE_FILTERS.SIMPLE}
                onClick={() => setTableFilter(TABLE_FILTERS.SIMPLE)}
              />
            </>
          }
          loading={loading}
          name="bonds"
          title="Portfolio"
        />
      </ErrorBoundaryWithFallback>
    </>
  )
}

export default Portfolio
