// export default async function getPageViews() {
//   console.log('hi')
//   try {
//     const url =
//       'https://www.googleapis.com/analytics/v3/data/ga?ids=ga:xx&dimensions=ga:pagePath&metrics=ga:pageviews&filters=ga:pagePath==/offerings&start-date=2021-10-15&end-date=2023-10-29&max-results=50'

//     const res = await fetch(url)
//     if (!res.ok) {
//       // backend returns {"message":"invalid url query"}
//       // for bad requests
//       throw await res.json()
//     }
//     return await res.json()
//   } catch (error) {
//     // const { auctionId } = params

//     console.log(`Failed to query orderbook data for auction  id ${error.message}`)
//     return null
//   }
// }

export default async function getPageViews() {
  // await fetch(
  //   'https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&include_granted_scopes=true&response_type=token&state=state_parameter_passthrough_value&redirect_uri=http://localhost:3000&client_id=xx,
  //   // {
  //   //   headers: {
  //   //     'Access-Control-Allow-Origin': '*',
  //   //   },
  //   // },
  // )
  /*
   * Create form to request access token from Google's OAuth 2.0 server.
   */
  // function oauthSignIn() {
  //   // Google's OAuth 2.0 endpoint for requesting an access token
  //   const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth'

  //   // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  //   const form = document.createElement('form')
  //   form.setAttribute('method', 'GET') // Send as a GET request.
  //   form.setAttribute('action', oauth2Endpoint)

  //   // Parameters to pass to OAuth 2.0 endpoint.
  //   const params = {
  //     client_id: CLIENT ID,
  //     redirect_uri: 'http://localhost:3000',
  //     response_type: 'token',
  //     scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
  //     include_granted_scopes: 'true',
  //     state: 'pass-through value',
  //   }

  //   // Add form parameters as hidden input values.
  //   for (const p in params) {
  //     const input = document.createElement('input')
  //     input.setAttribute('type', 'hidden')
  //     input.setAttribute('name', p)
  //     input.setAttribute('value', params[p])
  //     form.appendChild(input)
  //   }

  //   // Add form to page and submit it to open the OAuth 2.0 endpoint.
  //   document.body.appendChild(form)
  //   form.submit()

  //   return
  // }
  // oauthSignIn()
  //   .then((res) => {
  //     const token = res.json()
  //     return token
  //   })
  const res = fetch(
    'https://analyticsdata.googleapis.com/v1beta/properties/xx:runReport?prettyPrint=true&key=API KEY',
    {
      method: 'POST',
      body: JSON.stringify({
        resource: {
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
        },
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )
  const data = (await res).json()
  console.log(await data)
  return data
}
