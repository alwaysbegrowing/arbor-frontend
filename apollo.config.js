// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: __dirname + '/.env' })

module.exports = {
  client: {
    service: {
      name: 'arbor-subgraph',
      url: process.env.REACT_APP_SUBGRAPH_URL_RINKEBY,
    },
  },
}
