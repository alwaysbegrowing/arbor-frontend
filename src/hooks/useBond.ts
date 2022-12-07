import { gql, useQuery } from '@apollo/client'

import { useActiveWeb3React } from '.'
import {
  AllBondsDocument,
  AllBondsQuery,
  SingleBondDocument,
  SingleBondQuery,
} from '../../src/generated/graphql'
import { getLogger } from '../utils/logger'

const logger = getLogger('useBond')

const singleBondQuery = gql`
  query SingleBond($bondId: ID!, $accountId: String!) {
    bond(id: $bondId) {
      id
      name
      maxSupply
      amountUnpaid
      state
      symbol
      type
      owner
      maturityDate
      createdAt
      collateralRatio
      collateralTokenAmount
      convertibleTokenAmount
      decimals
      paymentToken {
        id
        symbol
        name
        decimals
      }
      collateralToken {
        id
        symbol
        name
        decimals
      }
      tokenBalances(where: { account: $accountId }) {
        amount
      }
      auctions {
        end
      }
      convertibleRatio
      clearingPrice
    }
  }
`
const allBondsQuery = gql`
  query AllBonds {
    bonds(first: 100) {
      state
      amountUnpaid
      id
      createdAt
      name
      symbol
      decimals
      type
      owner
      maturityDate
      paymentToken {
        id
        symbol
        name
        decimals
      }
      collateralToken {
        id
        symbol
        name
        decimals
      }
      collateralRatio
      convertibleRatio
      maxSupply
      clearingPrice
      maxSupply
    }
  }
`

export const useBond = (bondId: string) => {
  const { account } = useActiveWeb3React()

  const { data, error, loading } = useQuery<SingleBondQuery>(SingleBondDocument, {
    variables: { bondId: bondId.toLowerCase(), accountId: account?.toLowerCase() || '0x00' },
  })

  if (error) {
    logger.error('Error getting useBond info', error)
  }

  return { data: data?.bond, loading }
}

export const useBonds = () => {
  const allBonds = useQuery<AllBondsQuery>(AllBondsDocument)
  const data = allBonds?.data?.bonds?.filter((bond) => {
    // remove test bonds
    return bond.id.toLowerCase() !== '0x87a075d5C330C8B22faA65C62DCd1C982f43f314'.toLowerCase()
  })
  if (allBonds?.error) {
    logger.error('Error getting useAllBondInfo info', allBonds?.error)
  }
  return { data, loading: allBonds?.loading }
}
