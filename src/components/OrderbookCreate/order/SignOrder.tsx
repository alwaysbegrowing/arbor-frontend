import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { LimitOrderFields } from '@0x/protocol-utils'
import { AddressZero } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'
import dayjs from 'dayjs'
import { useFormContext } from 'react-hook-form'

import { ExchangeProxy } from '@/components/ProductCreate/SelectableTokens'
import { ActionButton } from '@/components/auction/Claimer'
import { useActiveWeb3React } from '@/hooks'
import { sellLimitOrder } from '@/pages/BondDetail/OrderbookApi'

export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const SignOrder = () => {
  const [signed, setSigned] = useState(false)
  const navigate = useNavigate()

  const { watch } = useFormContext()
  const { account, chainId, signer } = useActiveWeb3React()
  const [bondToAuction, borrowToken, makerAmount, takerAmount, expiry, isSell] = watch([
    'bondToAuction',
    'borrowToken',
    'makerAmount',
    'takerAmount',
    'expiry',
    'isSell',
  ])

  const limitOrder = async () => {
    if (!signer || !chainId) {
      return
    }

    const orderData: LimitOrderFields = {
      makerToken: isSell ? bondToAuction.id : borrowToken.address,
      takerToken: isSell ? borrowToken.address : bondToAuction.id,
      makerAmount: isSell
        ? (parseUnits(makerAmount.toString(), bondToAuction.decimals).toString() as any)
        : (parseUnits(takerAmount.toString(), borrowToken.decimals).toString() as any),
      takerAmount: isSell
        ? (parseUnits(takerAmount.toString(), borrowToken.decimals).toString() as any)
        : (parseUnits(makerAmount.toString(), bondToAuction.decimals).toString() as any),
      takerTokenFeeAmount: '0' as any,
      maker: account,
      pool: '0x0000000000000000000000000000000000000000000000000000000000000000',
      taker: AddressZero,
      sender: AddressZero,
      feeRecipient: AddressZero,
      expiry: Math.floor(dayjs(expiry).unix()).toString() as any,
      salt: Date.now().toString() as any,
      chainId,
      verifyingContract: ExchangeProxy[chainId],
    }

    return await sellLimitOrder(orderData, { signer })
  }
  return (
    <>
      <div className="form-control w-full">
        <span>
          Interact with 0x protocol by transmitting a signature with the order details. This is sent
          to the 0x server and will show up on the{' '}
          <a className="text-[#6CADFB] hover:underline" href="/orderbook">
            orderbook list
          </a>
          .
        </span>
        {signed ? (
          <ActionButton
            onClick={() => {
              navigate('/orderbook')
            }}
          >
            View orderbook page
          </ActionButton>
        ) : (
          <ActionButton
            className="btn"
            onClick={async () => {
              const isSigned = await limitOrder()
              if (isSigned) {
                setSigned(true)
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
