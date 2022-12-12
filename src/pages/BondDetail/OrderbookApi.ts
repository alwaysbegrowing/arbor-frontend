import { LimitOrder, LimitOrderFields } from '@0x/protocol-utils'
import { splitSignature } from 'ethers/lib/utils'

export const zeroXDomain = ({
  chainId,
  verifyingContract,
}: {
  verifyingContract: string
  chainId: number
}) => ({
  chainId,
  verifyingContract,
  name: 'ZeroEx',
  version: '1.0.0',
})

const ZERO_X_MESSAGE_STRUCT = [
  { type: 'address', name: 'makerToken' },
  { type: 'address', name: 'takerToken' },
  { type: 'uint128', name: 'makerAmount' },
  { type: 'uint128', name: 'takerAmount' },
  { type: 'uint128', name: 'takerTokenFeeAmount' },
  { type: 'address', name: 'maker' },
  { type: 'address', name: 'taker' },
  { type: 'address', name: 'sender' },
  { type: 'address', name: 'feeRecipient' },
  { type: 'bytes32', name: 'pool' },
  { type: 'uint64', name: 'expiry' },
  { type: 'uint256', name: 'salt' },
]

export const zeroXTypes = {
  LimitOrder: ZERO_X_MESSAGE_STRUCT,
}

const config = {
  5: {
    order: 'https://eip712api.xyz/0x/orderbook/v1/order/',
  },
}

export const sellLimitOrder = async (orderData: LimitOrderFields, { signer }) => {
  const order = new LimitOrder(orderData)
  const signedTypedData = await signer._signTypedData(zeroXDomain(orderData), zeroXTypes, order)
  const { r, s, v } = splitSignature(signedTypedData)

  const signedOrder = {
    ...order,
    signature: {
      v,
      r,
      s,
      signatureType: 2,
    },
  }

  const resp = await fetch(config[orderData.chainId].order, {
    method: 'POST',
    body: JSON.stringify(signedOrder),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (resp.status === 200) {
    alert('Order successfully created')
  } else {
    const body = await resp.json()
    alert(`ERROR(status code ${resp.status}): ${JSON.stringify(body, undefined, 2)}`)
  }
  return resp
}

const getFillLimitOrder = async (orderData: LimitOrderFields, { signer }) => {
  const order = orderData
  const signedTypedData = await signer._signTypedData(zeroXDomain(orderData), zeroXTypes, order)
  const { r, s, v } = splitSignature(signedTypedData)

  const signedOrder = {
    ...order,
    signature: {
      v,
      r,
      s,
      signatureType: 2,
    },
  }

  const resp = await fetch()
}
