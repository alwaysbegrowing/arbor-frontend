import React from 'react'

import { CreatePanel } from './CreatePanel'
import ConvertCreateIcon from './icons/ConvertCreateIcon'
import SimpleCreateIcon from './icons/SimpleCreateIcon'

const SelectProduct = () => {
  return (
    <CreatePanel
      panels={[
        {
          icon: <ConvertCreateIcon />,
          url: '/bonds/create/convertible',
          learn: 'https://docs.arbor.garden/portal/protocol/bonds/convert',
          title: 'Convertible Bond',
          description:
            'Convertible bonds allow DAOs and other on-chain entities to borrow stablecoins using tokens they have in their treasury as collateral. Any time before the maturity date, lenders can convert their bonds into a set amount of collateral tokens.',
        },
        {
          icon: <SimpleCreateIcon />,
          url: '/bonds/create/simple',
          learn: 'https://docs.arbor.garden/portal/protocol/bonds/simple',
          title: 'Simple Bond',
          description:
            'Simple bonds allow DAOs and other on-chain entities to borrow stablecoins using tokens they have in their treasury as collateral. Simple bonds give lenders a sustainable, fixed yield. Simple bonds are zero coupon bonds, which are sold at a discount to the face value and do not pay coupons.',
        },
      ]}
    />
  )
}

export default SelectProduct
