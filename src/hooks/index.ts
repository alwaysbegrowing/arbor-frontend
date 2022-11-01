import { requiredChain } from 'src/connectors'
import { useAccount, useBlockNumber, useNetwork, useProvider, useSigner } from 'wagmi'

export function useActiveWeb3React() {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const provider = useProvider()
  const { data: blockNumber } = useBlockNumber()
  const { data: signer } = useSigner()

  return {
    account: address,
    active: !!chain,
    chainId: chain?.id || requiredChain.id,
    provider,
    blockNumber,
    library: provider,
    signer,
  }
}
