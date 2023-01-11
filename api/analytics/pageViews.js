import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { GoogleAuth } from 'google-auth-library' // no need to install this library, it comes with @google-analytics/data

export default async function handler(request, res) {
  const { name } = request.query
  //auth process
  const analyticsDataClient = new BetaAnalyticsDataClient({
    auth: new GoogleAuth({
      projectId: 'arbor-page-views',
      scopes: 'https://www.googleapis.com/auth/analytics.readonly',
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
    }),
  })

  const propertyId = '339576001'

  // Runs a report on a Google Analytics 4 property.
  try {
    const [response] = await analyticsDataClient.runReport({
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
    })
    const value = []
    response.rows.forEach((row) => {
      console.log(row)
      // console.log(`${row.metricValues[0].value}`)
      value.push(row.metricValues[0].value)
    })
    res.status(200).json(value)
  } catch (e) {
    console.log(e)
  }
}
