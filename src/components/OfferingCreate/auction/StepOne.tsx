import React from 'react'

import { useFormContext } from 'react-hook-form'

import { BondSelector } from '../../ProductCreate/selectors/CollateralTokenSelector'
import {
  FieldRowLabelStyledText,
  FieldRowWrapper,
  calculateInterestRate,
} from '../../form/InterestRateInputPanel'

import TooltipElement from '@/components/common/Tooltip'
import { currentTimeInUTC } from '@/utils/tools'

export const StepOne = () => {
  const { register, watch } = useFormContext()

  const [auctionedSellAmount, minimumBiddingAmountPerOrder, bondToAuction] = watch([
    'auctionedSellAmount',
    'minimumBiddingAmountPerOrder',
    'bondToAuction',
  ])
  let minBuyAmount = '-'
  if (auctionedSellAmount && minimumBiddingAmountPerOrder) {
    // Might need to replace this with BigNumbers
    minBuyAmount = (auctionedSellAmount * minimumBiddingAmountPerOrder).toLocaleString()
  }
  let amountOwed = '-'
  if (auctionedSellAmount) {
    amountOwed = auctionedSellAmount.toLocaleString()
  }
  let maximumInterestOwed = '-'
  if (auctionedSellAmount && minimumBiddingAmountPerOrder) {
    maximumInterestOwed = (
      auctionedSellAmount -
      auctionedSellAmount * minimumBiddingAmountPerOrder
    ).toLocaleString()
  }
  let maximumYTM = '-'
  if (auctionedSellAmount && bondToAuction && minimumBiddingAmountPerOrder) {
    maximumYTM = calculateInterestRate({
      price: minimumBiddingAmountPerOrder,
      maturityDate: bondToAuction?.maturityDate,
      startDate: currentTimeInUTC() / 1000,
    }).toLocaleString()
  }
  return (
    <>
      <div className="w-full form-control">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Bond to auction</span>}
            tip="Bond you will be selling"
          />
        </label>

        <BondSelector />
      </div>

      <div className="w-full form-control">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Number of bonds to auction</span>}
            tip="Number of bonds you will be selling"
          />
        </label>
        <input
          className="w-full input input-bordered"
          min={1}
          placeholder="0"
          type="number"
          {...register('auctionedSellAmount', {
            required: true,
            valueAsNumber: true,
            validate: {
              greaterThanZero: (auctionedSellAmount) => auctionedSellAmount > 0,
            },
          })}
        />
      </div>

      <div className="w-full form-control">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Minimum sale price</span>}
            tip="Minimum price you are willing to accept per bond"
          />
        </label>
        <input
          className="w-full input input-bordered"
          min="0"
          placeholder="0"
          step="0.001"
          type="number"
          {...register('minimumBiddingAmountPerOrder', {
            required: true,
            valueAsNumber: true,
            validate: {
              greaterThanZero: (minimumBiddingAmountPerOrder) => minimumBiddingAmountPerOrder > 0,
            },
          })}
        />
      </div>

      <FieldRowWrapper className="py-1 my-4 space-y-3">
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">
            <p>{!minBuyAmount ? '-' : minBuyAmount.toLocaleString()}</p>
          </div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Minimum funds raised</FieldRowLabelStyledText>}
            tip="Minimum amount of funds you will raise assuming all bonds are sold. The funds raised will be higher if the final sale price is higher than the minimum price set"
          />
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">
            <p>{amountOwed}</p>
          </div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Amounted owed at maturity</FieldRowLabelStyledText>}
            tip="Amount you will owe at maturity assuming all bonds are sold."
          />
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">
            <p>{maximumInterestOwed}</p>
          </div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Maximum interest owed</FieldRowLabelStyledText>}
            tip="Maximum interest owed assuming all bonds are sold. The interest owed will be lower if the final sale price is higher than the minimum price set."
          />
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">
            <p>{maximumYTM}</p>
          </div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Maximum YTM</FieldRowLabelStyledText>}
            tip="Maximum YTM you will be required to pay. The settlement YTM might be lower than your maximum set."
          />
        </div>
      </FieldRowWrapper>
    </>
  )
}
