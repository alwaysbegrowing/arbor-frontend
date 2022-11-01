import React from 'react'

import { formatUnits, parseUnits } from '@ethersproject/units'
import { SummaryItem } from 'src/components/ProductCreate/SummaryItem'
import { ActionButton } from 'src/components/auction/Claimer'
import WarningModal from 'src/components/modals/WarningModal'
import BOND_ABI from 'src/constants/abis/bond.json'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

export const WithdrawPayment = ({ bond }) => {
  const addTransaction = useTransactionAdder()

  const { config } = usePrepareContractWrite({
    addressOrName: bond?.id,
    contractInterface: BOND_ABI,
    functionName: 'withdrawExcessPayment',
    args: [bond?.owner],
  })
  const {
    data: dataPayment,
    error: errorPayment,
    isError: isErrorPayment,
    isLoading: isLoadingPayment,
    reset: resetPayment,
    write: writePayment,
  } = useContractWrite({
    ...config,
    onSuccess(data, error) {
      addTransaction(data?.hash, {
        summary: `Withdraw ${parseUnits(
          previewWithdrawExcessPayment?.toString(),
          bond?.paymentToken.decimals,
        )} ${bond?.paymentToken?.symbol} from ${bond?.symbol}`,
      })
    },
  })

  const { isLoading: isConfirmLoadingPayment } = useWaitForTransaction({
    hash: dataPayment?.hash,
  })

  const { data: paymentBalance } = useContractRead({
    functionName: 'paymentBalance',
    addressOrName: bond?.id,
    contractInterface: BOND_ABI,
  })

  const { data: previewWithdrawExcessPayment } = useContractRead({
    functionName: 'previewWithdrawExcessPayment',
    addressOrName: bond?.id,
    contractInterface: BOND_ABI,
  })
  const excessPaymentDisplay = Number(
    formatUnits((previewWithdrawExcessPayment || '0').toString(), bond?.paymentToken?.decimals),
  ).toLocaleString()

  return (
    <div className="space-y-2">
      <h2 className="card-title !text-[#696969]">Excess payment</h2>

      <SummaryItem
        border={false}
        text={`${
          Number(
            formatUnits((paymentBalance || '0').toString(), bond?.paymentToken.decimals),
          ).toLocaleString() || '-'
        } ${bond?.paymentToken?.symbol}`}
        tip="The amount of total payment in the Bond contract."
        title="Payment locked"
      />
      <SummaryItem
        border={false}
        text={`${excessPaymentDisplay} ${bond?.paymentToken?.symbol}`}
        tip="The excess amount of collateral will be withdrawn to the current account."
        title="Payment to withdraw"
      />
      <ActionButton
        className={`${isLoadingPayment || isConfirmLoadingPayment ? 'loading' : ''}`}
        disabled={!Number(previewWithdrawExcessPayment)}
        onClick={writePayment}
      >
        Withdraw Payment
      </ActionButton>
      <WarningModal
        content={errorPayment?.message}
        isOpen={isErrorPayment}
        onDismiss={() => {
          resetPayment()
        }}
      />
    </div>
  )
}
