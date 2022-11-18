import React, { useEffect, useState } from 'react'
import { createGlobalStyle } from 'styled-components'

import { AddressZero, One } from '@ethersproject/constants'
import { formatUnits } from '@ethersproject/units'
import dayjs from 'dayjs'

import { useActiveWeb3React } from '../../hooks'
import { AllButton, ConvertButtonOutline, SimpleButtonOutline } from '../Auction'
import { getBondStates } from '../BondDetail'
import { sellLimitOrder } from '../BondDetail/OrderbookApi'
import { TABLE_FILTERS } from '../Portfolio'

import { ReactComponent as AuctionsIcon } from '@/assets/svg/auctions.svg'
import { ReactComponent as ConvertIcon } from '@/assets/svg/convert.svg'
import { ReactComponent as DividerIcon } from '@/assets/svg/divider.svg'
import { ReactComponent as SimpleIcon } from '@/assets/svg/simple.svg'
import { ExchangeProxy } from '@/components/ProductCreate/SelectableTokens'
import { ActiveStatusPill } from '@/components/auction/OrderbookTable'
import Table from '@/components/auctions/Table'
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorAndReload'
import { calculateInterestRate } from '@/components/form/InterestRateInputPanel'
import TokenLogo from '@/components/token/TokenLogo'
import { Bond } from '@/generated/graphql'
import { useBonds } from '@/hooks/useBond'
import { useSetNoDefaultNetworkId } from '@/state/orderPlacement/hooks'

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

export const createTable = (data?: Bond[]) =>
  data.map((bond: Bond) => {
    const {
      auctions,
      clearingPrice,
      createdAt,
      decimals,
      id,
      maturityDate,
      maxSupply,
      name,
      paymentToken,
      symbol,
      type,
    } = bond

    const fixedYTM =
      calculateInterestRate({
        price: clearingPrice,
        maturityDate,
        startDate: auctions?.[0]?.end,
      }) || '-'

    return {
      id,
      search: JSON.stringify(bond),
      type,
      issuanceDate: (
        <span className="uppercase">
          {dayjs(createdAt * 1000)
            .utc()
            .tz()
            .format('LL')}
        </span>
      ),
      cost: clearingPrice
        ? `${Number(formatUnits(BigInt(clearingPrice * maxSupply), decimals)).toLocaleString()} ${
            paymentToken.symbol
          }`
        : '-',
      fixedYTM,
      bond: <BondIcon id={id} name={name} symbol={symbol} type={type} />,

      amountIssued: maxSupply ? Number(formatUnits(maxSupply, decimals)).toLocaleString() : '-',
      amount: maxSupply ? `${Number(formatUnits(maxSupply, decimals)).toLocaleString()}` : '-',
      maturityValue: maxSupply
        ? `${Number(formatUnits(maxSupply, decimals)).toLocaleString()} ${paymentToken.symbol}`
        : `1 ${paymentToken.symbol}`,

      currency: paymentToken.symbol,

      status: getBondStates(bond).isMatured ? (
        <ActiveStatusPill disabled dot={false} title="Matured" />
      ) : (
        <ActiveStatusPill dot={false} title="Active" />
      ),
      maturityDate: (
        <span className="uppercase">
          {dayjs(maturityDate * 1000)
            .utc()
            .tz()
            .format('ll')}
        </span>
      ),

      url: `/bonds/${id}`,
    }
  })

const Orderbook = () => {
  const { data, loading } = useBonds()
  const [tableFilter, setTableFilter] = useState(TABLE_FILTERS.ALL)
  const { account, chainId, signer } = useActiveWeb3React()
  console.log(signer)
  const tableData = !data
    ? []
    : !tableFilter
    ? createTable(data as Bond[])
    : createTable(data as Bond[]).filter(({ type }) => type === tableFilter)
  useSetNoDefaultNetworkId()
  const numberOfOptions = One
  const makerToken = '0xfab4AF4EA2EB609868cDb4f744155d67f0A5BF41'
  const takerToken = '0xfab4AF4EA2EB609868cDb4f744155d67f0A5BF41'

  useEffect(() => {
    if (!signer) {
      return console.log('hi')
    } else {
      console.log('by')
    }
    const orderData = {
      maker: '0xfab4AF4EA2EB609868cDb4f744155d67f0A5BF41', //account,
      signer,
      isBuy: false,
      nbrOptions: numberOfOptions,
      collateralDecimals: 18,
      makerToken: makerToken,
      takerToken: takerToken,
      limitPrice: One,
      orderExpiry: 5,
      chainId: chainId,
      exchangeProxy: ExchangeProxy[chainId],
      poolId: AddressZero,
    }
    const postSellLimitOrder = async () => {
      await sellLimitOrder(orderData)
    }
    postSellLimitOrder()
  }, [account, chainId, signer, numberOfOptions])

  return (
    <>
      <GlobalStyle />
      <ErrorBoundaryWithFallback>
        <Table
          columns={columns()}
          data={tableData}
          emptyActionClass="!bg-[#293327]"
          emptyDescription="There are no bonds at the moment"
          emptyLogo={
            <>
              <ConvertIcon height={36} width={36} /> <SimpleIcon height={36} width={36} />
            </>
          }
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
          name="orderbook"
          title="Orderbook"
        />
      </ErrorBoundaryWithFallback>
    </>
  )
}

export default Orderbook
