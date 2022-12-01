import React from 'react'

import { FormSteps } from '../../ProductCreate/FormSteps'
import { ActionSteps } from './ActionSteps'
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

const PaymentPromise = () => {
  const midComponents = [<StepOne key={0} />]
  const steps = ['Payment promise']

  return (
    <FormSteps
      ActionSteps={ActionSteps}
      Summary={Summary}
      midComponents={midComponents}
      steps={steps}
      title="Payment promise"
    />
  )
}

export default PaymentPromise
