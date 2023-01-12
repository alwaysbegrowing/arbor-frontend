/* eslint-disable @typescript-eslint/no-var-requires */
const { BetaAnalyticsDataClient } = require('@google-analytics/data')
const { GoogleAuth } = require('google-auth-library')

export default async (request, res) => {
  try {
    const response = await getPageViews()
    res.status(200).json(response)
  } catch (e) {
    res.status(500).json(e.message)
  }
}

const PROPERTY_ID = '339576001'

const createClient = () => {
  return new BetaAnalyticsDataClient({
    auth: new GoogleAuth({
      projectId: 'arbor-page-views',
      scopes: 'https://www.googleapis.com/auth/analytics.readonly',
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
    }),
  })
}

const createReport = async (analyticsDataClient, report) => {
  return await analyticsDataClient.runReport(report)
}

async function getPageViews() {
  const analyticsDataClient = createClient()

  return await createReport(analyticsDataClient, PAGE_VIEWS_BY_PAGE(PROPERTY_ID, '/offerings/399'))
}

const PAGE_VIEWS_BY_PAGE = (propertyId, pagePath) => {
  return {
    property: `properties/${propertyId}`,
    metrics: [
      {
        name: 'screenPageViews',
      },
    ],
    dateRanges: [
      {
        startDate: '2022-11-01',
        endDate: 'today',
      },
    ],
    dimensions: [
      {
        name: 'pagePath',
      },
    ],
    dimensionFilter: {
      filter: {
        stringFilter: {
          matchType: 'EXACT',
          value: '/offerings/399',
        },
        fieldName: 'pagePath',
      },
    },
  }
}
