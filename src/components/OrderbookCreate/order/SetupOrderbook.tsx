import React from 'react'

import { FormSteps } from '../../ProductCreate/FormSteps'
import { ActionSteps } from './ActionSteps'
import { StepOne } from './StepOne'
import { StepThree } from './StepThree'
import { StepTwo } from './StepTwo'
import { Summary } from './Summary'

import { Token } from '@/generated/graphql'

export type Inputs = {
  issuerName: string
  auctionedSellAmount: number
  minimumBiddingAmountPerOrder: number
  auctionStartDate: Date
  auctionEndDate: Date
  accessManagerContractData: string
  minBidSize: string
  orderCancellationEndDate: string
  // TODO: its actually type Bond but we only need a few values off there
  bondToAuction: Token
}

const SetupOrderbook = () => {
  const midComponents = [<StepOne key={0} />, <StepTwo key={1} />, <StepThree key={2} />]
  const steps = ['Configure Order', 'Sign Order', 'Blast Off']

  return (
    <FormSteps
      ActionSteps={ActionSteps}
      Summary={Summary}
      midComponents={midComponents}
      steps={steps}
      title="Limit Order Creation"
    />
  )
}

export default SetupOrderbook
