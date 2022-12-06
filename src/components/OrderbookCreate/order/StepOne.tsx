import { BigNumber } from 'ethers'
import React from 'react'

import { LimitOrderFields } from '@0x/protocol-utils'
import { AddressZero } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import dayjs from 'dayjs'
import { useFormContext } from 'react-hook-form'
import { useContract, useContractRead } from 'wagmi'

import { BondSelector } from '../../ProductCreate/selectors/CollateralTokenSelector'
import { addDays } from './StepTwo'

import { ExchangeProxy } from '@/components/ProductCreate/SelectableTokens'
import BorrowTokenSelector from '@/components/ProductCreate/selectors/BorrowTokenSelector'
import { ActionButton } from '@/components/auction/Claimer'
import TooltipElement from '@/components/common/Tooltip'
import BOND_ABI from '@/constants/abis/bond.json'
import { useActiveWeb3React } from '@/hooks'
import { sellLimitOrder } from '@/pages/BondDetail/OrderbookApi'
import { useWalletModalToggle } from '@/state/application/hooks'

export const StepOne = (showSell) => {
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

  const ExpiryDate = () => {
    return (
      <div className="form-control w-full">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Order expiration date</span>}
            tip="Date the order must be fulfilled by. If not fulfilled, the order will be expired and removed from the orderbook. This is UTC time."
          />
        </label>
        <input
          className="input-bordered input w-full"
          defaultValue={`${addDays(new Date(), 0).toISOString().substring(0, 10)} 23:59`}
          min={dayjs(new Date()).utc().add(0, 'day').format('YYYY-MM-DD HH:mm')}
          placeholder="MM/DD/YYYY HH:mm"
          type="datetime-local"
          {...register('expiry', {
            required: 'Order expiration date',
            validate: {
              validDate: (expiry) =>
                dayjs(expiry).isValid() || 'The expiration date must be in the future',
              afterNow: (expiry) =>
                dayjs(expiry).diff(new Date()) > 0 || 'The expiration date must be in the future',
              before10Years: (expiry) =>
                dayjs(new Date()).add(10, 'years').isAfter(expiry) ||
                'The expiration date must be within 10 years',
            },
          })}
        />
      </div>
    )
  }

  const { data: bondAllowance } = useContractRead({
    addressOrName: bondToAuction?.id || AddressZero,
    contractInterface: BOND_ABI,
    functionName: 'allowance',
    args: [account, ExchangeProxy[chainId]],
  })
  const contractBond = useContract({
    addressOrName: bondToAuction?.id || AddressZero,
    contractInterface: BOND_ABI,
    signerOrProvider: signer,
  })
  const constractToken = useContract({
    addressOrName: borrowToken?.address || AddressZero,
    contractInterface: BOND_ABI,
    signerOrProvider: signer,
  })

  const sellLimit = () => {
    console.log(bondAllowance)
    if (bondToAuction && (bondAllowance as unknown as BigNumber).eq(0)) {
      return contractBond
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
      expiry: Math.floor(dayjs(expiry).unix()).toString() as any,
      salt: Date.now().toString() as any,
      chainId,
      verifyingContract: ExchangeProxy[chainId],
    }
    const postSellLimitOrder = async () => {
      await sellLimitOrder(orderData, { signer })
    }
    postSellLimitOrder()
  }

  const buyLimit = () => {
    console.log(bondAllowance)
    if (borrowToken?.address && (bondAllowance as unknown as BigNumber).eq(0)) {
      return constractToken
        .approve(ExchangeProxy[chainId], parseUnits(`${makerAmount || 0}`, bondToAuction?.decimals))
        .then((result) => {
          addRecentTransaction({
            hash: result?.hash,
            description: `Approve ${borrowToken?.symbol || borrowToken?.name} for ${makerAmount}`,
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
      makerToken: borrowToken.address,
      takerToken: bondToAuction.id,
      makerAmount: takerAmount.toString(),
      takerAmount: makerAmount.toString(),
      takerTokenFeeAmount: '0' as any,
      maker: account,
      pool: '0x0000000000000000000000000000000000000000000000000000000000000000',
      taker: AddressZero,
      sender: AddressZero,
      feeRecipient: '0xafded11c6fc769aaae90630fd205a2713e544ce3',
      expiry: Math.floor(dayjs(expiry).unix()).toString() as any,
      salt: Date.now().toString() as any,
      chainId,
      verifyingContract: ExchangeProxy[chainId],
    }
    const postBuyLimitOrder = async () => {
      await sellLimitOrder(orderData, { signer })
    }
    postBuyLimitOrder()
  }

  return (
    <>
      <div className="form-control w-full">
        <div className="flex items-center"></div>
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
            tip="Number of bonds you will be trading"
          />
        </label>
        <input
          className="input-bordered input w-full"
          inputMode="numeric"
          min={1}
          placeholder="0"
          type="number"
          {...register('makerAmount', {
            required: 'Some bonds must be traded',
            valueAsNumber: true,
            validate: {
              greaterThanZero: (value) => value > 0 || 'Some bonds must be traded',
            },
          })}
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Token</span>}
            tip="Token that will be traded"
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
        <ExpiryDate />
        {!account ? (
          <button className="btn my-10" onClick={toggleWalletModal}>
            connect wallet
          </button>
        ) : (
          <ActionButton
            className="btn my-10"
            onClick={() => {
              if (showSell) {
                sellLimit()
              } else {
                buyLimit()
              }
            }}
          >
            SIGN ORDER
          </ActionButton>
        )}
      </div>
    </>
  )
}