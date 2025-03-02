// https://github.com/mattboldt/typed.js

export const typed = new Typed('#welcome-message', {
  strings: ['Greetings, traveler!', 'Enjoy your stay!'],
  typeSpeed: 100,
  backSpeed: 50,
  backDelay: 5000,
  loop: true,
});

console.log('typed imported')