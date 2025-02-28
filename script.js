import { getPosts } from "./src/getPortfolioData.js"

class Data {
  constructor() {
  }
  async getPostsAsync() {
    try {
      const { err, posts } = await getPosts()
      if (err) throw new Error(err)
      return posts
    } catch (err) {
      console.error(err)
    }
  }
}


class View {
  constructor() {
    this.projectContainer = document.querySelector('.projects-container')
  }
  renderProjects(projectsArray, filterGroup = '') {
    if (!projectsArray) {
      console.error('Fail to render project, no data')
      return
    }
    let filteredProjects = []

    // clear container
    this.projectContainer.innerHTML = ''

    // filter
    if (filterGroup !== '') {
      filteredProjects = projectsArray.filter(project => project.group === filterGroup)
    } else {
      filteredProjects = projectsArray
    }

    // Render project cards
    filteredProjects.forEach(project => {
      // shorten description
      const description = project.description.slice(0, 100) + '...'

      // create porject card
      const projectCard = `
       <div class="project-card">
            <img
              class="project-image"
              src="${project.cover}"
              alt="project image"
            />
            <p class="project-name">${project.title}</p>
            <p class="project-info">${description}</p>
          </div>
      `
      // add to container
      this.projectContainer.innerHTML += projectCard
    })
  }
}

class Controller {
  constructor(data, view) {
    this.data = data
    this.view = view
  }
  async init() {
    // render posts
    const posts = await this.data.getPostsAsync()
    this.view.renderProjects(posts, 'web')
    console.log(posts)
  }
}


// Run 
const data = new Data()
const view = new View()
const controller = new Controller(data, view)

document.addEventListener('DOMContentLoaded', () => {

  controller.init()
})