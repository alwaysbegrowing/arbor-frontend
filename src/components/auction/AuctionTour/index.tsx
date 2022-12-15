import React, { RefObject, useState } from 'react'

import { Button, Tour } from 'antd'
import type { TourProps } from 'antd'

interface Props {
  auctionInformationRef: RefObject<HTMLDivElement>
  bondInformationRef: RefObject<HTMLDivElement>
  issuerInformationRef: RefObject<HTMLButtonElement>
}

const AuctionTour = (props: Props) => {
  const { auctionInformationRef } = props

  const [open, setOpen] = useState<boolean>(false)

  const steps: TourProps['steps'] = [
    {
      title: 'Welcome to our Auction',
      description: (
        <>
          <p className="py-4">
            <span>
              We will walk you through the big and little parts of this thing. If a video is more
              your speed, watch the{' '}
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
          <p className="pb-8">
            <span>
              As always, we have documentation on our{' '}
              <a
                className="text-[#6CADFB]"
                href="https://docs.arbor.finance"
                referrerPolicy="no-referrer"
                rel="noreferrer"
                target={'_blank'}
              >
                🌳 Arbor docs
              </a>
              , with a{' '}
              <a
                className="text-[#6CADFB]"
                href="https://docs.arbor.finance/protocol/offerings/auctions"
                referrerPolicy="no-referrer"
                rel="noreferrer"
                target={'_blank'}
              >
                walkthrough
              </a>{' '}
              of the auction process.
            </span>
          </p>
        </>
      ),
      target: null,
    },
    {
      title: 'Information About the Ongoing Auction',
      description: 'This panel shows the auction configuration and current closing price.',
      target: () => auctionInformationRef.current,
    },
    {
      title: 'To Get More Information about the Issuer',
      description: 'Click here to see who is auctioning their tokens.',
      target: () => props.issuerInformationRef.current,
    },
    {
      title: 'Auctioning Token Information',
      description: 'Here you can see more information about the token that is being auctioned .',
      target: () => props.bondInformationRef.current,
    },
    {
      title: 'That is All for Now',
      description: (
        <>
          <p className="pb-8">
            <span>
              As always, we have documentation on our{' '}
              <a
                className="text-[#6CADFB]"
                href="https://docs.arbor.finance"
                referrerPolicy="no-referrer"
                rel="noreferrer"
                target={'_blank'}
              >
                🌳 Arbor docs
              </a>
              , with a{' '}
              <a
                className="text-[#6CADFB]"
                href="https://docs.arbor.finance/protocol/offerings/auctions"
                referrerPolicy="no-referrer"
                rel="noreferrer"
                target={'_blank'}
              >
                walkthrough
              </a>{' '}
              of the auction process.
            </span>
          </p>
        </>
      ),
      target: null,
    },
  ]

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
          <Tour onClose={() => setOpen(false)} open={open} steps={steps} />
        </>
      </div>
    </div>
  )
}

export default AuctionTour
