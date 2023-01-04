import React, { RefObject, useState } from 'react'

import { Tour, TourStepProps } from 'antd'
import type { TourProps } from 'antd'

import { TooltipIcon } from '../../icons/TooltipIcon'
import { ActionButton } from '../Claimer'

interface Props {
  auctionInformationRef: RefObject<HTMLHeadingElement>
  bondTitleRef: RefObject<HTMLDivElement>
  issuerInformationRef: RefObject<HTMLButtonElement>
  orderbookChartRef: RefObject<HTMLHeadingElement>
  orderbookSelectorRef: RefObject<HTMLDivElement>
}

const AuctionTour = (props: Props) => {
  const {
    auctionInformationRef,
    bondTitleRef,
    issuerInformationRef,
    orderbookChartRef,
    orderbookSelectorRef,
  } = props

  const [open, setOpen] = useState<boolean>(false)

  const steps: TourProps['steps'] = []

  const overviewStep: TourStepProps = {
    title: 'Welcome to our Auction',
    description: (
      <>
        <p className="py-4">
          <span>
            We will walk you through the important parts of the auction. If a video is more your
            speed, watch the{' '}
            <a
              className="text-[#6CADFB]"
              href="https://www.youtube.com/watch?v=dlOd0nAUmVM"
              referrerPolicy="no-referrer"
              rel="noreferrer"
              target={'_blank'}
            >
              full walkthrough
            </a>
            , or a{' '}
            <a
              className="text-[#6CADFB]"
              href="https://www.youtube.com/watch?v=59UauMKpZMY"
              referrerPolicy="no-referrer"
              rel="noreferrer"
              target={'_blank'}
            >
              condensed version
            </a>
            .
          </span>
        </p>
        <p className="pb-4">
          <span>
            As always, we have documentation on our{' '}
            <a
              className="text-[#6CADFB]"
              href="https://docs.arbor.finance/protocol/offerings/auctions"
              referrerPolicy="no-referrer"
              rel="noreferrer"
              target={'_blank'}
            >
              🌳 Arbor docs
            </a>
            , with a walkthrough of the auction process.
          </span>
        </p>
        <p className="pb-8">
          You can also join our{' '}
          <a
            className="text-[#6CADFB]"
            href="https://discord.arbor.finance"
            referrerPolicy="no-referrer"
            rel="noreferrer"
            target={'_blank'}
          >
            discord
          </a>{' '}
          with questions.
        </p>
      </>
    ),
    target: null,
  }
  const auctionInformationStep: TourStepProps = {
    title: 'Information About the Ongoing Auction',
    placement: 'bottom',
    description: (
      <div>
        <span>
          This panel shows the auction configuration and current closing price. Hover over the
        </span>
        <TooltipIcon className="m-2 inline" />
        <span>to learn what each metric means.</span>
      </div>
    ),
    target: () => auctionInformationRef.current,
  }
  const issuerInformationStep: TourStepProps = {
    title: 'To Get More Information about the Issuer',
    placement: 'bottom',
    description: 'Click here to learn more about who is auctioning this bond.',
    target: () => issuerInformationRef.current,
  }
  const bondInformationStep: TourStepProps = {
    title: 'Auctioning Bond Information',
    placement: 'bottom',
    description:
      'This is the bond being auctioned. There is additional information about the bond itself below.',
    target: () => bondTitleRef.current,
  }
  const orderbookTableStep: TourStepProps = {
    title: 'Orderbook Information',
    placement: 'bottom',
    description: 'This panel shows the current orders for the auction.',
    target: () => orderbookChartRef.current,
  }
  const orderbookSelectorStep: TourStepProps = {
    title: 'Orderbook Selector',
    placement: 'bottom',
    description: 'Click this to show either the chart or table of bids.',
    target: () => orderbookSelectorRef.current,
  }
  const conclusionStep: TourStepProps = {
    title: 'That is All for Now',
    description: (
      <>
        <p className="pb-8">
          <span>
            As always, we have documentation on our{' '}
            <a
              className="text-[#6CADFB]"
              href="https://docs.arbor.finance/protocol/offerings/auctions"
              referrerPolicy="no-referrer"
              rel="noreferrer"
              target={'_blank'}
            >
              🌳 Arbor docs
            </a>
            , with a walkthrough of the auction process.
          </span>
        </p>
      </>
    ),
    target: null,
  }

  steps.push(...[overviewStep, auctionInformationStep])
  if (issuerInformationRef.current) {
    steps.push(issuerInformationStep)
  }
  steps.push(...[bondInformationStep, orderbookTableStep, orderbookSelectorStep, conclusionStep])
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          <span>Need Help?</span>
        </h2>
        <>
          <ActionButton onClick={() => setOpen(true)} type="primary">
            Yes, Start the Walkthrough!
          </ActionButton>
          <Tour mask={true} onClose={() => setOpen(false)} open={open} steps={steps} />
        </>
      </div>
    </div>
  )
}

export default AuctionTour
