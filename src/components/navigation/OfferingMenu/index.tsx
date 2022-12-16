import React, { ReactElement } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled.nav`
  background-color: ${({ theme }) => theme.modal.overlay.backgroundColor};
  display: block;
  height: calc(100vh - ${({ theme }) => theme.header.height});
  left: 0;
  position: fixed;
  top: ${({ theme }) => theme.header.height};
  width: 100%;
  z-index: 12345;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    display: none;
  }
`

const Inner = styled.div`
  background-color: ${({ theme }) => theme.mainBackground};
  border-top: 1px solid ${({ theme }) => theme.border};
`

const Item = styled(NavLink)`
  align-items: center;
  background-color: ${({ theme }) => theme.mainBackground};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text1};
  display: flex;
  font-size: 17px;
  font-weight: 400;
  height: 44px;
  justify-content: space-between;
  line-height: 1.2;
  padding: 0 14px;
  text-decoration: none;
  transition: all 0.1s linear;

  &.active {
    color: ${({ theme }) => theme.primary1};

    .fill {
      fill: ${({ theme }) => theme.primary1};
    }
  }

  &.active:active,
  &:active {
    color: ${({ theme }) => theme.primary1};
    opacity: 0.5;
  }
`

interface Props {
  onClose: () => void
  legendIcons: ReactElement
}

export const OfferingMenu: React.FC<Props> = (props) => {
  const { legendIcons, onClose, ...restProps } = props

  const onCloseDelay = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    setTimeout(() => {
      onClose()
    }, 100)
  }

  return (
    <Wrapper onClick={onCloseDelay} {...restProps}>
      <Inner>
        <div className="">{legendIcons}</div>
      </Inner>
    </Wrapper>
  )
}
