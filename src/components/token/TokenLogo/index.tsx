import React from 'react'
import styled from 'styled-components'

import { UnregisteredToken } from '../UnregisteredToken'

import UnicornSvg from '@/assets/svg/components/SimpleBond'
import { useTokenListState } from '@/state/tokenList/hooks'
import { DEV_bondImage } from '@/state/tokenList/reducer'
import { isAddress } from '@/utils'

const Wrapper = styled.div<{ size: string }>`
  background-color: #e0e0e0;
  border-radius: 100%;
  border-width: ${({ size }) => (parseInt(size, 10) < 20 ? '1px' : '3px')};
  border-style: solid;
  overflow: visible !important;
  border-color: #e0e0e0;
  box-sizing: content-box;
  flex-shrink: 0;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`

const Image = styled.img`
  background: #e0e0e0;
  border-radius: 100%;
  display: block;
  height: 100%;
  width: 100%;
`

interface TokenLogoProps {
  token: { address: string; symbol?: string }
  size?: string
  square?: boolean
}

const SquareHolder = ({ children, size }) => {
  const defaultSize = size === '24px'
  return (
    <div className={`w- placeholder avatar${defaultSize ? '14' : '10'} rounded-full bg-[#e0e0e0]`}>
      {children}
    </div>
  )
}

const TokenLogo: React.FC<TokenLogoProps> = (props) => {
  const { size = '24px', square, token, ...restProps } = props
  const { address } = token
  const { tokens } = useTokenListState()
  const validToken = isAddress(address) && tokens
  const imageURL = validToken && tokens[address.toLowerCase()]
  const sizeToUse = square && size === '24px' ? '30px' : size

  // Example used in dev
  let forceSvg = false
  if (DEV_bondImage.includes(address)) forceSvg = true

  const UnTok = !imageURL && <UnregisteredToken size={sizeToUse} token={token} {...restProps} />
  const ImageToken = (
    <Wrapper className="tokenLogo" size={sizeToUse} {...restProps}>
      {forceSvg && (
        <UnicornSvg height={sizeToUse} style={{ borderRadius: '100%' }} width={sizeToUse} />
      )}
      {!forceSvg && UnTok}
      {imageURL && <Image src={imageURL} />}
    </Wrapper>
  )

  if (square) {
    return <SquareHolder size={size}>{ImageToken}</SquareHolder>
  }

  return ImageToken
}

export default TokenLogo
