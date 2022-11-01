import React from 'react'

import dayjs from 'dayjs'
import { useFormContext } from 'react-hook-form'
import { useCollateralRatio } from 'src/hooks/useCollateralRatio'
import { useStrikePrice } from 'src/hooks/useStrikePrice'
import { useToken } from 'wagmi'

import { useBondName } from '../../../hooks/useBondName'
import { SummaryItem } from '../SummaryItem'

export const Summary = ({ currentStep }) => {
  const { watch } = useFormContext()
  const [
    borrowToken,
    collateralToken,
    amountOfBonds,
    maturityDate,
    amountOfCollateral,
    amountOfConvertible,
  ] = watch([
    'borrowToken',
    'collateralToken',
    'amountOfBonds',
    'maturityDate',
    'amountOfCollateral',
    'amountOfConvertible',
  ])
  const { data: bondData } = useBondName(true, maturityDate)
  const { data: borrowTokenData } = useToken({ address: borrowToken?.address })
  const { data: collateralTokenData } = useToken({ address: collateralToken?.address })
  const borrowTokenSymbol = borrowTokenData?.symbol || '-'
  const collateralTokenSymbol = collateralTokenData?.symbol || '-'

  const collateralizationRatio = useCollateralRatio({
    collateralToken,
    amountOfBonds,
    amountOfCollateral,
  })

  const { data: strikePrice } = useStrikePrice()
  return (
    <div className="overflow-visible w-[425px] card">
      <div className="card-body">
        <h1 className="pb-4 !text-xs uppercase border-b border-[#2C2C2C] card-title">Summary</h1>
        <div className="space-y-4">
          <SummaryItem text={bondData?.bondName} tip="Name" title="Name" />
          <SummaryItem text={amountOfBonds} tip="Supply" title="Supply" />
          <SummaryItem
            text={`${amountOfBonds?.toLocaleString()} ${borrowTokenSymbol}`}
            tip="Owed at maturity"
            title="Owed at maturity"
          />
          <SummaryItem
            text={`${dayjs(maturityDate).format('LL hh:mm z')}`}
            tip="Maturity date"
            title="Maturity date"
          />

          {currentStep >= 2 && (
            <>
              <SummaryItem
                text={`${amountOfCollateral?.toLocaleString() || '-'} ${
                  collateralTokenSymbol || ''
                }`}
                tip="Collateral tokens"
                title="Collateral tokens"
              />
              <SummaryItem
                text={collateralizationRatio + '%'}
                tip="Collateralization ratio"
                title="Collateralization ratio"
              />
            </>
          )}
          {currentStep >= 3 && (
            <>
              <SummaryItem
                text={`${amountOfConvertible || '-'} ${collateralTokenSymbol || ''}`}
                tip="Convertible tokens"
                title="Convertible tokens"
              />
              <SummaryItem text={strikePrice?.display} tip="Strike price" title="Strike price" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
