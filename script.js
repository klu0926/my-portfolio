import { getData } from "./src/getPortfolioData.js"

class Data {
  constructor() {
    this.posts
    this.groups
  }
  async getProjectAsync() {
    try {
      const { err, posts } = await getData('posts')
      console.log('posts:', posts)
      if (err) throw new Error(err)
      if (!posts || posts.lenght === 0) throw new Error('No post in posts')

      // get groups, store groups
      const groups = new Set()
      posts.forEach(p => groups.add(p.group))
      this.groups = groups

      // store posts
      this.posts = posts

      return posts
    } catch (err) {
      console.error(err)
    }
  }

}


class View {
  constructor() {
  }
  renderProjects(projectsArray, filterGroup = '') {
    this.projectContainer = document.querySelector('.projects-container')

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
  renderGroupsSelector(groupsArray) {
    const groupsSelector = document.querySelector('.group-select')
    groupsSelector.innerHTML = ''

    groupsArray.forEach(group => {
      const option = document.createElement('option')
      option.value = group
      option.innerText = group
      option.classList.add('group-option')
      groupsSelector.appendChild(option)
    })

  }
}

class Controller {
  constructor(data, view) {
    this.data = data
    this.view = view
  }
  async init() {
    // Tag Selector
    document.querySelector('.group-select').addEventListener('change', (e) => this.OnTagSelectorChange(e))


    // Render Project (Group = 'web')
    const projects = await this.data.getProjectAsync()
    this.view.renderProjects(projects, '')


    if (this.data.groups) {
      // Render porject group selector
      this.view.renderGroupsSelector(this.data.groups)

      // Select 'web' group
      this.changeProjectGroup('web')
    }

  }
  async OnTagSelectorChange(e) {
    if (e) {
      const group = e.target.value
      this.view.renderProjects(this.data.posts, group)
    }
  }
  changeProjectGroup(group) {
    const groupSelect = document.querySelector(`.group-select`)
    // change group value
    groupSelect.value = group

    // trigger change event
    const event = new Event('change')
    groupSelect.dispatchEvent(event)
  }
}


// Run 
const data = new Data()
const view = new View()
const controller = new Controller(data, view)

document.addEventListener('DOMContentLoaded', () => {

  controller.init()
})