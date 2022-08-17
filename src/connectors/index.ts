import { chain } from 'wagmi'

export const isRinkeby = !window.location.href.includes('app.arbor')
export const isProdRinkeby = window.location.href.includes('rinkeby.arbor')
export const isProd = window.location.href.includes('app.arbor')
export const requiredChain = isRinkeby ? chain.rinkeby : chain.mainnet
