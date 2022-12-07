import React from 'react'

import { ActionSteps } from './ActionSteps'
import { FormSteps } from './FormSteps'
import { StepOne } from './StepOne'
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
  bondToAuction: Token
}

const PromissoryNote = () => {
  const midComponents = [<StepOne key={0} />]
  const steps = ['Signature Request']

  return (
    <FormSteps
      ActionSteps={ActionSteps}
      Summary={Summary}
      midComponents={midComponents}
      steps={steps}
      title="Promissory Note"
    />
  )
}

export default PromissoryNote
