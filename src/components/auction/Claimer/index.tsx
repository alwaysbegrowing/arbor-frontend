import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import { formatUnits } from '@ethersproject/units'

import { useActiveWeb3React } from '../../../hooks'
import { useAuction } from '../../../hooks/useAuction'
import {
  ClaimState,
  useClaimOrderCallback,
  useGetAuctionProceeds,
} from '../../../hooks/useClaimOrderCallback'
import { useParticipatingAuctionBids } from '../../../hooks/useParticipatingAuctionBids'
import { LoadingBox } from '../../../pages/Auction'
import { useWalletModalToggle } from '../../../state/application/hooks'
import { DerivedAuctionInfo, useDerivedClaimInfo } from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { TokenInfo, TokenPill } from '../../bond/BondAction'
import { FieldRowLabelStyled } from '../../form/PriceInputPanel'
import ConfirmationDialog from '../../modals/ConfirmationDialog'
import { BaseCard } from '../../pureStyledComponents/BaseCard'

import Tooltip from '@/components/common/Tooltip'
import WarningModal from '@/components/modals/WarningModal'
import { requiredChain } from '@/connectors'
import { getChainName } from '@/utils/tools'

const Wrapper = styled(BaseCard)`
  max-width: 100%;
  min-width: 100%;
  padding: 0;
`

export const ActionButton = ({ children, color = 'blue', ...props }) => (
  <button
    {...props}
    className={`btn btn-block btn-sm w-full normal-case hover:bg-blue-500 ${
      props.disabled ? '!bg-[#2C2C2C] !text-[#696969]' : 'bg-[#0F5156] text-white'
    } h-[41px] font-normal ${color !== 'blue' && 'bg-[#236245] hover:bg-[#617ec7]'} ${
      props.className
    }`}
  >
    {children}
  </button>
)

export const GhostActionLink = ({ children, ...props }) => (
  <a
    {...props}
    className={`btn btn-link btn-block btn-sm w-full normal-case hover:bg-white hover:fill-black hover:text-black ${
      props.disabled ? '!bg-[#2C2C2C] !text-[#696969]' : 'bg-transparent text-white'
    } bordered h-[41px] border-[#2C2C2C] font-normal ${props.className}`}
  >
    {children}
  </a>
)

const TokenItem = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

interface Props {
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
}

const ClaimDisabled = () => {
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  return (
    <div className="card-bordered card">
      <div className="card-body">
        <h2 className="card-title">Claim proceeds</h2>
        <div className="space-y-6">
          <div className="text-sm text-[#696969]">
            {!account
              ? 'Only investors that participated can claim auction proceeds.'
              : 'There are no funds to claim as you did not participate in the auction.'}
          </div>

          {!account && <ActionButton onClick={toggleWalletModal}>Connect wallet</ActionButton>}
        </div>
      </div>
    </div>
  )
}

