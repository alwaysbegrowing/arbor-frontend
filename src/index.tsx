// import '@rainbow-me/rainbowkit/styles.css'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
import { RainbowKitProvider, Theme, darkTheme, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { merge } from 'lodash'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { WagmiConfig, chain, chainId, configureChains, createClient } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

import { MobileBlocker } from './components/MobileBlocker'
import { isGoerli, isProdGoerli } from './connectors'
import App from './pages/App'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider from './theme'
import { GlobalStyle } from './theme/globalStyle'
import './index.css'

let configuredChains = []
if (isProdGoerli) {
  configuredChains = [chain.goerli]
} else if (isGoerli) {
  configuredChains = [chain.goerli, chain.hardhat]
} else {
  configuredChains = [chain.mainnet]
}

const { chains, provider } = configureChains(configuredChains, [
  jsonRpcProvider({
    rpc: (chain) => {
      if (chain.id !== chainId.goerli) return null
      return { http: process.env.REACT_APP_NETWORK_URL_GOERLI }
    },
  }),
  alchemyProvider({ apiKey: process.env.REACT_APP_NETWORK_URL_MAINNET.slice(-32) }),
  publicProvider(),
])

const { connectors } = getDefaultWallets({
  appName: 'Arbor',
  chains,
})

// Initialize the wagmi client with the GnosisConnector along with the default
// connectors. This is to support the Gnosis Safe website. It does not show up
// as a connector in the list, but that's OK as you must be on the site to work
const wagmiClient = createClient({
  connectors: [new SafeConnector({ chains }), ...connectors()],
  provider,
})

const Updaters = () => {
  return (
    <>
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

const container = document.getElementById('root')
const root = createRoot(container)

const apolloClient = new ApolloClient({
  uri: isGoerli
    ? process.env.REACT_APP_SUBGRAPH_URL_GOERLI
    : process.env.REACT_APP_SUBGRAPH_URL_MAINNET,
  connectToDevTools: true,
  cache: new InMemoryCache(),
})

const myTheme = merge(darkTheme(), {
  colors: {
    accentColor: '#e0e0e0',
    accentColorForeground: '#1e1e1e',
    connectButtonBackground: '#e0e0e0',
    connectButtonText: '#1e1e1e',
  },
} as Theme)

root.render(
  <>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} showRecentTransactions theme={myTheme}>
        <Provider store={store}>
          <ApolloProvider client={apolloClient}>
            <Updaters />
            <ThemeProvider>
              <GlobalStyle />
              <BrowserRouter>
                <div className="hidden sm:block">
                  <App />
                </div>
                <MobileBlocker />
              </BrowserRouter>
            </ThemeProvider>
          </ApolloProvider>
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  </>,
)
