// Immutable site data
/**
 * mata elements
 */
export const viewData = {
  overview: {
    title: 'Hello, I am web developer :)',
    text:
      'I am 28 years old and a web developer from Nara. After a music university, I changed my career from a musician / sound engineer to a web developer when I was 25 years old.<br>What I am good at is Semantic coding conforming to HTML 5.1, Robust CSS design, friendly animation. <br> Currently mainly focusing on three.js / React, Visualization expression in JavaScript and I am learning web components. <br> My hobbies are furniture making and song writing. I make wooden handmade desks, chairs and fixtures. I open exhibitions and accept orders and sell them. I act slowly as a singer-songwriter and guitarist and trackmaker. <br> -- <br> Thanks◯',
    links: [
      {
        title: 'clip blog_ ',
        name: 'webmanab-html',
        link: 'https://webmanab-html.com/',
      },
      { title: 'email_ ', name: 'me@uto-usui.com', link: ' me@uto-usui.com' },
      {
        title: 'music woodwork_ ',
        name: 'OKINIIRINOAO',
        link: 'https://okiniirinoao.net/',
      },
    ],
  },
  works: [
    {
      name: 'run jyoshi',
      text:
        'Campaign site for Aiful run. To the Vivacious of the sports image and the cleanliness of the model, plus softness and humor by animation. I implemented asynchronous transition of the screen in order to make the content with many images look beautiful without stress.',
      tag: 'HTML CSS JavaScript Intaraction Design',
      link: '#',
      images: ['01.jpg', '01.jpg', '01.jpg', '01.jpg'],
    },
    {
      name: 'run jyoshi',
      text:
        'Campaign site for Aiful run. To the Vivacious of the sports image and the cleanliness of the model, plus softness and humor by animation. I implemented asynchronous transition of the screen in order to make the content with many images look beautiful without stress.',
      tag: 'HTML CSS JavaScript Intaraction Design',
      link: '#',
      images: ['01.jpg', '01.jpg', '01.jpg', '01.jpg'],
    },
  ],
  nav: ['OVERVIEW', 'WORKS', 'ABOUT', 'OTHER'],
} as const
