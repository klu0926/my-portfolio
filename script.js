import { getPosts } from "./src/getPortfolioData.js"

async function getPostsAsync() {
  try {
    const { err, posts } = await getPosts()
    if (err) throw new Error(err)

    console.log('Posts: ', posts)

  } catch (err) {
    console.error(err)
  }
}

document.addEventListener('DOMContentLoaded', () => {

  getPostsAsync()
})