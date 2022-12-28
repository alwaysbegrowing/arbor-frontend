import { chain } from 'wagmi'

export const isGoerli = false //!window.location.href.includes('app.arbor')
export const isProdGoerli = false //window.location.href.includes('goerli.arbor')
export const isProd = true //window.location.href.includes('app.arbor')
export const requiredChain = isGoerli ? chain.goerli : chain.mainnet
