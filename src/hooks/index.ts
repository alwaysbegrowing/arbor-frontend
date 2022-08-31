import { useAccount, useBlockNumber, useNetwork, useProvider, useSigner } from 'wagmi'

import { requiredChain } from '@/connectors'

export function useActiveWeb3React() {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const provider = useProvider()
  const { data: blockNumber } = useBlockNumber()
  const { data: signer } = useSigner()

  console.log(chain, 'chain')

  return {
    account: address,
    active: !!chain,
    chainId: chain?.id || requiredChain,
    provider,
    blockNumber,
    library: provider,
    signer,
  }
}
