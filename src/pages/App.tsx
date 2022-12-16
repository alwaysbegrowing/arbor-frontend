import React, { Suspense } from 'react'
import styled from 'styled-components'

import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { ConfigProvider } from 'antd'
import ReactTooltip from 'react-tooltip'

import ScrollToTop from '../components/ScrollToTop'
import TermsModal from '../components/TermsModal'
import { ErrorBoundaryWithFallback } from '../components/common/ErrorAndReload'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import Routes from '../components/navigation/Routes/Routes'
import { InnerContainer } from '../components/pureStyledComponents/InnerContainer'
import { MainWrapper } from '../components/pureStyledComponents/MainWrapper'

export const InnerApp = styled(InnerContainer)`
  margin-top: -100px;
  margin-bottom: 75px;

  @media (max-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    margin-top: -110px;
  }
`
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],

  tracesSampleRate: 1,
})

const App: React.FC = () => (
  <Suspense fallback={null}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1c701c',
          colorBgBase: 'black',
          colorBgContainer: '#181a1c',
          colorText: '#eeefeb',
          colorIcon: 'white',
        },
      }}
    >
      <MainWrapper>
        <ReactTooltip
          arrowColor={'#2a2b2c'}
          backgroundColor={'#181a1c'}
          border
          borderColor={'#2a2b2c'}
          clickable
          delayHide={500}
          delayShow={50}
          effect="solid"
          id={'wrap_button'}
          textColor="#d6d6d6"
        />
        <ScrollToTop />
        <TermsModal />
        <Header />
        <ErrorBoundaryWithFallback>
          <InnerApp className="fullPage">
            <Routes />
          </InnerApp>
        </ErrorBoundaryWithFallback>
        <Footer />
      </MainWrapper>
    </ConfigProvider>
  </Suspense>
)

export default App
