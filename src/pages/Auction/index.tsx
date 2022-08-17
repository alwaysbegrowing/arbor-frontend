import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'

import { twMerge } from 'tailwind-merge'

import { ReactComponent as AuctionsIcon } from '../../assets/svg/auctions.svg'
import { ReactComponent as ConvertIcon } from '../../assets/svg/convert.svg'
import { ReactComponent as OTCIcon } from '../../assets/svg/otc.svg'
import { ReactComponent as SimpleIcon } from '../../assets/svg/simple.svg'
import AuctionBody from '../../components/auction/AuctionBody'
import { ErrorBoundaryWithFallback } from '../../components/common/ErrorAndReload'
import WarningModal from '../../components/modals/WarningModal'
import TokenLogo from '../../components/token/TokenLogo'
import { useAuction } from '../../hooks/useAuction'
import { useDerivedAuctionInfo } from '../../state/orderPlacement/hooks'
import { RouteAuctionIdentifier, parseURL } from '../../state/orderPlacement/reducer'

const GlobalStyle = createGlobalStyle`
  .siteHeader {
    background: #3D8367 !important;
  }
`

export const GhostButton = ({ active = false, children, ...props }) => {
  if (active) {
    return <ActiveButton {...props}>{children}</ActiveButton>
  }
  return (
    <button
      className={`${
        !props.onClick ? 'pointer-events-none' : ''
      } inline-flex h-[32px] items-center space-x-2 rounded-full border border-blue-100 border-opacity-50 bg-transparent py-2 px-5 text-xs uppercase leading-none text-white`}
      {...props}
    >
      {children}
    </button>
  )
}

export const AllButton = ({ ...props }) => <GhostButton {...props}>All</GhostButton>

export const ActiveButton = ({ children, ...props }) => (
  <button
    className="pointer-events-none inline-flex h-[32px] items-center space-x-2 rounded-full border border-transparent bg-black py-2 px-5 text-xs uppercase leading-none text-white"
    {...props}
  >
    {children}
  </button>
)

export const ConvertButtonOutline = ({ ...props }) => (
  <GhostButton {...props}>
    <ConvertIcon height={12.57} width={12.57} /> <span>Convertible</span>
  </GhostButton>
)

export const SimpleButtonOutline = ({ ...props }) => (
  <GhostButton {...props}>
    <SimpleIcon height={12.57} width={12.57} /> <span>Simple</span>
  </GhostButton>
)

export const AuctionButtonOutline = ({ plural = false, ...props }) => (
  <GhostButton {...props}>
    <AuctionsIcon height={12.57} width={12.57} />
    <span>Auction{plural && 's'}</span>
  </GhostButton>
)

export const OTCButtonOutline = ({ ...props }) => (
  <GhostButton {...props}>
    <OTCIcon height={12.57} width={12.57} />
    <span>OTC</span>
  </GhostButton>
)

// Strangely couldn't use tailwind h-[9px] or min-h- , had to specify style = manually
export const LoadingBox = ({ className = '', height }) => (
  <div
    className={twMerge(
      'mt-8 h-full bg-gradient-to-r from-[#181A1C] to-[#1F2123] rounded-lg shadow animate-pulse',
      className,
    )}
    style={{ height }}
  />
)

export const TwoGridPage = ({ leftChildren, rightChildren }) => (
  <main className="mt-[15px] px-0 pb-8">
    {/* Main 3 column grid */}
    <div className="grid grid-cols-1 items-start gap-4 pb-32 lg:grid-cols-3 lg:gap-8">
      {/* Left column */}
      <div className="grid grid-cols-1 gap-4 lg:col-span-2">
        <section aria-labelledby="section-1-title">{leftChildren}</section>
      </div>

      {/* Right column */}
      <div className="order-first grid grid-cols-1 gap-4 lg:order-last">
        <section aria-labelledby="section-2-title">{rightChildren}</section>
      </div>
    </div>
  </main>
)

export const LoadingTwoGrid = () => (
  <>
    <div className="flex flex-wrap content-center items-end justify-center py-2 md:justify-between">
      <div className="flex flex-wrap items-center space-x-6">
        <div className="hidden md:flex">
          <div className="h-[66px] w-[66px] animate-pulse rounded-xl bg-transparent"></div>
        </div>
        <div className="space-y-3">
          <div className="h-[33px] w-[425px] animate-pulse rounded bg-transparent"></div>
          <div className="h-[22px] w-[425px] animate-pulse rounded bg-transparent"></div>
        </div>
      </div>
      <div className="h-[32px] w-[120px] animate-pulse rounded-full bg-transparent"></div>
    </div>

    <TwoGridPage
      leftChildren={
        <>
          <LoadingBox height={489} />
          <LoadingBox height={579} />
          <LoadingBox height={521} />
        </>
      }
      rightChildren={
        <>
          <LoadingBox height={404} />
          <LoadingBox height={223} />
        </>
      }
    />
  </>
)

const AuctionPage = ({ data: { auctionIdentifier, derivedAuctionInfo, graphInfo }, loading }) => {
  const navigate = useNavigate()
  const invalidAuction = !loading && (!auctionIdentifier || derivedAuctionInfo === undefined)

  if (invalidAuction) {
    return (
      <>
        <GlobalStyle />
        <WarningModal
          content={`This auction doesn't exist or it hasn't started yet.`}
          isOpen
          onDismiss={() => navigate('/offerings')}
        />
      </>
    )
  }

  return (
    <>
      <GlobalStyle />
      <ErrorBoundaryWithFallback>
        {loading && <LoadingTwoGrid />}
        {!loading && (
          <>
            <div className="flex flex-wrap content-center items-end justify-center py-2 md:justify-between">
              <div className="flex flex-wrap items-center space-x-6">
                <div className="hidden md:flex">
                  <TokenLogo
                    size="60px"
                    square
                    token={{
                      address: graphInfo?.bond.id,
                      symbol: graphInfo?.bond.name,
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-4xl capitalize text-white">{graphInfo?.bond.name} Auction</h1>
                  <p className="text-2sm text-[#E0E0E0]">{graphInfo?.bond.symbol}</p>
                </div>
              </div>
              <AuctionButtonOutline />
            </div>

            <AuctionBody
              auctionIdentifier={auctionIdentifier}
              derivedAuctionInfo={derivedAuctionInfo}
              graphInfo={graphInfo}
            />
          </>
        )}
      </ErrorBoundaryWithFallback>
    </>
  )
}

const Auction: React.FC = () => {
  const auctionIdentifier = parseURL(useParams<RouteAuctionIdentifier>())
  const { data: derivedAuctionInfo, loading } = useDerivedAuctionInfo(auctionIdentifier)
  const { data: graphInfo, loading: graphLoading } = useAuction(auctionIdentifier?.auctionId)

  return (
    <AuctionPage
      data={{ auctionIdentifier, derivedAuctionInfo, graphInfo }}
      loading={loading || graphLoading}
    />
  )
}

export default Auction
