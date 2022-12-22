import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { formatUnits, parseUnits } from '@ethersproject/units'
import { Token, TokenAmount } from '@josojo/honeyswap-sdk'
import dayjs from 'dayjs'

import { useActiveWeb3React } from '../../../hooks'
import { useBond } from '../../../hooks/useBond'
import { useConvertBond } from '../../../hooks/useConvertBond'
import { usePreviewBond } from '../../../hooks/usePreviewBond'
import { useRedeemBond } from '../../../hooks/useRedeemBond'
import { BondActions, getBondStates } from '../../../pages/BondDetail'
import { useActivePopups, useWalletModalToggle } from '../../../state/application/hooks'
import { getExplorerLink, getTokenDisplay } from '../../../utils'
import { ActiveStatusPill } from '../../auction/OrderbookTable'
import AmountInputPanel from '../../form/AmountInputPanel'
import ConfirmationDialog from '../../modals/ConfirmationDialog'
import { ReviewConvert } from '../../modals/ReviewConvert'
import { FieldRowTokenSymbol } from '../../pureStyledComponents/FieldRow'
import TokenLogo from '../../token/TokenLogo'

import { ActionButton } from '@/components/auction/Claimer'
import Tooltip from '@/components/common/Tooltip'
import WarningModal from '@/components/modals/WarningModal'
import { requiredChain } from '@/connectors'
import { useUSDPerBond } from '@/hooks/useBondExtraDetails'
import { getChainName } from '@/utils/tools'

export const TokenPill = ({ token }) => {
  const noPropagation = (e) => e.stopPropagation()

  let displayName = ''
  if (token) {
    displayName = getTokenDisplay(token)
  }

  return token ? (
    <a
      className="flex cursor-pointer flex-row items-center space-x-2 rounded-full bg-[#2C2C2C] p-1 px-2"
      href={getExplorerLink(token.address || token.id, 'address')}
      onClick={noPropagation}
      rel="noreferrer"
      target="_blank"
    >
      {(token.address || token.id) && (
        <TokenLogo
          size={'16px'}
          token={{
            address: token.address || token.id,
            symbol: token.symbol,
          }}
        />
      )}
      {displayName && <FieldRowTokenSymbol>{token.symbol}</FieldRowTokenSymbol>}
    </a>
  ) : null
}

export const TokenInfo = ({ disabled = false, extra = '', plus = false, token, value }) => {
  return (
    <div
      className={`text-base text-white ${
        disabled ? 'text-[#696969]' : 'text-white'
      } flex justify-between`}
    >
      <div className="space-x-2">
        <span>{value || '-'}</span>
        <span className="text-[#696969]">{extra}</span>
      </div>
      <TokenPill token={token} />
    </div>
  )
}

const getActionText = (componentType) => {
  if (componentType === BondActions.Redeem) return 'Redeem'
  if (componentType === BondActions.Convert) return 'Convert'
  return 'Unknown'
}

