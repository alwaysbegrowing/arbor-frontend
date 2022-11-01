import React from 'react'
import styled from 'styled-components'

import ArborIcon from '@/assets/svg/components/Arbor'

const Wrapper = styled.span`
  align-items: center;
  display: flex;
`

export const Logo = (props) => {
  return (
    <Wrapper {...props}>
      <ArborIcon className="w-12" />
    </Wrapper>
  )
}
