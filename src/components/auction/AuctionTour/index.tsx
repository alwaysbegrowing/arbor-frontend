import React, { RefObject, useState } from 'react'

import { Button, Tour, TourStepProps } from 'antd'
import type { TourProps } from 'antd'

interface Props {
  auctionInformationRef: RefObject<HTMLDivElement>
  bondTitleRef: RefObject<HTMLDivElement>
  issuerInformationRef: RefObject<HTMLButtonElement>
}

const AuctionTour = (props: Props) => {
  const { auctionInformationRef } = props

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
          with questions
        </p>
      </>
    ),
    target: null,
  }
  const auctionInformationStep: TourStepProps = {
    title: 'Information About the Ongoing Auction',
    placement: 'top',
    description: 'This panel shows the auction configuration and current closing price.',
    target: () => auctionInformationRef.current,
  }
  const issuerInformationStep: TourStepProps = {
    title: 'To Get More Information about the Issuer',
    placement: 'bottom',
    description: 'Click here to see who is auctioning their tokens.',
    target: () => props.issuerInformationRef.current,
  }
  const bondInformationStep: TourStepProps = {
    title: 'Auctioning Token Information',
    placement: 'bottom',
    description:
      'This is the token being auctioned. There is additional information about the token itself.',
    target: () => props.bondTitleRef.current,
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

  steps.push(...[overviewStep])
  if (props.issuerInformationRef.current) {
    steps.push(issuerInformationStep)
  }
  steps.push(...[bondInformationStep, conclusionStep])
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          <span>Need Help?</span>
        </h2>
        <>
          <Button onClick={() => setOpen(true)} type="primary">
            Yes, Start the Walkthrough!
          </Button>
          <Tour mask={true} onClose={() => setOpen(false)} open={open} steps={steps} />
        </>
      </div>
    </div>
  )
}

export default AuctionTour
