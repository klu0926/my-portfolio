import { getData } from "./src/getPortfolioData-min.js"
import "./src/typed-min.js"
import { setQuill } from "./src/quill-min.js"

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
              loading="lazy"
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

        p.innerHTML = `<span class='meta'>${link.key}</span> <a target='_blank' href=${link.value}>${link.value}</a>`
        meta.appendChild(p)
      })
    }

    // set quill
    setQuill(project.data)

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
  displayFlashMessage(message, timer = 3000) {
    const flash = document.querySelector('#flash')
    const flashMessage = document.querySelector('.flash-message')

    flashMessage.innerText = message
    flash.classList.remove('out')
    flash.classList.add('in')

    setTimeout(() => {
      flash.classList.remove('in')
      flash.classList.add('out')
    }, (timer));
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
      const nav = document.querySelector('nav');
      const burger = document.querySelector('.burger-container');

      // If click is inside nav or on burger button, do nothing
      if (nav.contains(e.target) || burger.contains(e.target)) {
        return;
      }

      // Otherwise, close the menu (click was outside)
      this.view.closeBurgerMenu();
    });
    document.querySelector('.burger-container').addEventListener('click', (e) => {
      e.stopPropagation()
      const nav = document.querySelector('.nav')

      // if is already open, close it, else open it
      if (nav.classList.contains('open')) {
        this.view.closeBurgerMenu()
      } else {
        this.view.openBurgerMenu()
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

    // Contact Form events
    const contact = document.querySelector('#contact-form')
    contact.addEventListener('submit', (e) => {
      this.onFromSubmit(e)
    })

    // theme toggle button
    const themeToggle = document.querySelector('#theme-toggle-input')
    themeToggle.addEventListener('click', () => {
      this.toggleTheme()
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
  async onFromSubmit(e) {
    const form = document.querySelector('#contact-form')

    try {
      // prevent form to submit
      e.preventDefault()

      // check validation
      const isValided = this.checkFormValidation()
      if (!isValided) return

      // Convert from data to json
      const formData = new FormData(form)
      const object = Object.fromEntries(formData)
      const json = JSON.stringify(object)

      // Disabled submit button
      const submit = document.querySelector('.submit')
      console.log('submit', submit)
      submit.classList.remove('ready')
      submit.disabled = true
      submit.innerText = 'Sending...'

      // Send from
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      if (!response.ok) throw new Error(response.status)

      // complete
      this.view.displayFlashMessage('Message Sent!')

    } catch (err) {
      console.error(err.message)
      this.view.displayFlashMessage('Something went wrong')
    } finally {
      submit.classList.add('ready')
      submit.disabled = false
      submit.innerText = 'Submit'
      form.reset()
    }
  }

  checkFormValidation(e) {
    // inputs
    const nameInput = document.querySelector('#name')
    const emailInput = document.querySelector('#email')
    const messageInput = document.querySelector("#message")

    // validations
    const nameValidation = document.querySelector('#name-validation')
    const emailValidation = document.querySelector('#email-validation')
    const messageValidation = document.querySelector('#message-validation')
    const validationSpans = [nameValidation, emailValidation, messageValidation]
    validationSpans.forEach(v => v.classList.remove('active'))

    // check input validation
    let validatedCount = 0;
    const validities = [
      nameInput.validity,
      emailInput.validity,
      messageInput.validity
    ]

    for (let i = 0; i < validities.length; i++) {
      if (validities[i].valid) {
        validatedCount += 1
        continue
      }
      // check 
      if (validities[i].valueMissing) {
        validationSpans[i].innerText = 'Required'
      } else if (validities[i].typeMismatch) {
        // mismatch
        if (validationSpans[i].id === 'email-validation') {
          validationSpans[i].innerText = 'Please enter valide email'
        }
        else {
          validationSpans[i].innerText = 'Please enter valide info'
        }
      } else if (validities[i].tooShort) {
        validationSpans[i].innerText = 'Minimum 10 characters'
      } else {
        validationSpans[i].innerText = 'Invalide Input'
      }
      // show
      validationSpans[i].classList.add('active')
    }

    // for testing
    console.log(validities)

    if (validatedCount === validities.length) {
      return true
    } else {
      return false
    }
  }
  toggleTheme() {
    if (document.documentElement.getAttribute('data-theme') === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
}



// Run 
const data = new Data()
const view = new View()
const controller = new Controller(data, view)

document.addEventListener('DOMContentLoaded', () => {
  controller.init()
})