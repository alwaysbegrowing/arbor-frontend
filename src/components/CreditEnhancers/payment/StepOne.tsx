import React from 'react'

import { useFormContext } from 'react-hook-form'

import { BondSelector } from '../../ProductCreate/selectors/CollateralTokenSelector'

import { TokenItem } from '@/components/auction/Claimer'
import { TokenPill } from '@/components/bond/BondAction'
import TooltipElement from '@/components/common/Tooltip'

export const StepOne = () => {
  const { watch } = useFormContext()

  const [bondToAuction] = watch(['bondToAuction'])
  const maxSupply = parseInt(bondToAuction?.maxSupply || 0)
  console.log(bondToAuction)
  return (
    <>
      <div className="form-control w-full">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Issued Bond</span>}
            tip="Bond you will be promising to pay"
          />
        </label>

        <BondSelector />
      </div>
      {bondToAuction && (
        <>
          <div className="form-control w-full">
            <label className="label">
              <TooltipElement
                left={<span className="label-text">Number of Bonds</span>}
                tip="Number of bonds you will be paying"
              />
            </label>

            <TokenItem>
              <div>{maxSupply.toLocaleString()}</div>

              <TokenPill token={bondToAuction} />
            </TokenItem>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <TooltipElement
                left={<span className="label-text">Total Payment Amount</span>}
                tip="The total amount to be paid denominated in the payment token"
              />
            </label>

            <TokenItem>
              <div>{maxSupply.toLocaleString()}</div>

              <TokenPill token={bondToAuction.paymentToken} />
            </TokenItem>
          </div>
        </>
      )}
    </>
  )
}
