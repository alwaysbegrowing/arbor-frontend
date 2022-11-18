import { BigNumber, constants, utils } from 'ethers'

import { AddressZero } from '@ethersproject/constants'
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
export const sellLimitOrder = async (orderData) => {
  if (!window?.ethereum) return
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  })

  const address = accounts[0]
  console.log(address)

  const collateralTokenUnit = utils.parseUnits('1', orderData.collateralDecimals)

  const nbrOptionsToSell = orderData.nbrOptions

  // Derive the collateralTokenAmount (takerAmount in Sell Limit) from the user's nbrOptionsToSell input.
  const collateralTokenAmount = nbrOptionsToSell
    .mul(orderData.limitPrice) // limitPrice is expressed as an integer with collateral token decimals
    .div(collateralTokenUnit) // correction factor in integer multiplication

  // Calculate trading fee amount (expressed as an integer with collateral token decimals)
  // Note that the fee is paid in collateral token which is the taker token in Sell Limit
  const tradingFee = 0
  const divaGovernanceAddress = constants.AddressZero
  const NULL_ADDRESS = constants.AddressZero
  const config = {
    5: {
      order: 'https://eip712api.xyz/0x/orderbook/v1/order',
    },
  }
  const collateralTokenFeeAmount = collateralTokenAmount
    .mul(utils.parseUnits(tradingFee.toString(), orderData.collateralDecimals))
    .div(collateralTokenUnit)

  // Get 0x API url to post order
  const networkUrl = config[orderData.chainId].order
  // Construct order object

  const order = {
    makerToken: orderData.makerToken,
    takerToken: orderData.takerToken,
    makerAmount: BigNumber.from(nbrOptionsToSell.toString()),
    takerAmount: BigNumber.from('1000'), //" collateralTokenAmount.toString()"
    takerTokenFeeAmount: BigNumber.from('0'),
    maker: address,
    taker: AddressZero,
    sender: address,
    feeRecipient: address,
    pool: '0x0000000000000000000000000000000000000000000000000000000000000000',
    expiry: BigNumber.from('1668787482'),
    salt: BigNumber.from(Date.now().toString()),
    chainId: orderData.chainId,
    verifyingContract: orderData.exchangeProxy,
  }
  console.log('hia')
  // TODO: Export this part into a separate function
  console.log(orderData.chainId)
  console.log(orderData.exchangeProxy)
  console.log(order)
  const signedTypedData = await orderData.signer._signTypedData(
    zeroXDomain({
      chainId: orderData.chainId,
      verifyingContract: orderData.exchangeProxy,
    }),
    zeroXTypes,
    order,
  )
  const { r, s, v } = splitSignature(signedTypedData)
  const signature = {
    v: v,
    r: r,
    s: s,
    signatureType: 2,
  }
  const signedOrder = {
    ...order,
    expiry: order.expiry.toString(),
    takerTokenFeeAmount: order.takerTokenFeeAmount.toString(),
    takerAmount: order.takerAmount.toString(),
    makerAmount: order.makerAmount.toString(),
    salt: order.salt.toString(),
    signature,
  }
  console.log('signed')

  const resp = await fetch(networkUrl, {
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
