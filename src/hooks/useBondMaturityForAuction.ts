import { useParams } from 'react-router-dom'

import { gql, useQuery } from '@apollo/client'
import { MaturityDateForAuctionDocument } from 'src/generated/graphql'
import { RouteAuctionIdentifier, parseURL } from 'src/state/orderPlacement/reducer'
import { getLogger } from 'src/utils/logger'

const logger = getLogger('useBondMaturityForAuction')

const bondsQuery = gql`
  query MaturityDateForAuction($auctionId: ID!) {
    auction(id: $auctionId) {
      end
      bond {
        maturityDate
      }
    }
  }
`

export const useBondMaturityForAuction = (): { maturityDate: number; auctionEndDate: number } => {
  const { auctionId } = parseURL(useParams<RouteAuctionIdentifier>())
  const { data, error } = useQuery(MaturityDateForAuctionDocument, {
    variables: { auctionId: `${auctionId}` },
  })

  if (error) {
    logger.error('Error getting useBondMaturityForAuction info', error)
  }

  return { maturityDate: data?.auction?.bond?.maturityDate, auctionEndDate: data?.auction?.end }
}
