import React from 'react'

import { useFormContext } from 'react-hook-form'
import TooltipElement from 'src/components/common/Tooltip'
import { useActiveWeb3React } from 'src/hooks'
import { useCollateralRatio } from 'src/hooks/useCollateralRatio'
import { useTokenPrice } from 'src/hooks/useTokenPrice'
import { useBalance, useToken } from 'wagmi'

import { FieldRowLabelStyledText, FieldRowWrapper } from '../../form/InterestRateInputPanel'
import CollateralTokenSelector from '../selectors/CollateralTokenSelector'

export const StepTwo = () => {
  const { register, watch } = useFormContext()
  const { account } = useActiveWeb3React()
  const [amountOfCollateral, collateralToken, amountOfBonds] = watch([
    'amountOfCollateral',
    'collateralToken',
    'amountOfBonds',
  ])
  const { data: tokenPrice } = useTokenPrice(collateralToken?.address)
  const collateralValue = amountOfCollateral * tokenPrice
  const { data: token } = useToken(collateralToken?.address)
  const { data: tokenBalance } = useBalance({
    addressOrName: account,
    token: collateralToken?.address,
    formatUnits: token?.decimals,
  })

  const collateralizationRatio = useCollateralRatio({
    collateralToken,
    amountOfBonds,
    amountOfCollateral,
  })

  return (
    <>
      <div className="form-control w-full">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Collateral token</span>}
            tip="Collateral token that will be used"
          />
        </label>

        <CollateralTokenSelector />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Amount of collateral tokens</span>}
            tip="Amount of collateral tokens that will be used to secure the whole bond issuance"
          />
        </label>
        <input
          className="input-bordered input w-full"
          inputMode="numeric"
          min={0}
          placeholder="0"
          type="number"
          {...register('amountOfCollateral', {
            required: 'The amount of collateral must be entered',
            valueAsNumber: true,
            validate: {
              overZero: (value) => value > 0 || 'A Bond should have some collateral tokens',
              lessThanBalance: (value) =>
                value <= Number(tokenBalance?.formatted) ||
                "The amount of collateral tokens cannot exceed the current wallet's balance",
            },
          })}
        />
      </div>

      <FieldRowWrapper className="my-4 space-y-3 py-1">
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">
            <p>
              {collateralToken?.address && !isNaN(collateralValue)
                ? collateralValue.toLocaleString()
                : '-'}
            </p>
          </div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Collateral value</FieldRowLabelStyledText>}
            tip="Value of the collateral in the borrow token"
          />
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">
            <p>
              {collateralToken?.address && !isNaN(collateralValue)
                ? collateralizationRatio.toLocaleString() + '%'
                : '-'}
            </p>
          </div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Collateralization ratio</FieldRowLabelStyledText>}
            tip="Value of the collateral backing each bond share"
          />
        </div>
      </FieldRowWrapper>
    </>
  )
}
