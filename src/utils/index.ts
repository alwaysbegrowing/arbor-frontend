import { Signer } from 'ethers'

import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { parseBytes32String } from '@ethersproject/strings'
import { JSBI, Percent, Token, TokenAmount, WETH } from '@josojo/honeyswap-sdk'
import IUniswapV2PairABI from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { chain, etherscanBlockExplorers } from 'wagmi'

import { EasyAuction } from '../../gen/types'
import easyAuctionABI from '../constants/abis/easyAuction/easyAuction.json'
import ERC20_ABI from '../constants/abis/erc20.json'
import ERC20_BYTES32_ABI from '../constants/abis/erc20_bytes32.json'
import { getLogger } from '../utils/logger'

import { requiredChain } from '@/connectors'
import { Token as GraphToken } from '@/generated/graphql'

const logger = getLogger('utils/index')

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export enum ChainId {
  MAINNET = 1,
  GOERLI = 5,
}

export const EASY_AUCTION_NETWORKS: { [key: number]: string } = {
  [1]: '0x0b7fFc1f4AD541A4Ed16b40D8c37f0929158D101',
  [5]: '0x1fbab40c338e2e7243da945820ba680c92ef8281',
  [chain.hardhat.id]: '0x1fbab40c338e2e7243da945820ba680c92ef8281',
}

export const DEPOSIT_AND_PLACE_ORDER: { [key: number]: string } = {
  [1]: '0x10D15DEA67f7C95e2F9Fe4eCC245a8862b9B5B96',
  [5]: '0xc6e51F2cb369F03672197D0C31Dd5F0d9566217B',
  [chain.hardhat.id]: '0xc6e51F2cb369F03672197D0C31Dd5F0d9566217B',
}

type NetworkConfig = {
  etherscanUrl?: string
}

export const NETWORK_CONFIGS: { [key: number]: NetworkConfig } = {
  [chain.mainnet.id]: {
    etherscanUrl: etherscanBlockExplorers.mainnet.url,
  },
  [chain.goerli.id]: {
    etherscanUrl: etherscanBlockExplorers.goerli.url,
  },
  [chain.hardhat.id]: {
    etherscanUrl: 'https://app.tryethernal.com',
  },
}

const getExplorerPrefix = (chainId: ChainId) => NETWORK_CONFIGS[chainId].etherscanUrl

export function getExplorerLink(data: string, type: 'transaction' | 'address'): string {
  const prefix = getExplorerPrefix(requiredChain.id)

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: TokenAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ]
}

// account is optional
export function getContract(address: string, ABI: any, signer: Signer): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, signer)
}

// account is optional
export function getEasyAuctionContract(signer: Signer): EasyAuction {
  return getContract(
    EASY_AUCTION_NETWORKS[requiredChain.id as number],
    easyAuctionABI,
    signer,
  ) as EasyAuction
}

// account is optional
export function getExchangeContract(pairAddress: string, signer: Signer) {
  return getContract(pairAddress, IUniswapV2PairABI.abi, signer)
}

// get token info and fall back to unknown if not available, except for the
// decimals which falls back to null
export async function getTokenInfoWithFallback(
  tokenAddress: string,
  signer: Signer,
): Promise<{ name: string; symbol: string; decimals: null | number }> {
  if (!isAddress(tokenAddress)) {
    throw Error(`Invalid 'tokenAddress' parameter '${tokenAddress}'.`)
  }

  const token = getContract(tokenAddress, ERC20_ABI, signer)

  const namePromise: Promise<string> = token.name().catch(() =>
    getContract(tokenAddress, ERC20_BYTES32_ABI, signer)
      .name()
      .then(parseBytes32String)
      .catch((e: Error) => {
        logger.debug('Failed to get name for token address', e, tokenAddress)
        return 'Unknown'
      }),
  )

  const symbolPromise: Promise<string> = token.symbol().catch(() => {
    const contractBytes32 = getContract(tokenAddress, ERC20_BYTES32_ABI, signer)
    return contractBytes32
      .symbol()
      .then(parseBytes32String)
      .catch((e: Error) => {
        logger.debug('Failed to get symbol for token address', e, tokenAddress)
        return 'UNKNOWN'
      })
  })
  const decimalsPromise: Promise<Maybe<number>> = token.decimals().catch((e: Error) => {
    logger.debug('Failed to get decimals for token address', e, tokenAddress)
    return null
  })

  const [name, symbol, decimals]: [string, string, Maybe<number>] = (await Promise.all([
    namePromise,
    symbolPromise,
    decimalsPromise,
  ])) as [string, string, Maybe<number>]
  return { name, symbol, decimals }
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

// Always return a non-undefined token display
export function getTokenDisplay(token: Token): string {
  return token?.name || token?.symbol?.slice(0, 7) || token?.address?.slice(0, 7) || '-'
}

export function getDisplay(token: GraphToken): string {
  if (!token?.symbol) return '-'

  return token.symbol.slice(0, 7)
}

// Always return a non-undefined token display
export function getFullTokenDisplay(token: Token, chainId: ChainId): string {
  if (isTokenWETH(token.address, chainId)) return `ETH`
  return token?.symbol || token?.name || token?.address || '-'
}

export function isTokenWETH(tokenAddress?: string, chainId?: ChainId): boolean {
  return (
    !!tokenAddress &&
    !!chainId &&
    !!WETH[chainId] &&
    tokenAddress == WETH[chainId].address &&
    (chainId === 1 || chainId === 5)
  )
}

export function isTimeout(timeId: NodeJS.Timeout | undefined): timeId is NodeJS.Timeout {
  return typeof timeId !== 'undefined'
}

export type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
