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
  [chain.rinkeby.id]: [
    {
      name: 'USDC',
      icon: USDCIcon,
      address: '0x097B212EFc307B102B37889Bede934EEe74Cda27',
      decimals: 6,
    },
  ],
}

export const AccessManagerContract = {
  [chain.mainnet.id]: '0x0F4648d997e486cE06577d6Ee2FecBcA84b834F4',
  [chain.rinkeby.id]: '0x7C882F296335734B958b35DA6b2595FA00043AE9',
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
  [chain.rinkeby.id]: [
    {
      name: 'UNI',
      icon: UniIcon,
      address: '0x81629B9CCe9C92ec6706Acc9d9b7A7d39510985F',
      decimals: 18,
    },
  ],
}

export const IssuerAllowList = ['0xfab4af4ea2eb609868cdb4f744155d67f0a5bf41']
