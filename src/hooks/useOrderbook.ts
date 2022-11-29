import useSWR from 'swr'

import { getLogger } from '../utils/logger'

const logger = getLogger('useOrderbook')

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const orderbookPairURL = 'https://eip712api.xyz/0x/orderbook/v1/pair'
const orderbookPairsURL = 'https://eip712api.xyz/0x/orderbook/v1/pairs'
const graphUrl = 'https://api.thegraph.com/subgraphs/name/divaprotocol/diva-goerli'

export const useOrderbookPair = (
  baseToken?: string,
  quoteToken?: string,
): { bids: { records: any[] }; asks: { records: any[] }; loading: boolean } => {
  const { data, error } = useSWR(
    `${orderbookPairURL}?baseToken=${baseToken}&quoteToken=${quoteToken}`,
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
  const { data, error } = useSWR(
    `${orderbookPairsURL}?page=${2}&perPage=${1000}&graphUrl=${graphUrl}&feeRecipient=0xafded11c6fc769aaae90630fd205a2713e544ce3`,
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
