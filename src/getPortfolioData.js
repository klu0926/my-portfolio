const isLocal = window.location.hostname === 'localhost';
const heroku = 'https://klu-portfolio-server-5858060573f4.herokuapp.com'
const local = 'http://localhost:3000'

const url = isLocal ? local : heroku

// POSTS : /api/posts
// Tags : /api/tags
// In Response object :
// {ok, action, data[Array]}
// Each object In Response.data Array :
// {id, title, group, cover, data, description, order, meta[Array], createAt, tags[Array]
// }

export async function getPosts() {
  try {
    const response = await fetch(url + '/api/posts', {
      method: 'GET',
      headers: {
        'Conent-Type': 'application/json'
      }
    })
    if (!response || !response.ok) throw new Error(response.status)

    const json = await response.json()
    const posts = json.data
    return { err: null, posts }
  } catch (err) {
    return { err, posts: null }
  }
}