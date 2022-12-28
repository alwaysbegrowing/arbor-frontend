import React from 'react'

import { useFormContext } from 'react-hook-form'

import { Inputs } from './SetupOrderbook'

import { SummaryItem } from '@/components/ProductCreate/SummaryItem'

export const Summary = (showSell: boolean) => {
  const { getValues } = useFormContext()
  const formValues = getValues() as Inputs
  if (showSell) {
    return (
      <div className="card w-[425px] overflow-visible">
        <div className="card-body">
          <h1 className="card-title border-b border-[#2C2C2C] pb-4 !text-xs uppercase">Summary</h1>
          <div className="space-y-4">
            <SummaryItem
              text={formValues?.bondToAuction?.name}
              tip="Bond for sale"
              title="Bond for sale"
            />
            <SummaryItem
              text={formValues?.makerAmount?.toString()}
              tip="Amount of Bonds"
              title="Bond Amount"
            />
            <SummaryItem text={formValues.borrowToken?.name} tip="Purchasing Token" title="Token" />
            <SummaryItem
              text={formValues?.takerAmount?.toString()}
              tip="Amount of Tokens"
              title="Token Amount"
            />
            <SummaryItem
              text={`This order will sell ${formValues?.makerAmount?.toString()} of ${
                formValues?.bondToAuction?.name
              } in exchange for ${formValues?.takerAmount?.toString()} of ${
                formValues?.borrowToken?.name
              }.`}
              tip="Amount of Bonds"
              title="Bond Amount"
            />
          </div>
        </div>
      </div>
    )
  } else if (!showSell) {
    return (
      <div className="card w-[425px] overflow-visible">
        <div className="card-body">
          <h1 className="card-title border-b border-[#2C2C2C] pb-4 !text-xs uppercase">Summary</h1>
          <div className="space-y-4">
            <SummaryItem
              text={formValues?.bondToAuction?.name}
              tip="Bond for sale"
              title="Bond for sale"
            />
            <SummaryItem
              text={formValues?.makerAmount?.toString()}
              tip="Amount of Bonds"
              title="Bond Amount"
            />
            <SummaryItem
              text={formValues?.borrowToken?.name}
              tip="Purchasing Token"
              title="Token"
            />
            <SummaryItem
              text={formValues?.takerAmount?.toString()}
              tip="Amount of Tokens"
              title="Token Amount"
            />
            <SummaryItem
              text={`This order will sell ${formValues?.takerAmount?.toString()} of ${
                formValues?.borrowToken?.name
              } in exchange for ${formValues?.makerAmount?.toString()} of ${
                formValues?.bondToAuction?.name
              }.`}
              tip="Amount of Bonds"
              title="Bond Amount"
            />
          </div>
        </div>
      </div>
    )
  }
}
