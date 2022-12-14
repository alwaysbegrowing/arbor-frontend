import useSWR from 'swr'

import { useActiveWeb3React } from '.'
import { getLogger } from '../utils/logger'

const logger = getLogger('useOrderbook')

const fetcher = (url: string) => fetch(url).then((r) => r.json())
export const ZERO_X_BASE_URL: { [key: number]: string } = {
  1: 'https://api.0x.org',
  5: 'https://eip712api.xyz/0x',
}

export const ZERO_X_ENDPOINT: { [key: number]: { [key: string]: string } } = {
  1: {
    pair: '/orderbook/v1',
    pairs: '/orderbook/v1/orders',
    order: '/orderbook/v1/order',
  },
  5: {
    pair: '/orderbook/v1/pair',
    pairs: '/orderbook/v1/pairs',
    order: '/orderbook/v1/order',
  },
}

export const useOrderbookPair = (
  baseToken?: string,
  quoteToken?: string,
): { bids: { records: any[] }; asks: { records: any[] }; loading: boolean } => {
  const { chainId } = useActiveWeb3React()
  const { data, error } = useSWR(
    `${ZERO_X_BASE_URL[chainId]}${ZERO_X_ENDPOINT[chainId]['pair']}?baseToken=${baseToken}&quoteToken=${quoteToken}`,
    fetcher,
    { refreshInterval: 60 * 1000 },
  )

  if (error) {
    logger.error('Error getting useOrderbook info', error)
  }

  return {
    bids: data?.bids,
    asks: data?.asks,
    loading: !error && !data,
  }
}

export const useOrderbookPairs = (): { bids: {}; asks: {}; loading: boolean } => {
  const { chainId } = useActiveWeb3React()
  const { data, error } = useSWR(
    `${ZERO_X_BASE_URL[chainId]}${
      ZERO_X_ENDPOINT[chainId]['pairs']
    }?page=${2}&perPage=${1000}&feeRecipient=0xafded11c6fc769aaae90630fd205a2713e544ce3`,
    fetcher,
    { refreshInterval: 60 * 1000 },
  )

  if (error) {
    logger.error('Error getting useOrderbook info', error)
  }
  console.log(data)
  return {
    bids: data?.bids,
    asks: data?.asks,
    loading: !error && !data,
  }
}
