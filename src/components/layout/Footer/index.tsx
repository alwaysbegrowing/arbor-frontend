import React from 'react'
import styled from 'styled-components'

import Wordmark from 'src/assets/svg/components/Wordmark'

import { Inner } from '../Header'

const FooterLinks = styled.div`
  font-weight: 400;
  font-size: 13px;
  letter-spacing: 0.015em;
  text-transform: uppercase;
  color: #e0e0e0;
`

const FooterLogo = styled.div`
  color: #696969;
`
const Wrapper = styled.footer`
  width: 100%;
  border-top: 1px solid rgba(213, 213, 213, 0.1);
`

export const Footer: React.FC = ({ ...restProps }) => {
  return (
    <Wrapper {...restProps} className="flex py-10">
      <Inner className="fullPage">
        <div className="footer text-neutral-content">
          <FooterLogo className="grid-flow-col items-center">
            <Wordmark style={{ height: 80 }} />
          </FooterLogo>
          <FooterLinks className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
            <a href="https://docs.arbor.garden/faq">Faq</a>
            <a href="https://blog.arbor.garden">Blog</a>
            <a href="https://docs.arbor.garden/">Docs</a>
            <a href="https://discord.gg/Z4saV8m4ec">Discord</a>
            <a href="https://twitter.com/arborfinance">Twitter</a>
            <a href="https://github.com/orgs/alwaysbegrowing/">Github</a>
          </FooterLinks>
        </div>
      </Inner>
    </Wrapper>
  )
}
