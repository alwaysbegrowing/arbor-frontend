import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { GoogleAuth } from 'google-auth-library' // no need to install this library, it comes with @google-analytics/data

export default (request, res) => {
  const { name } = request.query
  const { response } = getPageViews()
  res.status(200).send(`Hello ${response}!`)
}

async function getPageViews() {
  const propertyId = '339576001'
  // Creates a client.
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

  try {
    // console.log(propertyId)

    const x = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      dimensions: [
        {
          name: 'country',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    })
    console.log(x, 'eow')
  } catch (e) {
    console.log(e)
  }
}

// console.log({ analyticsDataClient })

// Runs a realtime report on a Google Analytics 4 property.
// async function runRealtimeReport() {
//   console.log('hi', propertyId, analyticsDataClient)
//   const [response] = await analyticsDataClient.runRealtimeReport({
//     property: `properties/${propertyId}`,
//     dimensions: [
//       {
//         name: 'country',
//       },
//     ],
//     metrics: [
//       {
//         name: 'activeUsers',
//       },
//     ],
//   })
//   console.log(await response)
//   printRunReportResponse(response)
// }

// runRealtimeReport()

//   // Prints results of a runReport call.
//   function printRunReportResponse(response) {
//     //[START analyticsdata_print_run_report_response_header]
//     console.log('hi2')
//     console.log(`${response.rowCount} rows received`)
//     response.dimensionHeaders.forEach((dimensionHeader) => {
//       console.log(`Dimension header name: ${dimensionHeader.name}`)
//     })
//     response.metricHeaders.forEach((metricHeader) => {
//       console.log(`Metric header name: ${metricHeader.name} (${metricHeader.type})`)
//     })
//     //[END analyticsdata_print_run_report_response_header]

//     // [START analyticsdata_print_run_report_response_rows]
//     console.log('Report result:')
//     response.rows.forEach((row) => {
//       console.log(`${row.dimensionValues[0].value}, ${row.metricValues[0].value}`)
//     })
//     // [END analyticsdata_print_run_report_response_rows]
//   }
//   // [END analyticsdata_run_realtime_report]
// }

// process.on('unhandledRejection', (err) => {
//   console.error(err.message)
//   process.exitCode = 1
// })

// property: `properties/${propertyId}`,
// metrics: [
//   {
//     name: 'screenPageViews',
//   },
// ],
// dimensions: [
//   {
//     name: 'pagePath',
//   },
// ],
// dimensionFilter: {
//   filter: {
//     stringFilter: {
//       matchType: 'EXACT',
//       value: '/offerings/399',
//     },
//     fieldName: 'pagePath',
//   },
// },
// })
// printRunReportResponse(response)
// // return response
// }