const Claimer: React.FC<Props> = (props) => {
  const { auctionIdentifier, derivedAuctionInfo } = props
  const { data: graphInfo } = useAuction(auctionIdentifier?.auctionId)
  const { chainId } = auctionIdentifier
  const { account, chainId: Web3ChainId } = useActiveWeb3React()
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const participatingBids = useParticipatingAuctionBids()
  const [showWarningWrongChainId, setShowWarningWrongChainId] = useState<boolean>(false)

  const [claimStatus, claimOrderCallback] = useClaimOrderCallback(auctionIdentifier)
  const { error, isLoading: isDerivedClaimInfoLoading } = useDerivedClaimInfo(
    auctionIdentifier,
    claimStatus,
  )
  const isValid = !error
  const toggleWalletModal = useWalletModalToggle()

  const { claimableBidFunds, claimableBonds } = useGetAuctionProceeds(
    auctionIdentifier,
    derivedAuctionInfo,
  )

  const { auctioningToken, biddingToken } = derivedAuctionInfo

  const isLoading = useMemo(
    () => (account && isDerivedClaimInfoLoading) || !claimableBidFunds || !claimableBonds,
    [account, isDerivedClaimInfoLoading, claimableBidFunds, claimableBonds],
  )

  const isClaimButtonDisabled = useMemo(
    () => !isValid || showConfirm || isLoading || claimStatus != ClaimState.NOT_CLAIMED,
    [isValid, showConfirm, isLoading, claimStatus],
  )

  const claimStatusString =
    claimStatus === ClaimState.PENDING ? `Claiming` : !isValid && account ? error : ''

  if ((!participatingBids && account) || claimStatus === ClaimState.NOT_APPLICABLE) {
    return <ClaimDisabled />
  }

  if (isLoading) {
    return <LoadingBox height={342} />
  }

  const bondToken = {
    ...auctioningToken,
    symbol: graphInfo?.bond?.name || auctioningToken?.name || auctioningToken?.symbol,
  }

  return (
    <div className="place-order-color card-bordered card">
      <div className="card-body">
        <h2 className="card-title border-b border-b-[#333333] pb-4">Claim auction proceeds</h2>

        <Wrapper>
          <div className="mb-7 space-y-3">
            {(graphInfo?.bondsSold > 0 || claimableBonds.greaterThan('0')) && (
              <>
                <TokenItem>
                  <div className="text-base text-white">
                    {claimStatus !== ClaimState.CLAIMED && claimableBonds
                      ? `${Number(
                          formatUnits(claimableBonds.raw.toString(), claimableBonds.token.decimals),
                        ).toLocaleString()}`
                      : `-`}
                  </div>
                  <TokenPill token={bondToken} />
                </TokenItem>
                <FieldRowLabelStyled>
                  <Tooltip
                    left="Amount of bond funds to claim"
                    tip="Amount of assets you can claim. If there are no bonds claimable, your order price was not competitive."
                  />
                </FieldRowLabelStyled>
              </>
            )}

            <TokenItem>
              <div className="text-base text-white">
                {claimStatus !== ClaimState.CLAIMED && claimableBidFunds
                  ? `${Number(
                      formatUnits(
                        claimableBidFunds.raw.toString(),
                        claimableBidFunds.token.decimals,
                      ),
                    ).toLocaleString()}`
                  : `-`}
              </div>
              <TokenPill token={biddingToken} />
            </TokenItem>

            <FieldRowLabelStyled>
              <Tooltip
                left="Amount of order funds to claim"
                tip="Amount of assets you can claim. If there are no bonds claimable, your order price was not competitive."
              />
            </FieldRowLabelStyled>
          </div>
          {!account ? (
            <ActionButton onClick={toggleWalletModal}>Connect wallet</ActionButton>
          ) : (
            <ActionButton
              disabled={isClaimButtonDisabled}
              onClick={() => {
                if (Web3ChainId !== requiredChain.id) {
                  setShowWarningWrongChainId(true)
                } else {
                  setShowConfirm(true)
                }
              }}
            >
              Review claim
            </ActionButton>
          )}

          {claimStatusString && (
            <div className="mt-4 text-xs text-[#9F9F9F]">{claimStatusString}</div>
          )}
          <ConfirmationDialog
            actionText="Claim auction proceeds"
            beforeDisplay={
              <div className="mt-10 space-y-6">
                <div className="space-y-2 border-b border-b-[#D5D5D519] pb-4 text-xs text-[#696969]">
                  <TokenInfo
                    token={bondToken}
                    value={Number(
                      formatUnits(claimableBonds.raw.toString(), claimableBonds.token.decimals),
                    ).toLocaleString()}
                  />
                  <div className="text-xs text-[#696969]">
                    <Tooltip
                      left="Amount of bonds to claim"
                      tip="The number of bonds you successfully purchased."
                    />
                  </div>
                </div>
                <div className="space-y-2 border-b border-b-[#D5D5D519] pb-4 text-xs text-[#696969]">
                  <TokenInfo
                    token={biddingToken}
                    value={Number(
                      formatUnits(
                        claimableBidFunds.raw.toString(),
                        claimableBidFunds.token.decimals,
                      ),
                    ).toLocaleString()}
                  />
                  <div className="text-xs text-[#696969]">
                    <Tooltip
                      left="Amount of order funds to claim"
                      tip="If there are order funds to claim, some or all of your orders were not competitive and did not get filled."
                    />
                  </div>
                </div>
              </div>
            }
            finishedText="Auction proceeds claimed"
            loadingText="Claiming auction proceeds"
            onOpenChange={setShowConfirm}
            open={showConfirm}
            pendingText="Confirm claiming in wallet"
            placeOrder={claimOrderCallback}
            title="Review claim"
          />
          <WarningModal
            content={`In order to place this claim, please connect to the ${getChainName(
              requiredChain.id,
            )} network`}
            isOpen={showWarningWrongChainId}
            onDismiss={() => {
              setShowWarningWrongChainId(false)
            }}
          />
        </Wrapper>
      </div>
    </div>
  )
}

export default Claimer
