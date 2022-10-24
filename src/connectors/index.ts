import { chain } from 'wagmi'

export const isGoerli = !window.location.href.includes('app.arbor')
export const isProdGoerli = window.location.href.includes('goerli.arbor')
export const isProd = window.location.href.includes('app.arbor')
export const requiredChain = isGoerli ? chain.goerli : chain.mainnet
