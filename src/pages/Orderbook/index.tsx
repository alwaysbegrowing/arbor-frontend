import React from 'react'
import { createGlobalStyle } from 'styled-components'

import { formatUnits } from '@ethersproject/units'
import dayjs from 'dayjs'

import { getBondStates } from '../BondDetail'

import { ReactComponent as AuctionsIcon } from '@/assets/svg/auctions.svg'
import { ReactComponent as ConvertIcon } from '@/assets/svg/convert.svg'
import { ReactComponent as SimpleIcon } from '@/assets/svg/simple.svg'
import { ActiveStatusPill } from '@/components/auction/OrderbookTable'
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorAndReload'
import { calculateInterestRate } from '@/components/form/InterestRateInputPanel'
import TokenLogo from '@/components/token/TokenLogo'
import { Bond } from '@/generated/graphql'
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
  const {
    asks,
    bids,
    loading: loadingOrderbook,
  } = useOrderbookPair(
    '0x5a2d26d95b07c28d735ff76406bd82fe64222dc1',
    '0x0d2147db3fa5e39b4821a1ed6553a7fa56554726',
  )
  const { data: bonds, loading: loadingBonds } = useBonds()
  if (!bids?.records) return
  console.log(bids)
  return (
    <>
      <GlobalStyle />
      <ErrorBoundaryWithFallback>
        {bids?.records?.map(
          ({ metaData: { remainingFillableTakerAmount }, order: { maker, taker } }) => (
            <>
              <span>remainingFillableTakerAmount: {remainingFillableTakerAmount}</span>
              <span>maker: {maker}</span>
              <span>taker: {taker}</span>
            </>
          ),
        )}
      </ErrorBoundaryWithFallback>
    </>
  )
}

export default Orderbook
