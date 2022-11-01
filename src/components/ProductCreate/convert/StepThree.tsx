import React from 'react'

import { useFormContext } from 'react-hook-form'
import TooltipElement from 'src/components/common/Tooltip'
import { useStrikePrice } from 'src/hooks/useStrikePrice'
import { useTokenPrice } from 'src/hooks/useTokenPrice'

import { FieldRowLabelStyledText, FieldRowWrapper } from '../../form/InterestRateInputPanel'
import { TokenDetails } from '../TokenDetails'

export const StepThree = () => {
  const { register, watch } = useFormContext()

  const [amountOfCollateral, collateralToken, amountOfConvertible] = watch([
    'amountOfCollateral',
    'collateralToken',
    'amountOfConvertible',
  ])
  const { data: collateralTokenPrice } = useTokenPrice(collateralToken?.address)
  const convertibleTokenValue = amountOfConvertible * collateralTokenPrice
  const { data: strikePrice } = useStrikePrice()

  return (
    <>
      <div className="form-control w-full">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Convertible token</span>}
            tip="Token that each bond will be convertible into"
          />
        </label>
        <div className="border border-[#2C2C2C]">
          <TokenDetails option={collateralToken} />
        </div>
      </div>
      <div className="form-control w-full">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Amount of convertible tokens</span>}
            tip="Number of tokens the whole bond issuance will be convertible into"
          />
        </label>
        <input
          className="input-bordered input w-full"
          inputMode="numeric"
          min="0"
          placeholder="0"
          type="number"
          {...register('amountOfConvertible', {
            required: 'The amount of convertible tokens must be entered',
            valueAsNumber: true,
            validate: {
              overZero: (value) =>
                value > 0 || 'A convertible bond must have some convertible tokens',
              lessThanCollateral: (value) =>
                value <= amountOfCollateral ||
                'The amount of convertible tokens must be less than the amount of collateral',
            },
          })}
        />
      </div>

      <FieldRowWrapper className="my-4 space-y-3 py-1">
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">
            <p>
              {!isNaN(convertibleTokenValue)
                ? `${convertibleTokenValue.toLocaleString()} USDC`
                : '-'}
            </p>
          </div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Convertible token value</FieldRowLabelStyledText>}
            tip="Current value of all the convertible tokens for the bond issuance"
          />
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">{strikePrice?.display}</div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Strike price</FieldRowLabelStyledText>}
            tip="Price at which the value of the convertible tokens equals the amount owed at maturity"
          />
        </div>
      </FieldRowWrapper>
    </>
  )
}
