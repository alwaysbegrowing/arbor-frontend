import { ChainId } from '../../utils'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [1]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [5]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
