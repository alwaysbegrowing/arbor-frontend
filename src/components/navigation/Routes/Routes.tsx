import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import SelectProduct from '@/components/ProductCreate/SelectProduct'
import SetupProduct from '@/components/ProductCreate/SetupProduct'
import { BaseCard } from '@/components/pureStyledComponents/BaseCard'
import Auction from '@/pages/Auction'
import BondDetail from '@/pages/BondDetail'
import CreateBond from '@/pages/CreateBond'
import Offerings from '@/pages/Offerings'
import Portfolio from '@/pages/Portfolio'
import Products from '@/pages/Products'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Auction />} path="/offerings/:auctionId" />
      <Route element={<Offerings />} path="/offerings" />
      <Route element={<Products />} path="/products" />
      <Route element={<CreateBond />} path="/offerings/create" />
      <Route element={<SelectProduct />} path="/products/create" />
      <Route element={<SetupProduct />} path="/products/create/convertible" />
      <Route element={<SetupProduct />} path="/products/create/simple" />
      <Route element={<BondDetail />} path="/products/:bondId" />
      <Route element={<Portfolio />} path="/portfolio" />
      <Route element={<Navigate replace to="/offerings" />} path="/start" />
      <Route element={<Navigate replace to="/offerings" />} path="/auctions" />
      <Route element={<Navigate replace to="/offerings" />} path="/" />
      <Route element={<BaseCard>Page not found Error 404</BaseCard>} path="*" />
    </Routes>
  )
}

export default AppRoutes
