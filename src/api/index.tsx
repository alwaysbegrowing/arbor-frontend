import { chain } from 'wagmi'

import { API_URL_DEVELOP_MAINNET, API_URL_PRODUCTION_MAINNET } from '../constants/config'
import {
  AdditionalServicesApi,
  AdditionalServicesApiImpl,
  AdditionalServicesEndpoint,
} from './AdditionalServicesApi'
import { TokenLogosServiceApi, TokenLogosServiceApiInterface } from './TokenLogosServiceApi'

function createAdditionalServiceApi(): AdditionalServicesApi {
  const config: AdditionalServicesEndpoint[] = [
    {
      networkId: chain.mainnet.id,
      url_production: API_URL_PRODUCTION_MAINNET,
      url_develop: API_URL_DEVELOP_MAINNET,
    },
  ]
  config.push({
    networkId: chain.goerli.id,
    url_production: API_URL_PRODUCTION_MAINNET,
    url_develop: API_URL_DEVELOP_MAINNET,
  })
  config.push({
    networkId: chain.hardhat.id,
    url_production: API_URL_PRODUCTION_MAINNET,
    url_develop: API_URL_DEVELOP_MAINNET,
  })
  const dexPriceEstimatorApi = new AdditionalServicesApiImpl(config)

  window['dexPriceEstimatorApi'] = dexPriceEstimatorApi
  return dexPriceEstimatorApi
}

// Build APIs
export const additionalServiceApi: AdditionalServicesApi = createAdditionalServiceApi()
export const tokenLogosServiceApi: TokenLogosServiceApiInterface = new TokenLogosServiceApi()
