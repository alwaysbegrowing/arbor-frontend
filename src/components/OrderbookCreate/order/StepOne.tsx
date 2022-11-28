import { BigNumber } from 'ethers'
import React from 'react'

import { LimitOrderFields } from '@0x/protocol-utils'
import { AddressZero } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { useFormContext } from 'react-hook-form'
import { useContract, useContractRead } from 'wagmi'

import { BondSelector } from '../../ProductCreate/selectors/CollateralTokenSelector'

import { ExchangeProxy } from '@/components/ProductCreate/SelectableTokens'
import BorrowTokenSelector from '@/components/ProductCreate/selectors/BorrowTokenSelector'
import TooltipElement from '@/components/common/Tooltip'
import BOND_ABI from '@/constants/abis/bond.json'
import { useActiveWeb3React } from '@/hooks'
import { sellLimitOrder } from '@/pages/BondDetail/OrderbookApi'
import { useWalletModalToggle } from '@/state/application/hooks'

export const StepOne = () => {
  const { register, watch } = useFormContext()
  const { account, chainId, signer } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const [bondToAuction, borrowToken, makerAmount, takerAmount, expiry] = watch([
    'bondToAuction', // makerToken
    'borrowToken', // takerToken
    'makerAmount',
    'takerAmount',
    'expiry',
  ])
  const addRecentTransaction = useAddRecentTransaction()

  const { data: bondAllowance } = useContractRead({
    addressOrName: bondToAuction?.id || AddressZero,
    contractInterface: BOND_ABI,
    functionName: 'allowance',
    args: [account, ExchangeProxy[chainId]],
  })
  const contract = useContract({
    addressOrName: bondToAuction?.id || AddressZero,
    contractInterface: BOND_ABI,
    signerOrProvider: signer,
  })
  const sellLimit = () => {
    console.log(bondAllowance)
    if (bondToAuction && (bondAllowance as unknown as BigNumber).eq(0)) {
      return contract
        .approve(ExchangeProxy[chainId], parseUnits(`${makerAmount || 0}`, bondToAuction?.decimals))
        .then((result) => {
          addRecentTransaction({
            hash: result?.hash,
            description: `Approve ${
              bondToAuction?.symbol || bondToAuction?.name
            } for ${makerAmount}`,
          })
          return result.wait()
        })
        .then(() => {
          console.log('setCurrentApproveStep(1)')
        })
        .catch((e) => {
          console.log(e?.message || e)
        })
    }
    if (!signer || !chainId) {
      return
    }
    // need "as any" otherwise signing data breaks on type check
    const orderData: LimitOrderFields = {
      makerToken: bondToAuction.id,
      takerToken: borrowToken.address,
      makerAmount: makerAmount.toString(),
      takerAmount: takerAmount.toString(),
      takerTokenFeeAmount: '0' as any,
      maker: account,
      pool: '0x0000000000000000000000000000000000000000000000000000000000000000',
      taker: AddressZero,
      sender: AddressZero,
      feeRecipient: '0xafded11c6fc769aaae90630fd205a2713e544ce3',
      expiry: Math.floor(Date.now() / 1000 + 3000).toString() as any,
      salt: Date.now().toString() as any,
      chainId,
      verifyingContract: ExchangeProxy[chainId],
    }
    const postSellLimitOrder = async () => {
      await sellLimitOrder(orderData, { signer })
    }
    postSellLimitOrder()
  }
  return (
    <>
      <div className="form-control w-full">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Bond</span>}
            tip="Bond you will be trading"
          />
        </label>

        <BondSelector />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Number of bonds</span>}
            tip="Number of bonds you will be selling"
          />
        </label>
        <input
          className="input-bordered input w-full"
          inputMode="numeric"
          min={1}
          placeholder="0"
          type="number"
          {...register('makerAmount', {
            required: 'Some bonds must be sold',
            valueAsNumber: true,
            validate: {
              greaterThanZero: (value) => value > 0 || 'Some bonds must be sold',
            },
          })}
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Token</span>}
            tip="Token that will be bought"
          />
        </label>
        <BorrowTokenSelector />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Number of Token</span>}
            tip="Minimum price you are willing to accept per bond"
          />
        </label>
        <input
          className="input-bordered input w-full"
          inputMode="numeric"
          min="0"
          placeholder="0"
          step="0.001"
          type="number"
          {...register('takerAmount', {
            required: 'Bonds cannot be given away for free',
            valueAsNumber: true,
            validate: {
              greaterThanZero: (value) => value > 0 || 'Bonds cannot be given away for free',
            },
          })}
        />
        {!account ? (
          <button className="btn my-10" onClick={toggleWalletModal}>
            connect wallet
          </button>
        ) : (
          <button className="btn my-10" onClick={sellLimit}>
            do the order
          </button>
        )}
      </div>
    </>
  )
}
