import React, { useState } from 'react'
import { createGlobalStyle } from 'styled-components'

import dayjs from 'dayjs'
import { ceil } from 'lodash'
import AuctionsIcon from 'src/assets/svg/components/Auctions'
import DividerIcon from 'src/assets/svg/components/Divider'
import OTCIcon from 'src/assets/svg/components/Otc'
import { TokenInfoWithLink } from 'src/components/auction/AuctionDetails'
import { AuctionStatusPill } from 'src/components/auction/OrderbookTable'
import Table from 'src/components/auctions/Table'
import { ErrorBoundaryWithFallback } from 'src/components/common/ErrorAndReload'
import Tooltip from 'src/components/common/Tooltip'
import { calculateInterestRate } from 'src/components/form/InterestRateInputPanel'
import { Auction } from 'src/generated/graphql'
import { useAuctions } from 'src/hooks/useAuction'
import { useSetNoDefaultNetworkId } from 'src/state/orderPlacement/hooks'
import { currentTimeInUTC } from 'src/utils/tools'

import { AllButton, AuctionButtonOutline, OTCButtonOutline } from '../Auction'
import { BondIcon } from '../Bonds'
import { TABLE_FILTERS } from '../Portfolio'

export const getAuctionStates = (
  auction: Pick<Auction, 'end' | 'orderCancellationEndDate' | 'clearingPrice'>,
) => {
  const { clearingPrice, end, orderCancellationEndDate } = auction
  // open for orders
  const atStageOrderPlacement = currentTimeInUTC() <= end * 1000

  // cancellable (can be open for orders and cancellable.
  // This isn't an auction status rather an ability to cancel your order or not.)
  const atStageOrderPlacementAndCancelation = currentTimeInUTC() <= orderCancellationEndDate

  // AKA settling (can be settled, but not yet done so)
  const atStageNeedsSettled = currentTimeInUTC() >= end * 1000

  // claiming (settled)
  const atStageFinished = !!clearingPrice

  const atStageEnded = currentTimeInUTC() >= end * 1000

  let status = 'Unknown'
  if (atStageEnded) status = 'ended'

  // Auction can be settled
  if (atStageNeedsSettled) status = 'settlement'

  // Orders can be claimed
  if (atStageFinished) status = 'claiming'

  // Orders can be placed
  if (atStageOrderPlacement) status = 'ongoing'

  return {
    atStageOrderPlacement,
    atStageOrderPlacementAndCancelation,
    atStageNeedsSettled,
    atStageFinished,
    atStageEnded,
    status,
  }
}

const GlobalStyle = createGlobalStyle`
  .siteHeader {
    background: #1C701C !important;
  }
`

const columns = [
  {
    Header: 'Offering',
    accessor: 'offering',
    align: 'flex-start',
    style: { height: '100%', justifyContent: 'center' },
    filter: 'searchInTags',
  },
  {
    Header: 'Minimum Price',
    tooltip: 'Minimum price a bond can be sold for. Bids below this price will not be accepted.',
    accessor: 'minimumPrice',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'Maximum YTM',
    tooltip:
      'Maximum yield to maturity the issuer is willing to pay. This is calculated using the minimum bond price.',
    accessor: 'maximumYTM',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'End Date',
    accessor: 'endDate',
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

const Offerings = () => {
  const { data: allAuctions, loading } = useAuctions()
  const [tableFilter, setTableFilter] = useState(TABLE_FILTERS.ALL)

  const tableData = []

  useSetNoDefaultNetworkId()

  allAuctions?.forEach((auction) => {
    tableData.push({
      id: auction.id,
      minimumPrice: (
        <TokenInfoWithLink
          auction={auction}
          value={ceil(auction.minimumBondPrice, auction?.bidding?.decimals)}
          withLink={false}
        />
      ),
      search: JSON.stringify(auction),
      auctionId: `#${auction.id}`,
      type: 'auction', // TODO: currently hardcoded since no OTC exists
      price: `1 ${auction?.bidding?.symbol}`,
      maximumYTM: calculateInterestRate({
        price: auction.minimumBondPrice,
        maturityDate: auction.bond.maturityDate,
        startDate: auction.end,
      }),
      status: <AuctionStatusPill auction={auction} />,
      maturityValue: `1 ${auction?.bond.paymentToken.symbol}`,
      endDate: (
        <span className="uppercase">
          {
            <Tooltip
              left={dayjs(auction?.end * 1000)
                .utc()
                .tz()
                .format('ll')}
              tip={dayjs(auction?.end * 1000)
                .utc()
                .tz()
                .format('LLLL z ZZ (zzz)')}
            />
          }
        </span>
      ),
      offering: (
        <BondIcon
          auctionId={auction?.id}
          icon
          id={auction?.bond?.id}
          name={auction?.bond?.name}
          symbol={auction?.bond.symbol}
        />
      ),
      url: `/offerings/${auction.id}`,
    })
  })

  return (
    <>
      <GlobalStyle />
      <ErrorBoundaryWithFallback>
        <Table
          columns={columns}
          data={tableData.filter(({ type }) => (tableFilter ? type === tableFilter : true))}
          emptyDescription="There are no offerings at the moment"
          emptyLogo={
            <>
              <AuctionsIcon height={36} width={36} /> <OTCIcon height={36} width={36} />
            </>
          }
          legendIcons={
            <>
              <AllButton
                active={tableFilter === TABLE_FILTERS.ALL}
                onClick={() => setTableFilter(TABLE_FILTERS.ALL)}
              />
              <DividerIcon />
              <AuctionButtonOutline
                active={tableFilter === TABLE_FILTERS.AUCTION}
                onClick={() => setTableFilter(TABLE_FILTERS.AUCTION)}
                plural
              />
              <OTCButtonOutline
                active={tableFilter === TABLE_FILTERS.OTC}
                onClick={() => setTableFilter(TABLE_FILTERS.OTC)}
              />
            </>
          }
          loading={loading}
          name="offerings"
          title="Offerings"
        />
      </ErrorBoundaryWithFallback>
    </>
  )
}

export default Offerings
