import React from 'react'

import { formatUnits } from '@ethersproject/units'

import { ArborIcon } from './icons/ArborIcon'

import { Bond } from '@/generated/graphql'

export const BondTokenDetails = ({ option }: { option: Bond }) => {
  const balance = Number(formatUnits(option?.tokenBalances?.[0].amount || '0', option?.decimals))
  // This is not a good way to remove 0 balance bonds
  // if (balance == 0) return null
  // the field value tries to select it and renders nothing
  if (!option) {
    return (
      <div className="form-control w-full space-y-4 rounded-md p-4 text-xs text-white">
        <div className="flex w-full justify-between">
          <span>Pick a token</span>
        </div>
      </div>
    )
  }
  return (
    <div className="form-control w-full space-y-4 rounded-md p-4 text-xs text-white">
      <div className="flex w-full justify-between">
        <span className="flex items-center space-x-2">
          <ArborIcon />
          <span>{option?.symbol}</span>
        </span>
      </div>
      <div className="flex w-full justify-between">
        <span>
          <span className="text-[#696969]">Balance:</span> {balance?.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
