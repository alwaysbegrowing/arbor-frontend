import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { parseUnits } from '@ethersproject/units'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { useFormContext } from 'react-hook-form'
import TooltipElement from 'src/components/common/Tooltip'
import { requiredChain } from 'src/connectors'
import BOND_ABI from 'src/constants/abis/bond.json'
import { V1_BOND_FACTORY_ADDRESS } from 'src/constants/v1'
import { useActiveWeb3React } from 'src/hooks'
import { useContract, useContractRead, useToken } from 'wagmi'

import { ActionButton } from '../auction/Claimer'
import WarningModal from '../modals/WarningModal'
import { MintAction } from './MintAction'

export const BondActionSteps = ({ convertible = true, disabled }) => {
  const { account, signer } = useActiveWeb3React()
  const { getValues } = useFormContext()
  const navigate = useNavigate()
  const [transactionError, setTransactionError] = useState('')

  const [collateralToken, amountOfcollateral] = getValues(['collateralToken', 'amountOfCollateral'])
  const { data: collateralTokenData } = useToken({
    address: collateralToken?.address,
  })

  const { data: bondAllowance } = useContractRead({
    addressOrName: collateralTokenData?.address,
    contractInterface: BOND_ABI,
    functionName: 'allowance',
    args: [account, V1_BOND_FACTORY_ADDRESS[requiredChain.id]],
  })

  // state 0 for none, 1 for metamask confirmation, 2 for block confirmation
  const [waitingWalletApprove, setWaitingWalletApprove] = useState(0)
  const [currentApproveStep, setCurrentApproveStep] = useState(0)
  const addRecentTransaction = useAddRecentTransaction()
  const contract = useContract({
    addressOrName: collateralTokenData?.address,
    contractInterface: BOND_ABI,
    signerOrProvider: signer,
  })

  useEffect(() => {
    // Already approved the token
    if (
      bondAllowance &&
      collateralTokenData?.decimals &&
      bondAllowance.gte(parseUnits(`${amountOfcollateral || 0}`, collateralTokenData?.decimals))
    ) {
      setCurrentApproveStep(1)
    }
  }, [bondAllowance, amountOfcollateral, collateralTokenData])

  const confirmSteps = [
    {
      text: `Approve ${collateralTokenData.symbol || collateralToken?.name} as collateral`,
      tip: 'The collateral token needs to be approved so it can be transferred into the bond contract and used as collateral.',
    },
    {
      text: `Mint ${collateralTokenData.symbol || collateralToken?.name} Convertible Bonds`,
      tip: 'Mint the bonds to the connected wallet.',
    },
  ]

  return (
    <>
      <ul className="steps steps-vertical">
        {confirmSteps.map((step, i) => (
          <li className={`step ${i < currentApproveStep ? 'checked step-primary' : ''}`} key={i}>
            <TooltipElement left={step.text} tip={step.tip} />
          </li>
        ))}
      </ul>
      {!currentApproveStep && (
        <ActionButton
          className={waitingWalletApprove ? 'loading' : ''}
          color="blue"
          disabled={disabled}
          onClick={() => {
            setWaitingWalletApprove(1)
            contract
              .approve(
                V1_BOND_FACTORY_ADDRESS[requiredChain.id],
                parseUnits(`${amountOfcollateral || 0}`, collateralToken?.decimals),
              )
              .then((result) => {
                setWaitingWalletApprove(2)
                addRecentTransaction({
                  hash: result?.hash,
                  description: `Approve ${
                    collateralToken?.symbol || collateralToken?.name
                  } for ${amountOfcollateral}`,
                })
                return result.wait()
              })
              .then(() => {
                setCurrentApproveStep(1)
              })
              .catch((e) => {
                setWaitingWalletApprove(0)
                setTransactionError(e?.message || e)
              })
          }}
        >
          {!waitingWalletApprove &&
            `Approve ${collateralToken?.symbol || collateralToken?.name} for sale`}
          {waitingWalletApprove === 1 && 'Confirm approval in wallet'}
          {waitingWalletApprove === 2 &&
            `Approving ${collateralToken?.symbol || collateralToken?.name}...`}
        </ActionButton>
      )}
      {currentApproveStep === 1 && (
        <MintAction
          convertible={convertible}
          disabled={disabled}
          setCurrentApproveStep={setCurrentApproveStep}
        />
      )}
      {currentApproveStep === 2 && (
        <ActionButton
          onClick={() => {
            navigate('/offerings/create')
          }}
        >
          Create offering
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
