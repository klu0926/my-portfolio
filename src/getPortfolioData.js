const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
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

// dataName = posts or tags
export async function getData(dataName) {
  try {
    const path = url + `/api/${dataName}`
    console.log('path:', path)
    const response = await fetch(path, {
      method: 'GET',
      headers: {
        'Conent-Type': 'application/json'
      }
    })
    if (!response || !response.ok) throw new Error(response.status)

    const json = await response.json()
    const projects = json.data
    return { err: null, projects }
  } catch (err) {
    return { err, projects: null }
  }
}