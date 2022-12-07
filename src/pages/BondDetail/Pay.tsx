import React, { useState } from 'react'

import { parseFixed } from '@ethersproject/bignumber'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { Token, TokenAmount } from '@josojo/honeyswap-sdk'
import dayjs from 'dayjs'
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import { SummaryItem } from '@/components/ProductCreate/SummaryItem'
import { ActionButton } from '@/components/auction/Claimer'
import AmountInputPanel from '@/components/form/AmountInputPanel'
import WarningModal from '@/components/modals/WarningModal'
import { InfoType } from '@/components/pureStyledComponents/FieldRow'
import { requiredChain } from '@/connectors'
import BOND_ABI from '@/constants/abis/bond.json'
import { Bond } from '@/generated/graphql'
import { ApprovalState, useApproveCallback } from '@/hooks/useApproveCallback'
import { useTransactionAdder } from '@/state/transactions/hooks'

export const Pay = ({
  bond,
}: {
  bond: Pick<
    Bond,
    | 'id'
    | 'paymentToken'
    | 'symbol'
    | 'state'
    | 'maturityDate'
    | 'maxSupply'
    | 'amountUnpaid'
    | 'collateralToken'
    | 'collateralRatio'
    | 'collateralTokenAmount'
    | 'convertibleTokenAmount'
  >
}) => {
  const [bondAmount, setBondAmount] = useState('0')
  const addTransaction = useTransactionAdder()

  const { config } = usePrepareContractWrite({
    addressOrName: bond?.id,
    contractInterface: BOND_ABI,
    functionName: 'pay',
    args: [parseUnits(bondAmount || '0', bond?.paymentToken.decimals)],
  })
  const { data, error, isError, isLoading, reset, write } = useContractWrite({
    ...config,
    onSuccess(data, error) {
      addTransaction(data?.hash, {
        summary: `Pay ${bondAmount} ${bond?.paymentToken?.symbol} to ${bond?.symbol}`,
      })
    },
  })
  const { data: amountUnpaid } = useContractRead({
    addressOrName: bond?.id,
    contractInterface: BOND_ABI,
    functionName: 'amountUnpaid',
  })

  const amountOwed = formatUnits(amountUnpaid || '0', bond?.paymentToken?.decimals)
  const { isLoading: isConfirmLoading } = useWaitForTransaction({
    hash: data?.hash,
  })

  const onMax = () => {
    setBondAmount(amountOwed)
  }

  const { data: previewWithdrawExcessCollateral } = useContractRead({
    functionName: 'previewWithdrawExcessCollateral',
    addressOrName: bond?.id,
    contractInterface: BOND_ABI,
  })

  const { data: previewWithdrawExcessCollateralAfterPayment } = useContractRead({
    functionName: 'previewWithdrawExcessCollateralAfterPayment',
    addressOrName: bond?.id,
    contractInterface: BOND_ABI,
    args: parseUnits(bondAmount || '0', bond?.paymentToken?.decimals),
  })
  let result = '0'
  if (previewWithdrawExcessCollateralAfterPayment && previewWithdrawExcessCollateral) {
    result = previewWithdrawExcessCollateralAfterPayment
      .sub(previewWithdrawExcessCollateral)
      .toString()
  }
  const excessCollateralDisplay = Number(
    formatUnits(result, bond?.collateralToken?.decimals),
  ).toLocaleString()

  const hasError = parseUnits(bondAmount || '0', bond?.paymentToken?.decimals).gt(
    bond?.amountUnpaid,
  )

  const approvalTokenAmount = new TokenAmount(
    new Token(
      requiredChain.id,
      bond?.paymentToken?.id,
      bond?.paymentToken?.decimals,
      bond?.paymentToken?.symbol,
      bond?.paymentToken?.name,
    ),
    parseFixed(bondAmount || '0', bond?.paymentToken?.decimals).toString(),
  )
  const [approval, approveCallback] = useApproveCallback(
    approvalTokenAmount,
    bond?.id,
    requiredChain.id,
  )
  const notApproved = approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING
  console.log({ approval, approveCallback, bond, requiredChain, approvalTokenAmount })
  return (
    <div className="space-y-2">
      <SummaryItem
        border={false}
        text={`${Number(amountOwed).toLocaleString()} USDC`}
        tip="Outstanding number of payment tokens required to fully repay the Bond."
        title="Amount owed"
      />
      <SummaryItem
        border={false}
        text={dayjs(bond?.maturityDate * 1000)
          .utc()
          .tz()
          .format('LL HH:mm z')}
        tip="Maturity date"
        title="Maturity date"
      />
      <AmountInputPanel
        amountText="Amount of debt to pay"
        amountTooltip="The number of payment tokens to pay into the Bond."
        info={
          hasError && {
            text: `You cannot exceed the amount owed.`,
            type: InfoType.error,
          }
        }
        maxTitle="Pay all"
        onMax={onMax}
        onUserSellAmountInput={setBondAmount}
        token={bond?.paymentToken}
        unlock={{
          isLocked: notApproved,
          onUnlock: approveCallback,
          unlockState: approval,
          token: bond?.paymentToken.id,
        }}
        value={bondAmount || ''}
      />
      <SummaryItem
        border={false}
        text={`${excessCollateralDisplay} ${bond.collateralToken.symbol}`}
        tip="After burning a bond share, the collateral backing that share can be retrieved as it is no longer needed by the contract."
        title="Amount of collateral unlocked"
      />

      <ActionButton
        className={`${isLoading || isConfirmLoading ? 'loading' : ''}`}
        disabled={!Number(bondAmount || '0') || hasError || notApproved}
        onClick={write}
      >
        Pay
      </ActionButton>
      <WarningModal content={error?.message} isOpen={isError} onDismiss={reset} />
    </div>
  )
}
