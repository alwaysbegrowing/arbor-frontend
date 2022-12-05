import React from 'react'
import styled from 'styled-components'

import { ReactComponent as UnicornSvg } from '../../../assets/svg/simple-bond.svg'
import { useTokenListState } from '../../../state/tokenList/hooks'
import { UnregisteredToken } from '../UnregisteredToken'

import { getMappedToken } from '@/components/ProductCreate/SelectableTokens'
import { DEV_bondImage, DEV_tokens } from '@/state/tokenList/reducer'

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
  const { address: tokenAddress } = token
  const { tokens } = useTokenListState()
  const address = getMappedToken(tokenAddress)

  const validToken = address && tokens
  const imageURL = validToken && tokens[address.toLowerCase()]
  const sizeToUse = square && size === '24px' ? '30px' : size

  // Example used in dev

  const lowerTokenAddress = tokenAddress.toLocaleLowerCase()
  let forceSvg = false
  if (DEV_bondImage.includes(tokenAddress)) forceSvg = true

  let chosenImage = false
  if (lowerTokenAddress in DEV_tokens) chosenImage = true

  const UnTok = !imageURL && <UnregisteredToken size={sizeToUse} token={token} {...restProps} />
  const ImageToken = (
    <Wrapper className="tokenLogo" size={sizeToUse} {...restProps}>
      {chosenImage && <Image alt="token image" src={DEV_tokens[lowerTokenAddress]?.image} />}
      {forceSvg && (
        <UnicornSvg height={sizeToUse} style={{ borderRadius: '100%' }} width={sizeToUse} />
      )}
      {!chosenImage && !forceSvg && UnTok}
      {!chosenImage && imageURL && <Image alt="token image" src={imageURL} />}
    </Wrapper>
  )

  if (square) {
    return <SquareHolder size={size}>{ImageToken}</SquareHolder>
  }

  return ImageToken
}

export default TokenLogo