const BondAction = ({
  componentType,
  overwriteBondId,
}: {
  componentType: BondActions
  overwriteBondId?: string
}) => {
  const { account, chainId: Web3ChainId } = useActiveWeb3React()
  const activePopups = useActivePopups()
  const params = useParams()
  const [showWarningWrongChainId, setShowWarningWrongChainId] = useState<boolean>(false)

  const bondId = overwriteBondId || params?.bondId
  const { data: bond } = useBond(bondId)
  const { convertibleValue } = useUSDPerBond(bond || undefined)
  const bondTokenBalance = bond?.tokenBalances?.[0]?.amount || 0

  const [bondsToRedeem, setBondsToRedeem] = useState(null)
  const [openReviewModal, setOpenReviewModal] = useState<boolean>(false)
  const [previewRedeemVal, setPreviewRedeemVal] = useState<string[]>(['0', '0'])
  const [previewConvertVal, setPreviewConvertVal] = useState<string>('0')
  const isConvertComponent = componentType === BondActions.Convert

  const [tokenDetails, setTokenDetails] = useState({ BondAmount: null, payTok: null, tok: null })

  const { isActive, isDefaulted, isMatured, isPaid, isPartiallyPaid } = getBondStates(bond)

  useEffect(() => {
    let BondAmount = null
    let tok = null
    let payTok = null

    if (bond) {
      const bondsToRedeemBigNumber =
        (Number(bondsToRedeem) && parseUnits(bondsToRedeem, bond.decimals)) || 0
      tok = new Token(requiredChain.id, bond.id, bond.decimals, bond.symbol, bond.name)
      payTok = new Token(
        requiredChain.id,
        bond?.paymentToken?.id,
        bond?.paymentToken?.decimals,
        bond?.paymentToken?.symbol,
        bond?.paymentToken?.name,
      )
      BondAmount = new TokenAmount(tok, bondsToRedeemBigNumber.toString())
      setTokenDetails({ BondAmount, tok, payTok })
    }
  }, [bondsToRedeem, bond])

  // these names r so bad
  const { BondAmount, tok } = tokenDetails

  const { redeem } = useRedeemBond(BondAmount, bondId)
  const { convert } = useConvertBond(BondAmount, bondId)
  const { previewConvert, previewRedeem } = usePreviewBond(bondId)
  const toggleWalletModal = useWalletModalToggle()

  useEffect(() => {
    if (!BondAmount) return

    if (componentType === BondActions.Redeem) {
      previewRedeem(BondAmount).then((r) => {
        const [paymentTokens, collateralTokens] = r
        // returned in paymentTokens, collateralTokens
        setPreviewRedeemVal([
          formatUnits(paymentTokens, bond?.paymentToken.decimals),
          formatUnits(collateralTokens, bond?.collateralToken?.decimals),
        ])
      })
    }

    if (isConvertComponent) {
      previewConvert(BondAmount).then((r) => {
        setPreviewConvertVal(formatUnits(r, bond?.collateralToken?.decimals))
      })
    }
  }, [
    isConvertComponent,
    componentType,
    bondsToRedeem,
    bond?.paymentToken.decimals,
    bond?.collateralToken?.decimals,
    previewRedeem,
    previewConvert,
    BondAmount,
  ])

  useEffect(() => {
    if (activePopups.length) {
      setBondsToRedeem('')
    }
  }, [activePopups])

  const isConvertable = useMemo(() => {
    if (componentType !== BondActions.Convert) return false

    if (isMatured) {
      return { error: 'Bond is matured' }
    }

    if (!account) return { error: 'Not logged in' }

    const validInput = Number(bondsToRedeem) && parseUnits(bondsToRedeem, bond?.decimals).gt(0)
    if (!validInput) return { error: 'Input must be > 0' }

    const notEnoughBalance =
      Number(bondsToRedeem) &&
      parseUnits(bondsToRedeem, bond?.decimals).gt(parseUnits(bondTokenBalance, bond?.decimals))
    if (notEnoughBalance) return { error: 'Bonds to convert exceeds balance' }

    return true
  }, [componentType, account, bondTokenBalance, bond?.decimals, bondsToRedeem, isMatured])

  const isRedeemable = useMemo(() => {
    if (componentType !== BondActions.Redeem) return false
    if (!account) return { error: 'Not logged in' }
    if (!isPaid && !isMatured && !isDefaulted) {
      return { error: 'Must be fully paid, matured, or defaulted' }
    }

    const validInput = Number(bondsToRedeem) && parseUnits(bondsToRedeem, bond?.decimals).gt(0)
    if (!validInput) return { error: 'Input must be > 0' }

    const notEnoughBalance =
      Number(bondsToRedeem) &&
      parseUnits(bondsToRedeem, bond?.decimals).gt(parseUnits(bondTokenBalance, bond?.decimals))
    if (notEnoughBalance) return { error: 'Bonds to redeem exceeds balance' }

    return true
  }, [
    componentType,
    account,
    bondTokenBalance,
    bond?.decimals,
    bondsToRedeem,
    isMatured,
    isPaid,
    isDefaulted,
  ])

  const isActionDisabled = useMemo(() => {
    if (isConvertComponent) {
      return isConvertable !== true
    }
    if (componentType === BondActions.Redeem) {
      return isRedeemable !== true
    }
  }, [isConvertComponent, componentType, isConvertable, isRedeemable])

  const BondStatus = () => {
    if (componentType !== BondActions.Redeem) return null

    if (isDefaulted) {
      return (
        <ActiveStatusPill className="!bg-[#DB3635] !text-white" dot={false} title="Defaulted" />
      )
    }
    if (isPaid) {
      return <ActiveStatusPill dot={false} title="Repaid" />
    }

    if (!isPaid && isPartiallyPaid && isMatured) {
      return <ActiveStatusPill className="!bg-[#EDA651]" dot={false} title="Partially repaid" />
    }

    return null
  }

  const assetsToReceive = []
  const collateralToken = bond?.collateralToken

  if (isActive) {
    const collateralTokensAmount = previewConvertVal
    assetsToReceive.push({
      extra: ``,
      token: collateralToken,
      value: Number(collateralTokensAmount).toLocaleString(undefined, {
        maximumFractionDigits: 5,
      }),
    })
  } else if (isPaid) {
    const [paymentTokensAmount] = previewRedeemVal
    const value = isConvertComponent ? previewConvertVal : paymentTokensAmount

    assetsToReceive.push({
      token: isConvertComponent ? collateralToken : bond?.paymentToken,
      value: Number(value).toLocaleString(undefined, {
        maximumFractionDigits: 5,
      }),
    })
  } else if (isDefaulted) {
    const [, collateralTokensAmount] = previewRedeemVal

    assetsToReceive.push({
      token: collateralToken,
      value: Number(collateralTokensAmount).toLocaleString(undefined, {
        maximumFractionDigits: 5,
      }),
      extra: `($${(convertibleValue * Number(collateralTokensAmount)).toLocaleString()})`,
    })
  } else if (isPartiallyPaid) {
    const [paymentTokensAmount, collateralTokensAmount] = previewRedeemVal

    if (!isConvertComponent) {
      assetsToReceive.push({
        token: bond?.paymentToken,
        value: Number(paymentTokensAmount).toLocaleString(undefined, {
          maximumFractionDigits: 5,
        }),
        extra: `($${(convertibleValue * Number(paymentTokensAmount)).toLocaleString()})`,
      })
    }

    assetsToReceive.push({
      token: collateralToken,
      value: Number(collateralTokensAmount).toLocaleString(undefined, {
        maximumFractionDigits: 5,
      }),
      extra: `($${(convertibleValue * Number(collateralTokensAmount)).toLocaleString()})`,
    })
  }

  return (
    <div className="redeem-card-color card">
      <div className="card-body">
        <div className="flex flex-row items-start justify-between">
          <h2 className="card-title">{getActionText(componentType)}</h2>
          <BondStatus />
        </div>
        {isConvertComponent && !isMatured && bond && (
          <div className="mb-1 space-y-1">
            <div className="text-sm text-[#EEEFEB]">
              {dayjs(bond.maturityDate * 1000)
                .utc()
                .tz()
                .format('LL HH:mm z')}
            </div>
            <div className="text-xs text-[#696969]">
              <Tooltip
                left="Active until"
                tip="Date each bond is no longer convertible into the convertible tokens and will only be redeemable for its face value (assuming no default)."
              />
            </div>
          </div>
        )}
        <div>
          <div className="space-y-6">
            {account && !Number(bondTokenBalance) ? (
              <div className="flex justify-center rounded-lg border border-[#2C2C2C] p-12 text-sm text-[#696969]">
                <span>No bonds to {getActionText(componentType).toLowerCase()}</span>
              </div>
            ) : (
              <AmountInputPanel
                amountText={`Amount of bonds to ${getActionText(componentType).toLowerCase()}`}
                amountTooltip={
                  isConvertComponent
                    ? 'Amount of bonds you are exchanging for convertible tokens.'
                    : 'Amount of bonds you are redeeming.'
                }
                disabled={!account}
                maxTitle={`${getActionText(componentType)} all`}
                onMax={() => {
                  setBondsToRedeem(formatUnits(bondTokenBalance, bond?.decimals))
                }}
                onUserSellAmountInput={setBondsToRedeem}
                token={{
                  ...tok,
                  symbol: tok?.name || tok?.symbol,
                }}
                value={bondsToRedeem}
              />
            )}
            <div className="space-y-6 text-xs text-[#696969]">
              <div className="space-y-2">
                {assetsToReceive.map(({ extra, token, value }, index) => (
                  <TokenInfo
                    disabled={!account}
                    extra={extra}
                    key={index}
                    token={token}
                    value={value === '0' || !value ? '-' : value}
                  />
                ))}

                <div className="text-xs text-[#696969]">
                  <Tooltip
                    left="Amount of assets to receive"
                    tip={
                      isConvertComponent
                        ? 'Amount of convertible tokens you will receive in exchange for your bonds.'
                        : 'Amount of assets you are receiving for your bonds.'
                    }
                  />
                </div>
              </div>

              {!account ? (
                <>
                  <ActionButton color="purple" onClick={toggleWalletModal}>
                    Connect wallet
                  </ActionButton>
                  <div className="mt-4 text-xs text-[#9F9F9F]">Wallet not connected</div>
                </>
              ) : (
                <ActionButton
                  color="purple"
                  disabled={isActionDisabled}
                  onClick={() => {
                    if (Web3ChainId !== requiredChain.id) {
                      setShowWarningWrongChainId(true)
                    } else {
                      setOpenReviewModal(true)
                    }
                  }}
                >
                  Review {isConvertComponent ? 'conversion' : 'redemption'}
                </ActionButton>
              )}
              {account && (
                <div className="flex justify-between">
                  <span>Balance</span>
                  <span>
                    {`${Number(formatUnits(bondTokenBalance, bond?.decimals)).toLocaleString()} ${
                      bond?.name
                    }`}
                  </span>
                </div>
              )}
            </div>
          </div>
          <WarningModal
            content={`In order to place this ${
              isConvertComponent ? 'conversion' : 'redemption'
            }, please connect to the ${getChainName(requiredChain.id)} network`}
            isOpen={showWarningWrongChainId}
            onDismiss={() => {
              setShowWarningWrongChainId(false)
            }}
          />
          <ConfirmationDialog
            actionColor="purple"
            actionText={`${getActionText(componentType)} bonds`}
            beforeDisplay={
              <ReviewConvert
                amount={Number(bondsToRedeem).toLocaleString()}
                amountToken={tok}
                assetsToReceive={assetsToReceive}
                type={getActionText(componentType).toLowerCase()}
              />
            }
            finishedText={`Bonds ${getActionText(componentType)}ed`}
            loadingText={`${getActionText(componentType)}ing bonds`}
            onOpenChange={setOpenReviewModal}
            open={openReviewModal}
            pendingText={`Confirm ${isConvertComponent ? 'conversion' : 'redemption'} in wallet`}
            placeOrder={isConvertComponent ? convert : redeem}
            title={`Review ${isConvertComponent ? 'conversion' : 'redemption'}`}
          />
        </div>
      </div>
    </div>
  )
}

export default BondAction
