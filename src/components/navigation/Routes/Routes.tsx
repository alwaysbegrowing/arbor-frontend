import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import CreditEnhancers from '@/components/CreditEnhancers'
import PaymentPromise from '@/components/CreditEnhancers/payment/PaymentPromise'
import SelectOffering from '@/components/OfferingCreate'
import SetupOffering from '@/components/OfferingCreate/auction/SetupOffering'
import SelectProduct from '@/components/ProductCreate'
import SetupProduct from '@/components/ProductCreate/convert/SetupProduct'
import SetupSimpleProduct from '@/components/ProductCreate/simple/SetupSimpleProduct'
import { BaseCard } from '@/components/pureStyledComponents/BaseCard'
import Auction from '@/pages/Auction'
import BondDetail from '@/pages/BondDetail'
import Bonds from '@/pages/Bonds'
import Offerings from '@/pages/Offerings'
import Portfolio from '@/pages/Portfolio'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Auction />} path="/offerings/:auctionId" />
      <Route element={<Offerings />} path="/offerings" />
      <Route element={<Bonds />} path="/bonds" />

      <Route element={<SelectProduct />} path="/bonds/create" />
      <Route element={<SetupProduct />} path="/bonds/create/convertible" />
      <Route element={<SetupSimpleProduct />} path="/bonds/create/simple" />

      <Route element={<SelectOffering />} path="/offerings/create" />
      <Route element={<SetupOffering />} path="/offerings/create/auction" />
      <Route element={<SetupOffering />} path="/offerings/create/otc" />

      <Route element={<CreditEnhancers />} path="/credit-enhancers" />
      <Route element={<PaymentPromise />} path="/credit-enhancers/payment" />

      <Route element={<BondDetail />} path="/bonds/:bondId" />
      <Route element={<Portfolio />} path="/portfolio" />
      <Route element={<Navigate replace to="/offerings" />} path="/start" />
      <Route element={<Navigate replace to="/offerings" />} path="/auctions" />
      <Route element={<Navigate replace to="/offerings" />} path="/" />
      <Route element={<BaseCard>Page not found Error 404</BaseCard>} path="*" />
    </Routes>
  )
}

export default AppRoutes
