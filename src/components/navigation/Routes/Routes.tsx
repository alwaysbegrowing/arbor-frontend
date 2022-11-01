import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import SelectOffering from 'src/components/OfferingCreate'
import SetupOffering from 'src/components/OfferingCreate/auction/SetupOffering'
import SelectProduct from 'src/components/ProductCreate'
import SetupProduct from 'src/components/ProductCreate/convert/SetupProduct'
import SetupSimpleProduct from 'src/components/ProductCreate/simple/SetupSimpleProduct'
import { BaseCard } from 'src/components/pureStyledComponents/BaseCard'
import Auction from 'src/pages/Auction'
import BondDetail from 'src/pages/BondDetail'
import Bonds from 'src/pages/Bonds'
import Offerings from 'src/pages/Offerings'
import Portfolio from 'src/pages/Portfolio'

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
