import { createReducer } from '@reduxjs/toolkit'

import { loadTokenListFromAPI } from './actions'

export interface TokenListState {
  tokens: { [key: string]: string }
}

const initialState: TokenListState = {
  tokens: {},
}

export const DEV_tokens: { [key: string]: { [key: string]: string } } = {
  //RBN Token
  '0xac554b8fb63ac7a46819701953a7413290c81448': {
    image: 'https://etherscan.io/token/images/ribbon_32.png',
  },
  //RBN Bond Dev Test
  '0x3c585f028e0f8d8fa18d2c7dbe6fd40fcd6ea2a5': {
    image:
      'https://user-images.githubusercontent.com/44010262/170816957-67584771-3ba9-48be-8ddd-eaef9efe9e04.png',
  },
  //RBN Bond Rinkeby 1
  '0xfbdeec30e1c93463f6c4dcbda175613aee122016': {
    image:
      'https://user-images.githubusercontent.com/44010262/170816957-67584771-3ba9-48be-8ddd-eaef9efe9e04.png',
  },
  //RBN Bond Rinkeby 2
  '0xdd14fba06df518451b1defb0527e8f9b1174b639': {
    image:
      'https://user-images.githubusercontent.com/44010262/170816957-67584771-3ba9-48be-8ddd-eaef9efe9e04.png',
  },
  //RBN Bond Mainnet
  '0xe34c023c0ea9899a8f8e9381437a604908e8b719': {
    image:
      'https://user-images.githubusercontent.com/44010262/170816957-67584771-3ba9-48be-8ddd-eaef9efe9e04.png',
  },
  '0x708ef78a8aab8df64b80c5759a193a120027e2f0': {
    image:
      'https://raw.githubusercontent.com/porter-finance/docs/main/.gitbook/assets/porter_bond_60x60.png',
  },
  '0x9befc0322eef53531f3357b88333212c7ea8abe7': {
    image:
      'https://raw.githubusercontent.com/porter-finance/docs/main/.gitbook/assets/porter_bond_60x60.png',
  },
  //USDC
  '0x1860cbca2b99B6cEE49e60d37888104ADD667dfF': {
    image: 'https://etherscan.io/token/images/centre-usdc_28.png',
  },
  //USDC
  '0x1ee2926BDd6c0A34207BAEb7B8fAa12cdE0BC315': {
    image: 'https://etherscan.io/token/images/centre-usdc_28.png',
  },
  //FOX Goerli Convertible Bond
  '0x11f1f978f7944579bb3791b765176de3e68bffc6': {
    image:
      'https://assets.website-files.com/5cec55545d0f47cfe2a39a8e/61895a7ef8500fada381641f_FOX_token.svg',
  },
  //FOX Goerli
  '0xb514a1237860308db88758d26bc9b065bc310748': {
    image:
      'https://assets.website-files.com/5cec55545d0f47cfe2a39a8e/61895a7ef8500fada381641f_FOX_token.svg',
  },
  //FOX Mainnet Convertible Bond
  '0x2e2a42fbe7c7e2ffc031baf7442dbe1f8957770a': {
    image:
      'https://assets.website-files.com/5cec55545d0f47cfe2a39a8e/61895a7ef8500fada381641f_FOX_token.svg',
  },
  //ICHI Goerli
  '0x443bD404f87c19aC39aC67960DDdaE0A7788fce4': {
    image: 'https://avatars.githubusercontent.com/u/74116843?s=200&v=4',
  },
  //ICHI Goerli Convertible Bond
  '0xsssss': {
    image: 'https://avatars.githubusercontent.com/u/74116843?s=200&v=4',
  },
  //ICHI Mainnet Convertible Bond
  '0xyyyy': {
    image: 'https://avatars.githubusercontent.com/u/74116843?s=200&v=4',
  },
}

// Shows unicorn simple bond svg for these
export const DEV_bondImage = ['0xf16aaab318b61a0820a95207b54b7598b1eadc0c']

export default createReducer<TokenListState>(initialState, (builder) =>
  builder.addCase(loadTokenListFromAPI, (state: TokenListState, { payload: { tokenList } }) => {
    const tokens = tokenList ?? {}

    return {
      ...state,
      tokens,
    }
  }),
)
