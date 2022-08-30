import React from 'react'

import { ArborIcon } from './icons/ArborIcon'

import { Bond } from '@/generated/graphql'

export const BondTokenDetails = ({ option }: { option: Bond }) => {
  const balance = Number(option?.tokenBalances?.[0].amount)
  if (balance == 0) return null
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
