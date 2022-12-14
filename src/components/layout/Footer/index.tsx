import React from 'react'
import styled from 'styled-components'

import { Inner } from '../Header'

import { ReactComponent as Wordmark } from '@/assets/svg/wordmark.svg'

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
          <FooterLogo className="flex-col items-center justify-items-end">
            <Wordmark style={{ height: 60 }} />
            <FooterLinks>
              <a href="/pdf/Arbor_Terms_and_Conditions_.pdf" target="_blank">
                Terms of Service
              </a>
            </FooterLinks>
          </FooterLogo>
          <FooterLinks className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
            <a href="https://docs.arbor.finance/faq">Faq</a>
            <a href="https://blog.arbor.finance">Blog</a>
            <a href="https://docs.arbor.finance/">Docs</a>
            <a href="https://discord.arbor.finance/">Discord</a>
            <a href="https://twitter.com/arborfinance">Twitter</a>
            <a href="https://github.com/orgs/alwaysbegrowing/">Github</a>
          </FooterLinks>
        </div>
      </Inner>
    </Wrapper>
  )
}
