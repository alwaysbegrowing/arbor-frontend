import React from 'react'
import styled from 'styled-components'

import { ReactComponent as ArborIcon } from '@/assets/svg/arbor.svg'

const Wrapper = styled.span`
  align-items: center;
  display: flex;
`

export const Logo = (props) => {
  return (
    <Wrapper {...props}>
      <ArborIcon />
    </Wrapper>
  )
}
