import React from 'react'
import styled from 'styled-components'

import { useAuction } from '../../../hooks/useAuction'
import { TokenPill } from '../../bond/BondAction'
import {
  FieldRowBottom,
  FieldRowInfo,
  FieldRowInfoProps,
  FieldRowInput,
  FieldRowLabel,
  FieldRowTop,
  FieldRowWrapper,
  InfoType,
} from '../../pureStyledComponents/FieldRow'

import Tooltip from '@/components/common/Tooltip'
import { DerivedAuctionInfo } from '@/state/orderPlacement/hooks'

export const FieldRowLabelStyled = styled(FieldRowLabel)`
  align-items: center;
  display: flex;
  font-weight: 400;
  font-size: 12px;
  color: #696969;
  letter-spacing: 0.06em;
`

interface Props {
  auctionId?: number
  account: string
  disabled?: boolean
  info?: FieldRowInfoProps
  onUserPriceInput: (val: string) => void
  value: string
  derivedAuctionInfo?: DerivedAuctionInfo
}

const PriceInputPanel = (props: Props) => {
  const {
    account,
    auctionId,
    derivedAuctionInfo,
    disabled,
    info,
    onUserPriceInput,
    value,
    ...restProps
  } = props
  const { data: graphInfo } = useAuction(auctionId)
  const error = info?.type === InfoType.error

  const bondPriceNumber = Number(graphInfo.minimumBondPrice)
  const minBondPrice = bondPriceNumber + 0.00001

  return (
    <>
      <FieldRowWrapper
        error={error}
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderTopWidth: 0.5,
        }}
        {...restProps}
      >
        <FieldRowTop>
          <FieldRowInput
            className="overflow-hidden text-ellipsis"
            disabled={!account || disabled === true}
            hasError={error}
            onUserSellAmountInput={onUserPriceInput}
            placeholder="-"
            readOnly={!account}
            value={!account ? '' : value || ''}
          />
          {graphInfo && <TokenPill token={graphInfo.bidding} />}
        </FieldRowTop>

        <FieldRowBottom>
          {info ? (
            <FieldRowLabelStyled className="space-x-1">
              <FieldRowInfo infoType={info?.type}>{info.text}</FieldRowInfo>
            </FieldRowLabelStyled>
          ) : (
            <FieldRowLabelStyled>
              <Tooltip
                left="Price"
                tip="Maximum price per bond you are willing to pay. The actual settlement price may be lower which will result in you getting a higher yield to maturity."
              />
            </FieldRowLabelStyled>
          )}
          <div className="flex justify-between">
            {account && (
              <button
                className="btn-xs btn !border-[#2A2B2C] px-3 text-xs font-normal normal-case !text-[#E0E0E0]"
                onClick={() => onUserPriceInput(`${minBondPrice}`)}
              >
                Min price
              </button>
            )}
          </div>
        </FieldRowBottom>
      </FieldRowWrapper>
    </>
  )
}

export default PriceInputPanel
