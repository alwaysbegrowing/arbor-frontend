import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { useFormContext } from 'react-hook-form'

import { ActionButton } from '../../auction/Claimer'
import WarningModal from '../../modals/WarningModal'
import { signPromissoryNote } from './SignatureRequest'

import { useActiveWeb3React } from '@/hooks'

export const ActionSteps = ({ disabled }) => {
  const { account, chainId, signer } = useActiveWeb3React()
  const { getValues } = useFormContext()
  const [transactionError, setTransactionError] = useState('')
  const navigate = useNavigate()

  const [bondToSign] = getValues(['bondToAuction'])

  // state 0 for none, 1 for metamask confirmation, 2 for block confirmation
  const [waitingWalletApprove, setWaitingWalletApprove] = useState(0)
  const [currentApproveStep, setCurrentApproveStep] = useState(0)
  const addRecentTransaction = useAddRecentTransaction()

  return (
    <>
      {bondToSign && (
        <ActionButton
          className={waitingWalletApprove ? 'loading' : ''}
          color="blue"
          disabled={disabled}
          onClick={() => {
            signPromissoryNote({ signer, bondToSign, chainId })
          }}
        >
          Sign Promise
        </ActionButton>
      )}
      <WarningModal
        content={transactionError}
        isOpen={!!transactionError}
        onDismiss={() => {
          setTransactionError('')
        }}
      />
    </>
  )
}
