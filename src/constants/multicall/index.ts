import { ChainId } from '../../utils'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [1]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [5]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
