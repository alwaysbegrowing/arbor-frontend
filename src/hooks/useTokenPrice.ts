import useSWR from 'swr'
import { useNetwork } from 'wagmi'

import { RIBBON_TOKEN, getMappedToken } from '../components/ProductCreate/SelectableTokens'
import { getLogger } from '../utils/logger'

const logger = getLogger('useTokenPrice')

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const coinGekoBaseUrl = 'https://api.coingecko.com/api/v3'

export const useTokenPrice = (tokenContractAddress?: string): { data: any; loading: boolean } => {
  const { chain } = useNetwork()
  // The tokens used on the testnet will not exist so no price will be returned
  // this uses ribbon token instead of the real tokens on dev
  // so we have pricing data
  const resolvedTokenAddress = getMappedToken(tokenContractAddress, chain) || RIBBON_TOKEN
  const { data, error } = useSWR(
    `${coinGekoBaseUrl}/simple/token_price/ethereum?vs_currencies=usd&contract_addresses=${resolvedTokenAddress}`,
    fetcher,
    { refreshInterval: 60 * 1000 },
  )

  if (error) {
    logger.error('Error getting useTokenPrice info', error)
  }

  return {
    data: data?.[resolvedTokenAddress]?.usd,
    loading: !error && !data,
  }
}

export const useHistoricTokenPrice = (
  tokenContractAddress: string,
  days: number,
): {
  data: [EpochTimeStamp, number]
  loading: boolean
} => {
  // The tokens used on the testnet will not exist so no price will be returned
  // this uses ribbon token instead of the real tokens on dev
  // so we have pricing data
  const { chain } = useNetwork()
  const resolvedTokenAddress = getMappedToken(tokenContractAddress, chain) || RIBBON_TOKEN

  const url = `${coinGekoBaseUrl}/coins/ethereum/contract/${resolvedTokenAddress}/market_chart/?vs_currency=usd&days=${days}&interval=daily`
  const { data, error } = useSWR(url, fetcher, { refreshInterval: 600 * 1000 })

  if (error) {
    logger.error('Error getting useHistoricTokenPrice info', error)
  }

  return {
    data: data?.prices,
    loading: !error && !data,
  }
}
