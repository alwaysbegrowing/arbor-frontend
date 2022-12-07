import { utils } from 'ethers'
import React from 'react'

import dayjs from 'dayjs'
import { useFormContext } from 'react-hook-form'
import { useAccount } from 'wagmi'

import { BondSelector } from '../../ProductCreate/selectors/CollateralTokenSelector'

import { TokenItem } from '@/components/auction/Claimer'
import { TokenPill } from '@/components/bond/BondAction'
import TooltipElement from '@/components/common/Tooltip'

export const StepOne = () => {
  const { watch } = useFormContext()
  const { address } = useAccount()
  const [bondToAuction] = watch(['bondToAuction'])
  const totalPayment =
    bondToAuction && utils.formatUnits(bondToAuction.maxSupply, bondToAuction.decimals)
  const maturityDate = dayjs(bondToAuction?.maturityDate * 1000)
    .utc()
    .tz()
    .format('LL HH:mm z')
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
                left={<span className="label-text">Signing as</span>}
                tip="Address signing the note"
              />
            </label>
            <div className="w-full text-sm" defaultValue="">
              {address}
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <TooltipElement
                left={<span className="label-text">Total Payment Amount</span>}
                tip="The total amount to be paid denominated in the payment token"
              />
            </label>

            <TokenItem>
              <div>{totalPayment.toLocaleString()}</div>

              <TokenPill token={bondToAuction.paymentToken} />
            </TokenItem>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <TooltipElement
                left={<span className="label-text">Maturity Date</span>}
                tip="Date the bond must be paid"
              />
            </label>

            <TokenItem>
              <div>{maturityDate}</div>
            </TokenItem>
          </div>

          {bondToAuction && (
            <span className="card-title border border-[#333333] p-4 text-[#9F9F9F]">
              {`This signature represents a promise to unconditionally pay the bond by the maturity date.`}
            </span>
          )}
        </>
      )}
    </>
  )
}
