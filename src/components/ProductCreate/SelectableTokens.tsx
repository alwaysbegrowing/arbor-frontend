import { chain } from 'wagmi'

import { FOXIcon } from './icons/FOXIcon'
import { RBNIcon } from './icons/RBNIcon'
import { UNIIcon } from './icons/UNIIcon'
import { USDCIcon } from './icons/USDCIcon'

import { isGoerli } from '@/connectors'

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

export const TESTNET_TOKEN_MAP: { [key: string]: string } = {
  // UNI goerli
  ['0x1ee2926BDd6c0A34207BAEb7B8fAa12cdE0BC315'.toLowerCase()]:
    '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  // FOX goerli
  ['0xB514a1237860308db88758D26Bc9B065BC310748'.toLowerCase()]:
    '0xc770EEfAd204B5180dF6a14Ee197D99d808ee52d',
  // USDC goerli
  ['0x5a2D26D95b07C28d735ff76406bd82fE64222Dc1'.toLowerCase()]:
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
}
export const RIBBON_TOKEN = '0x6123b0049f904d730db3c36a31167d9d4121fa6b'

export const getMappedToken = (tokenContractAddress?: string) => {
  if (!isGoerli || !tokenContractAddress) {
    return tokenContractAddress
  }
  return TESTNET_TOKEN_MAP[tokenContractAddress.toLowerCase()]?.toLowerCase()
}

export const CollateralTokens = {
  [chain.mainnet.id]: [
    {
      name: 'RBN',
      icon: RBNIcon,
      address: '0x6123b0049f904d730db3c36a31167d9d4121fa6b',
      decimals: 18,
    },
    {
      name: 'FOX',
      icon: FOXIcon,
      address: '0xc770eefad204b5180df6a14ee197d99d808ee52d',
      decimals: 18,
    },
  ],
  [chain.goerli.id]: [
    {
      name: 'UNI',
      icon: UNIIcon,
      address: '0x1ee2926BDd6c0A34207BAEb7B8fAa12cdE0BC315',
      decimals: 18,
    },
    {
      name: 'FOX',
      icon: FOXIcon,
      address: '0xB514a1237860308db88758D26Bc9B065BC310748',
      decimals: 18,
    },
  ],
}

// Make sure the address is all lowercase
export const IssuerAllowList = [
  '0xfab4af4ea2eb609868cdb4f744155d67f0a5bf41',
  '0xf544286b80bc5e0ae4e37421a8c5c15a7cb813cc',
  '0x90A48D5CF7343B08dA12E067680B4C6dbfE551Be',
]
