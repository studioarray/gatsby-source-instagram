/* eslint-disable camelcase */
const axios = require(`axios`)

export async function apiInstagramPosts({
  access_token,
  instagram_id,
  paginate = `100`,
  maxPosts,
}) {

  return axios
    .get(
      `https://graph.facebook.com/v7.0/${instagram_id}/media?fields=media_url,thumbnail_url,caption,media_type,like_count,shortcode,timestamp,comments_count,username,children{media_url},permalink&limit=${paginate}&access_token=${access_token}`
    )
    .then(async (response) => {
      const results = []
      results.push(...response.data.data)

      /**
       * If maxPosts option specified, then check if there is a next field in the response data and the results' length <= maxPosts
       * otherwise, fetch as more as it can.
       */
      while (
        maxPosts
          ? response.data.paging.next && results.length <= maxPosts
          : response.data.paging.next
      ) {
        response = await axios(response.data.paging.next)
        results.push(...response.data.data)
      }

      return maxPosts ? results.slice(0, maxPosts) : results
    })
    .catch(async (err) => {
      console.warn(
        `\nCould not get instagram posts using the Graph API. Error status ${err}`
      )

      return null
    })
}
