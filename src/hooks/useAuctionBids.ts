import { useParams } from 'react-router-dom'

import { gql, useQuery } from '@apollo/client'
import { BidsForSingleAuctionDocument, BidsForSingleAuctionQuery } from 'src/generated/graphql'
import { RouteAuctionIdentifier, parseURL } from 'src/state/orderPlacement/reducer'
import { getLogger } from 'src/utils/logger'

const logger = getLogger('useAuctionBids')

gql`
  query BidsForSingleAuction($auctionId: Int!) {
    bids(
      orderBy: timestamp
      orderDirection: desc
      first: 100
      where: { auction: $auctionId, canceltx: null }
    ) {
      id
      timestamp
      canceltx
      claimtx
      createtx
      payable
      size
      bytes
      auction
    }
  }
`

export const useAuctionBids = () => {
  const { auctionId } = parseURL(useParams<RouteAuctionIdentifier>())

  const { data, error, loading } = useQuery<BidsForSingleAuctionQuery>(
    BidsForSingleAuctionDocument,
    {
      variables: { auctionId: Number(auctionId) },
    },
  )

  if (error) {
    logger.error('Error getting useAuctionBids info', error)
  }

  return { loading, data, error }
}
