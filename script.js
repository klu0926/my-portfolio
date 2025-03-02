import { getData } from "./src/getPortfolioData.js"
import { typed } from "./src/typed.js"

class Data {
  constructor() {
    this.projects
    this.groups
  }
  async getProjectAsync() {
    try {
      const { err, projects } = await getData('posts')
      console.log('posts:', projects)
      if (err) throw new Error(err)
      if (!projects || projects.lenght === 0) throw new Error('No post in posts')

      // get groups, store groups
      const groups = new Set()
      projects.forEach(p => groups.add(p.group))
      this.groups = groups

      // store posts
      this.projects = projects

      return projects
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
      const stringLength = 120;
      let description = ''
      if (project.description.length > stringLength) {
        description = project.description.slice(0, stringLength) + '...'
      } else {
        description = project.description
      }

      // create porject card
      const projectCard = `
       <div class="project-card" data-title="${project.title}">
        <div class='project-image-div'data-title="${project.title}">
         <img
              class="project-image"
              src="${project.cover}"
              alt="project image"
              data-title="${project.title}"
            />
        </div>
            <div class='project-info' data-title="${project.title}">
              <p class="project-title" data-title="${project.title}">${project.title}</p>
            <p class="project-description" data-title="${project.title}">${description}</p>
            <button class='detail' data-title='${project.title}'>Detail</button>
            </div>
          </div>
      `
      // add to container
      this.projectContainer.innerHTML += projectCard
    })
  }
  renderGroupsSelector(groupsArray, projects) {
    const groupsSelector = document.querySelector('.group-select')
    groupsSelector.innerHTML = ''

    // add "All" group
    const option = document.createElement('option')
    option.value = ''
    option.innerText = `All (${projects.length})`
    option.classList.add('group-option')
    groupsSelector.appendChild(option)

    // add each group
    groupsArray.forEach(group => {
      const option = document.createElement('option')
      option.value = group
      option.innerText = `${group} (${projects.filter(p => p.group === group).length})`
      option.classList.add('group-option')
      groupsSelector.appendChild(option)
    })

  }
  openProjectDisplay(project) {
    const display = document.querySelector('.project-display-outter')
    display.classList.add('show')

    const title = display.querySelector('.project-display-title')
    title.innerText = project.title

    const description = display.querySelector('.project-display-description')
    description.innerText = project.description

    const image = display.querySelector('.project-display-image img')
    image.src = project.cover

    // tags
    const tags = display.querySelector('.project-display-tags')
    tags.innerHTML = ''
    if (project.tags) {
      project.tags.forEach(tag => {
        const span = document.createElement('span')
        span.innerText = tag.name
        span.classList.add('project-display-tag')
        tags.appendChild(span)
      })
    }

    // meta (lines)
    const meta = display.querySelector('.project-display-meta')
    meta.innerHTML = ''
    if (project.meta) {
      project.meta.forEach(link => {
        const p = document.createElement('p')

        p.innerHTML = `<span class='meta'>${link.key}</span>: <a target='_blank' href=${link.value}>${link.value}</a>`
        meta.appendChild(p)
      })
    }
  }
  closeProjectDisplay() {
    const display = document.querySelector('.project-display-outter')
    display.classList.remove('show')
  }
  openBurgerMenu() {
    const nav = document.querySelector('nav')
    nav.classList.add('open')
  }
  closeBurgerMenu() {
    const nav = document.querySelector('nav')
    nav.classList.remove('open')

  }
}

class Controller {
  constructor(data, view) {
    this.data = data
    this.view = view
  }
  async init() {
    // Event setup
    this.eventSetup()

    // Render Project (Group = 'web')
    const projects = await this.data.getProjectAsync()

    if (projects) {
      this.view.renderProjects(projects, '')
    }

    if (this.data.groups) {
      // Render porject group selector
      this.view.renderGroupsSelector(this.data.groups, this.data.projects)

      // Select 'web' group
      this.changeProjectGroup('web')
    }

  }
  eventSetup() {
    // burger menu event
    document.addEventListener('click', (e) => {
      // when burger menu is open, close it if click somewhere else
      const nav = document.querySelector('.nav')
      const burger = document.querySelector('.burger')
      const isOpen = window.getComputedStyle(nav).display !== 'none'
      if (!isOpen) return
      if (e.target.contains(nav) || e.target.contains(burger)) return
      // close
      this.view.closeBurgerMenu()
    })
    document.querySelector('.burger-container').addEventListener('click', () => {
      const nav = document.querySelector('.nav')
      // check burger menu open
      if (window.getComputedStyle(nav).display === 'none') {
        this.view.openBurgerMenu()
      } else {
        this.view.closeBurgerMenu()
      }
    })

    // Group select event
    document.querySelector('.group-select').addEventListener('change', (e) => this.OnTagSelectorChange(e))

    // Project Display events
    const displayOutter = document.querySelector('.project-display-outter')
    const display = document.querySelector('.project-display')

    displayOutter.addEventListener('click', (e) => {
      // check if click outside of display
      if (!display.contains(e.target)) {
        this.view.closeProjectDisplay()
      }
    })
    const close = document.querySelector('.project-display-close')
    close.addEventListener('click', () => {
      this.view.closeProjectDisplay()
    })
  }
  async OnTagSelectorChange(e) {
    if (e) {
      const group = e.target.value
      this.view.renderProjects(this.data.projects, group)

      // add detail button event 
      const detailButtons = document.querySelectorAll('.detail')
      detailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          this.onOpenDisplayClick(e)
        })
      })

      // add open display event
      const projects = document.querySelectorAll('.project-card')
      projects.forEach(p => {
        p.addEventListener('click', (e) => {
          this.onOpenDisplayClick(e)
        })
      })
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
  onOpenDisplayClick(e) {
    // get project title
    const projectTitle = e.target.getAttribute('data-title')
    // find project
    const project = this.data.projects.find(p => p.title === projectTitle)
    // display project
    this.view.openProjectDisplay(project)
  }

}


// Run 
const data = new Data()
const view = new View()
const controller = new Controller(data, view)

document.addEventListener('DOMContentLoaded', () => {

  controller.init()
})