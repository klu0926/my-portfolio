// https://github.com/mattboldt/typed.js

export const welcomeTyped = new Typed('#welcome-message', {
  strings: ['Greetings, traveler!', 'Enjoy your stay!'],
  typeSpeed: 100,
  backSpeed: 50,
  backDelay: 5000,
  loop: true,
});

export const contactTyped = new Typed('#contact-message', {
  strings: [
    "Let's create something great. Get in touch.",
    "Have a project? Let's make it happen.",
    "Looking to collaborate? Message me.",
    "Let’s bring your idea to life. Reach out.",
    "Ready to build? Fill out the form."
  ],
  typeSpeed: 100,
  backSpeed: 50,
  backDelay: 5000,
  loop: true,
});

console.log('typed imported')