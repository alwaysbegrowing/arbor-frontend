import { gql, useQuery } from '@apollo/client'

import { useActiveWeb3React } from '.'

import { AccountDetailsDocument, Bond } from '@/generated/graphql'
import { getLogger } from '@/utils/logger'

const logger = getLogger('useBondsPortfolio')

gql`
  query AccountDetails($account: ID!) {
    account(id: $account) {
      tokenBalances {
        amount
        bond {
          id
          state
          name
          symbol
          decimals
          type
          owner
          maturityDate
          paymentToken {
            id
            decimals
            symbol
          }
          collateralToken {
            id
            decimals
            symbol
          }
          collateralRatio
          convertibleRatio
          maxSupply
          clearingPrice
          auctions {
            end
          }
        }
      }
    }
  }
`

export interface TokenBalance {
  amount: number
  bond: Bond
}

export const useBondsPortfolio = () => {
  const { account } = useActiveWeb3React()
  const { data, error, loading } = useQuery(AccountDetailsDocument, {
    variables: { account: (account && account?.toLowerCase()) || '0x00' },
    fetchPolicy: 'no-cache',
  })

  if (error) {
    logger.error('Error getting useBondsPortfolio info', error)
  }
  const portfolio = []
  data?.account?.tokenBalances?.forEach(({ amount, bond }) => {
    portfolio.push({
      ...bond,
      tokenBalances: [{ amount }],
    })
  })

  return { data: portfolio, loading }
}
