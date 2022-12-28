import { BigNumber } from 'ethers'
import React, { useState } from 'react'

import { AddressZero } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { useFormContext } from 'react-hook-form'
import { useContract, useContractRead, useToken } from 'wagmi'

import { ExchangeProxy } from '@/components/ProductCreate/SelectableTokens'
import { ActionButton } from '@/components/auction/Claimer'
import BOND_ABI from '@/constants/abis/bond.json'
import { useActiveWeb3React } from '@/hooks'

export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const ApproveToken = () => {
  const { watch } = useFormContext()
  const { account, chainId, signer } = useActiveWeb3React()
  const [waitingForApproval, setWaitingForApproval] = useState(false)
  const addRecentTransaction = useAddRecentTransaction()
  const [bondToAuction, borrowToken, makerAmount, isSell] = watch([
    'bondToAuction',
    'borrowToken',
    'makerAmount',
    'isSell',
  ])
  const makerTokenAddress = isSell ? bondToAuction?.id : borrowToken?.address

  const { data: tokenAllowance, isLoading: isAllowanceLoading } = useContractRead({
    addressOrName: makerTokenAddress || AddressZero,
    contractInterface: BOND_ABI, // Allowance comes from the ERC20
    functionName: 'allowance',
    args: [account, ExchangeProxy[chainId]],
  })

  const tokenContract = useContract({
    addressOrName: makerTokenAddress || AddressZero,
    contractInterface: BOND_ABI,
    signerOrProvider: signer,
  })

  const { data: makerTokenData, isLoading: isTokenLoading } = useToken({
    address: makerTokenAddress,
  })

  if (isAllowanceLoading || isTokenLoading || !(tokenAllowance instanceof BigNumber)) {
    return null
  }
  const hasSufficientAllowance = tokenAllowance.gte(makerAmount)

  const approveToken = async () => {
    try {
      setWaitingForApproval(true)
      const approvalTransaction = await tokenContract.approve(
        ExchangeProxy[chainId],
        parseUnits(makerAmount.toString(), makerTokenData.decimals),
      )
      addRecentTransaction({
        hash: approvalTransaction?.hash,
        description: `Approve ${makerTokenData.symbol} for ${makerAmount}`,
      })
      await approvalTransaction.wait()
    } catch (e) {
      console.log(e?.message || e)
    } finally {
      setWaitingForApproval(false)
    }
  }
  return (
    <>
      {hasSufficientAllowance ? (
        <div>
          <span>
            {makerTokenData.name} is already approved for transfer on the 0x Exchange Proxy
          </span>
        </div>
      ) : (
        <div>
          <span>
            {makerTokenData.name} Token allowance {tokenAllowance.toString()} does not cover the
            order. Approve tokens for transfer to the 0x Exchange Proxy.
          </span>
          <ActionButton
            className={waitingForApproval ? 'loading' : ''}
            color="purple"
            onClick={approveToken}
          >
            Approve {makerTokenData.symbol} for {makerAmount}
          </ActionButton>
        </div>
      )}
    </>
  )
}
