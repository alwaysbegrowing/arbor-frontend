import { useFormContext } from 'react-hook-form'
import { useToken } from 'wagmi'

export const useStrikePrice = () => {
  const { watch } = useFormContext()

  const [amountOfBonds, amountOfConvertible, borrowToken, collateralToken] = watch([
    'amountOfBonds',
    'amountOfConvertible',
    'borrowToken',
    'collateralToken',
  ])
  const { data: collateralTokenData } = useToken({ address: collateralToken?.address })
  const { data: borrowTokenData } = useToken({ address: borrowToken?.address })

  // Strike price: Price at which the value of the convertible tokens equals the amount owed at maturity
  // Strike Price (USDC/Collateral) = Bonds (USDC) / amountOfConvertible (Collateral)
  const value = amountOfBonds / amountOfConvertible

  const display = `${(value || 0).toLocaleString()} ${borrowTokenData?.symbol}/${
    collateralTokenData?.symbol
  }`
  return { data: { value, display } }
}
