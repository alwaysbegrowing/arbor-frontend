import React, { useMemo } from 'react'

import { chainId, useAccount } from 'wagmi'

import { BondTokenDetails } from '../BondTokenDetails'
import { BorrowTokens, CollateralTokens } from '../SelectableTokens'
import { TokenDetails } from '../TokenDetails'
import { ArborIcon } from '../icons/ArborIcon'
import { Selector } from './BorrowTokenSelector'

import { isProd, requiredChain } from '@/connectors'
import { useBondsPortfolio } from '@/hooks/useBondsPortfolio'
import { useTokenAllowList } from '@/hooks/useTokenPermissions'
import { useTokenListState } from '@/state/tokenList/hooks'
import { getLogger } from '@/utils/logger'

const logger = getLogger('useTokenAllowList')

const CollateralTokenSelector = () => {
  const { data: allowedTokens, error } = useTokenAllowList()

  if (error) {
    logger.error('Error getting useTokenAllowList info', error)
  }
  const { tokens: tokenList } = useTokenListState()

  // The options available for the collateral token selector are all of the
  // options from theBondFactory's allowed token list. The hard-coded payment
  // tokens are removed from this list.
  const tokens = useMemo(() => {
    if (isProd) {
      return allowedTokens
        ?.filter(
          (address) =>
            !BorrowTokens[requiredChain.id].find(
              (borrow) => borrow.address.toLowerCase() === address.toLowerCase(),
            ),
        )
        .map((address) => ({
          iconUrl: tokenList[address.toLowerCase()],
          address,
        }))
    } else {
      return CollateralTokens[chainId.rinkeby]
    }
  }, [allowedTokens, tokenList])

  return <Selector OptionEl={TokenDetails} name="collateralToken" options={tokens} />
}

const NoBondFound = () => {
  const { address } = useAccount()
  return (
    <div className="form-control w-full space-y-4 rounded-md p-4 text-xs text-white">
      <div className="flex w-full justify-between">
        <ArborIcon />
        <div className="flex flex-col">
          <span>No Bonds available to auction.</span> {!address && 'Connect wallet'}
        </div>
      </div>
    </div>
  )
}

export const BondSelector = () => {
  const { data, loading } = useBondsPortfolio()
  if (!data?.length && !loading) {
    return <Selector OptionEl={NoBondFound} disabled name="bondToAuction" options={data} />
  }
  return <Selector OptionEl={BondTokenDetails} name="bondToAuction" options={data} />
}

export default CollateralTokenSelector
