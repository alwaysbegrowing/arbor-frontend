import { chain } from 'wagmi'

import { RBNIcon } from './icons/RBNIcon'
import { USDCIcon } from './icons/USDCIcon'
import { UniIcon } from './icons/UniIcon'

export const BorrowTokens = {
  [chain.mainnet.id]: [
    {
      name: 'USDC',
      icon: USDCIcon,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimals: 6,
    },
  ],
  [chain.goerli.id]: [
    {
      name: 'USDC',
      icon: USDCIcon,
      address: '0x5a2D26D95b07C28d735ff76406bd82fE64222Dc1',
      decimals: 6,
    },
  ],
}

export const AccessManagerContract = {
  [chain.mainnet.id]: '0x0F4648d997e486cE06577d6Ee2FecBcA84b834F4',
  [chain.goerli.id]: '0x6de1Fe949103087Be8dD6471076331379789ba90',
}

export const CollateralTokens = {
  [chain.mainnet.id]: [
    {
      name: 'RBN',
      icon: RBNIcon,
      address: '0x6123b0049f904d730db3c36a31167d9d4121fa6b',
      decimals: 18,
    },
  ],
  [chain.goerli.id]: [
    {
      name: 'UNI',
      icon: UniIcon,
      address: '0x1ee2926BDd6c0A34207BAEb7B8fAa12cdE0BC315',
      decimals: 18,
    },
  ],
}

export const IssuerAllowList = ['0xfab4af4ea2eb609868cdb4f744155d67f0a5bf41']

export const ExchangeProxy = {
  [chain.mainnet.id]: '',
  [chain.goerli.id]: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
}
