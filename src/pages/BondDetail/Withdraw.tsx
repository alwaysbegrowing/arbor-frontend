import { BigNumber } from 'ethers'
import React, { useState } from 'react'

import { formatUnits, parseUnits } from '@ethersproject/units'
import { SummaryItem } from 'src/components/ProductCreate/SummaryItem'
import { ActionButton } from 'src/components/auction/Claimer'
import AmountInputPanel from 'src/components/form/AmountInputPanel'
import WarningModal from 'src/components/modals/WarningModal'
import { InfoType } from 'src/components/pureStyledComponents/FieldRow'
import BOND_ABI from 'src/constants/abis/bond.json'
import { Bond } from 'src/generated/graphql'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import { WithdrawPayment } from './WithdrawPayment'

export const Withdraw = ({
  bond,
}: {
  bond: Pick<
    Bond,
    | 'id'
    | 'symbol'
    | 'owner'
    | 'collateralTokenAmount'
    | 'paymentToken'
    | 'collateralToken'
    | 'convertibleTokenAmount'
    | 'collateralRatio'
    | 'maxSupply'
    | 'amountUnpaid'
  >
}) => {
  const addTransaction = useTransactionAdder()

  const [collateralAmount, setCollateralAmount] = useState('0')

  const { config } = usePrepareContractWrite({
    addressOrName: bond?.id,
    contractInterface: BOND_ABI,
    functionName: 'withdrawExcessCollateral',
    args: [parseUnits(collateralAmount, bond?.collateralToken.decimals), bond?.owner],
  })
  const { data, error, isError, isLoading, reset, write } = useContractWrite({
    ...config,
    onSuccess(data, error) {
      addTransaction(data?.hash, {
        summary: `Withdraw ${collateralAmount} ${bond?.collateralToken?.symbol} from ${bond?.symbol}`,
      })
    },
  })

  const { data: previewWithdrawExcessCollateral } = useContractRead({
    functionName: 'previewWithdrawExcessCollateral',
    addressOrName: bond?.id,
    contractInterface: BOND_ABI,
  })
  const { data: collateralBalance } = useContractRead({
    functionName: 'collateralBalance',
    addressOrName: bond?.id,
    contractInterface: BOND_ABI,
  })

  const excessCollateralDisplay = Number(
    formatUnits(
      (previewWithdrawExcessCollateral || '0').toString(),
      bond?.collateralToken?.decimals,
    ),
  ).toLocaleString()

  const hasErrorCollateral =
    Number(collateralAmount || '0') &&
    parseUnits(collateralAmount || '0', bond?.collateralToken?.decimals).gt(
      BigNumber.from(previewWithdrawExcessCollateral),
    )

  const onMaxCollateral = () => {
    setCollateralAmount(
      formatUnits(previewWithdrawExcessCollateral.toString(), bond?.collateralToken?.decimals),
    )
  }

  const { isLoading: isConfirmLoading } = useWaitForTransaction({
    hash: data?.hash,
  })

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h2 className="card-title !text-[#696969]">Excess collateral</h2>

        <SummaryItem
          border={false}
          text={`${Number(
            formatUnits((collateralBalance || '0').toString(), bond?.collateralToken?.decimals),
          ).toLocaleString()} ${bond?.collateralToken?.symbol}`}
          tip="The amount of total collateral in the Bond contract."
          title="Collateral locked"
        />
        <SummaryItem
          border={false}
          text={`${excessCollateralDisplay} ${bond?.collateralToken?.symbol}`}
          tip="At the moment, the amount of collateral available to withdraw from the contract."
          title="Collateral available to withdraw"
        />
        <AmountInputPanel
          amountText="Amount of collateral to withdraw"
          amountTooltip="This is your withdraw amount"
          info={
            hasErrorCollateral && {
              text: `You cannot exceed the available collateral to withdraw.`,
              type: InfoType.error,
            }
          }
          maxTitle="Withdraw all"
          onMax={onMaxCollateral}
          onUserSellAmountInput={setCollateralAmount}
          token={bond?.collateralToken}
          value={collateralAmount || ''}
        />

        <ActionButton
          className={`${isLoading || isConfirmLoading ? 'loading' : ''}`}
          disabled={!Number(collateralAmount) || hasErrorCollateral}
          onClick={write}
        >
          Withdraw Collateral
        </ActionButton>
      </div>
      <WithdrawPayment bond={bond} />
      <WarningModal
        content={error?.message}
        isOpen={isError}
        onDismiss={() => {
          reset()
        }}
      />
    </div>
  )
}
