// eslint-disable-next-line import/no-extraneous-dependencies
import { Interface } from '@ethersproject/abi'

import { ChainId } from '../../utils'
import V1_EXCHANGE_ABI from './v1_exchange.json'
import V1_FACTORY_ABI from './v1_factory.json'

import { isProdGoerli } from '@/connectors'

const V1_FACTORY_ADDRESS = '0x9f20521EF789fd2020e708390b1E6c701d8218BA'
const V1_FACTORY_INTERFACE = new Interface(V1_FACTORY_ABI)
const V1_EXCHANGE_INTERFACE = new Interface(V1_EXCHANGE_ABI)

const V1_BOND_FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [1]: '0x9f20521EF789fd2020e708390b1E6c701d8218BA',
  [5]: isProdGoerli
    ? '0xBE9A5b24dbEB65b21Fc91BD825257f5c4FE9c01D'
    : '0xBE9A5b24dbEB65b21Fc91BD825257f5c4FE9c01D',
}

export {
  V1_FACTORY_ADDRESS,
  V1_BOND_FACTORY_ADDRESS,
  V1_FACTORY_INTERFACE,
  V1_FACTORY_ABI,
  V1_EXCHANGE_INTERFACE,
  V1_EXCHANGE_ABI,
}
