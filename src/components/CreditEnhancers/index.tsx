import React from 'react'

import { CreatePanel } from '../ProductCreate/CreatePanel'
import AuctionCreateIcon from './payment/AuctionCreateIcon'

export const CreditEnhancers = () => {
  return (
    <CreatePanel
      panels={[
        {
          icon: <AuctionCreateIcon />,
          url: '/credit-enhancers/payment',
          title: 'Payment Promise',
          learn: 'https://docs.arbor.finance/issuers/credit-enhancers',
          description:
            'Enhance credit by adding a signed promise of intent to pay the bond in full.',
        },
      ]}
    />
  )
}

export default CreditEnhancers
