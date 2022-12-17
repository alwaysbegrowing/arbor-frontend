import React, { RefObject, createRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Transition } from '@headlessui/react'
import { DoubleArrowRightIcon } from '@radix-ui/react-icons'

import { useBondExtraDetails } from '../../../hooks/useBondExtraDetails'
import { TwoGridPage } from '../../../pages/Auction'
import { getBondStates } from '../../../pages/BondDetail'
import { AuctionState, DerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { forceDevData } from '../../Dev'
import TokenLink from '../../token/TokenLink'
import TokenLogo from '../../token/TokenLogo'
import AuctionDetails from '../AuctionDetails'
import AuctionSettle from '../AuctionSettle'
import AuctionTour from '../AuctionTour'
import Claimer from '../Claimer'
import { ExtraDetailsItem } from '../ExtraDetailsItem'
import OrderPlacement from '../OrderPlacement'
import { OrderBookContainer } from '../OrderbookContainer'

import { Auction } from '@/generated/graphql'

interface AuctionBodyProps {
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
  graphInfo: Auction
}

const WarningCard = () => {
  const [show, setShow] = useState(true)
  return (
    <Transition
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      show={show}
    >
      <div className="card-bordered card">
        <div className="card-body">
          <div className="flex flex-row items-center space-x-2">
            <svg
              fill="none"
              height="14"
              viewBox="0 0 15 14"
              width="15"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M7.801 14C11.7702 14 14.9879 10.866 14.9879 7C14.9879 3.13401 11.7702 0 7.801 0C3.83179 0 0.614105 3.13401 0.614105 7C0.614105 10.866 3.83179 14 7.801 14ZM6.80125 3.52497C6.78659 3.23938 7.02037 3 7.31396 3H8.28804C8.58162 3 8.81541 3.23938 8.80075 3.52497L8.59541 7.52497C8.58175 7.79107 8.35625 8 8.0827 8H7.5193C7.24575 8 7.02025 7.79107 7.00659 7.52497L6.80125 3.52497ZM6.7743 10C6.7743 9.44772 7.23397 9 7.801 9C8.36803 9 8.8277 9.44772 8.8277 10C8.8277 10.5523 8.36803 11 7.801 11C7.23397 11 6.7743 10.5523 6.7743 10Z"
                fill="#EDA651"
                fillRule="evenodd"
              />
            </svg>
            <span className="text-[#EDA651]">Warning</span>
          </div>
          <div className="text-sm text-[#9F9F9F]">
            Purchasing bonds is risky and may lead to complete or partial loss of funds. Do conduct
            your own due diligence and consult your financial advisor before making any investment
            decisions.{' '}
            <a
              className="text-sm font-normal normal-case underline"
              href="https://docs.arbor.finance/resources/risks"
              rel="noreferrer"
              target="_blank"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </Transition>
  )
}

const BondCard = ({
  bondTitleRef,
  graphInfo,
}: {
  graphInfo: Auction
  bondTitleRef: RefObject<HTMLDivElement>
}) => {
  const extraDetails = useBondExtraDetails(graphInfo?.bond.id)
  const navigate = useNavigate()
  const { isConvertBond } = getBondStates(graphInfo?.bond)

  return (
    <div className="bond-card-color card-bordered card shadow-sm">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title">Bond information</h2>
          <button
            className="btn-primary btn-sm btn space-x-2 rounded-md bg-[#293327] !text-xxs font-normal"
            onClick={() => navigate(`/bonds/${graphInfo?.bond.id || ''}`)}
          >
            <span>Learn more</span>
            <span>
              <DoubleArrowRightIcon />
            </span>
          </button>
        </div>

        <div className="flex items-end justify-between text-sm text-[#9F9F9F]" ref={bondTitleRef}>
          <div className="flex cursor-pointer items-center space-x-4">
            <TokenLogo
              size={'49px'}
              square
              token={{
                address: graphInfo?.bond.id,
                symbol: graphInfo?.bond.name,
              }}
            />

            <div className="space-y-2">
              <h2 className="text-2xl font-normal capitalize text-white">
                {graphInfo?.bond.name.toLowerCase() || 'Bond Name'}
              </h2>
              <p className="text-xs font-normal uppercase text-[#9F9F9F]">
                <TokenLink token={graphInfo?.bond} withLink />
              </p>
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 gap-x-12 gap-y-8 pt-12 ${
            isConvertBond ? 'md:grid-cols-3' : 'md:grid-cols-4'
          }`}
        >
          {extraDetails.map((item, index) => (
            <ExtraDetailsItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}

const AuctionBody = (props: AuctionBodyProps) => {
  const { auctionIdentifier, derivedAuctionInfo, graphInfo } = props
  const [isMobile, setIsMobile] = useState(false)
  const auctionInformationRef = createRef<HTMLHeadingElement>()
  const bondTitleRef = createRef<HTMLDivElement>()
  const issuerInformationRef = createRef<HTMLButtonElement>()
  const orderbookChartRef = createRef<HTMLHeadingElement>()
  const orderbookSelectorRef = createRef<HTMLDivElement>()

  const settling = derivedAuctionInfo?.auctionState === AuctionState.NEEDS_SETTLED

  const placeAndCancel =
    forceDevData ||
    [AuctionState.ORDER_PLACING, AuctionState.ORDER_PLACING_AND_CANCELING].includes(
      derivedAuctionInfo?.auctionState,
    )

  useEffect(() => {
    if (window.innerWidth <= 800 && window.innerHeight <= 800) {
      setIsMobile(true)
    }
  }, [])

  return (
    <>
      <TwoGridPage
        leftChildren={
          <>
            <AuctionDetails
              auctionIdentifier={auctionIdentifier}
              auctionInformationRef={auctionInformationRef}
              derivedAuctionInfo={derivedAuctionInfo}
              issuerInformationRef={issuerInformationRef}
            />

            {graphInfo && <BondCard bondTitleRef={bondTitleRef} graphInfo={graphInfo} />}

            <OrderBookContainer
              auctionIdentifier={auctionIdentifier}
              auctionState={derivedAuctionInfo?.auctionState}
              derivedAuctionInfo={derivedAuctionInfo}
              orderbookChartRef={orderbookChartRef}
              orderbookSelectorRef={orderbookSelectorRef}
            />
          </>
        }
        rightChildren={
          <>
            <div className={isMobile ? 'hidden' : ''}>
              <AuctionTour
                auctionInformationRef={auctionInformationRef}
                bondTitleRef={bondTitleRef}
                issuerInformationRef={issuerInformationRef}
                orderbookChartRef={orderbookChartRef}
                orderbookSelectorRef={orderbookSelectorRef}
              />
            </div>
            {settling && <AuctionSettle />}
            {placeAndCancel && (
              <>
                <OrderPlacement
                  auctionIdentifier={auctionIdentifier}
                  derivedAuctionInfo={derivedAuctionInfo}
                />
                <WarningCard />
              </>
            )}
            {derivedAuctionInfo?.auctionState === AuctionState.CLAIMING && (
              <Claimer
                auctionIdentifier={auctionIdentifier}
                derivedAuctionInfo={derivedAuctionInfo}
              />
            )}
          </>
        }
      />
    </>
  )
}

export default AuctionBody
