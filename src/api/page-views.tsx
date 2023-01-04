// import { google } from 'googleapis'

export default async function getPageViews() {
  console.log('hi')
  try {
    const url =
      'https://www.googleapis.com/analytics/v3/data/ga?ids=ga:4393728121&dimensions=ga:pagePath&metrics=ga:pageviews&filters=ga:pagePath==/offerings&start-date=2021-10-15&end-date=2023-10-29&max-results=50'

    const res = await fetch(url)
    if (!res.ok) {
      // backend returns {"message":"invalid url query"}
      // for bad requests
      throw await res.json()
    }
    return await res.json()
  } catch (error) {
    // const { auctionId } = params

    console.log(`Failed to query orderbook data for auction  id ${error.message}`)
    return null
  }
}

// export default async function handler(request, response) {
//   const res = await fetch(
//     'https://www.googleapis.com/analytics/v3/data/ga?ids=ga:4393728121&dimensions=ga:pagePath&metrics=ga:pageviews&filters=ga:pagePath==/offerings&start-date=2021-10-15&end-date=2023-10-29&max-results=50',
//     {
//       method: 'POST',
//       body: JSON.stringify({
//         // client_id: process.env.CLIENT_ID,
//         // client_secret: process.env.CLIENT_SECRET,
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     },
//   )

//   const data = await res.json()
//   return response.status(200).json({ data })
// }

// const pageViewsAPI = async (req, res) => {
//   const startDate = req.query.startDate || '2022-12-01'
//   const post = req.query.post

//   console.log('hi1')

// try {
//   const auth = new google.auth.GoogleAuth({
//     credentials: {
//       client_email: process.env.GOOGLE_CLIENT_EMAIL,
//       client_id: process.env.GOOGLE_CLIENT_ID,
//       private_key: process.env.GOOGLE_PRIVATE_KEY,
//     },
//     scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
//   })

//   console.log('hi')

//   // https://www.googleapis.com/analytics/v3/data/ga?ids=ga:4393728121&dimensions=ga:pagePath&metrics=ga:pageviews&filters=ga:pagePath==/offerings&start-date=2021-10-15&end-date=2023-10-29&max-results=50

//   const analytics = google.analytics({
//     auth,
//     version: 'v3',
//   })

//   const response = await analytics.data.ga.get({
//     ids: `ga:4393728121`,
//     metrics: 'ga:pageviews',
//     dimensions: 'ga:pagePath',
//     ...(post ? { filters: `ga:pagePath==${post}` } : {}),
//     'start-date': startDate,
//     'end-date': 'today',
//   })

//   const pageViews = response?.data?.totalsForAllResults['ga:pageviews']

//   console.log({ pageViews })

//   return res.status(200).json({
//     pageViews,
//   })
// } catch (err) {
//   return res.status(500).json({ error: err.message })
// }
// }
