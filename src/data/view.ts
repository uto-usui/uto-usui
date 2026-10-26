// Immutable site data
/**
 * mata elements
 */
export const viewData = {
  overview: {
    title: 'Hello, I am branding engineer :)',
    text: [
      'I am 31 years old and a web developer from Nara/Japan @ Condé Nast. After a music university, I changed my career from a musician / sound engineer to a web developer when I was 25 years old.',
      "I'm good at building high-performance SPA / SSG sites in Nuxt / Next x TypeScript, developed components that reflect design systems, luxury visuals in WebGL, and UI / UX considerations for interpreting business and brand stories.",
      'Winner: FWA FOTD / ACC TOKYO CREATIVITY AWARDS Branded category Finalist',
      'I love cat and engineering and music.',
      ' -- ',
      'Thanks.',
    ],
    links: [
      {
        title: 'clip blog_ ',
        name: 'webmanab',
        link: 'https://webmanab.com/',
        color: '#393e46',
      },
      // { title: 'email_ ', name: 'me@uto-usui.com', link: ' me@uto-usui.com' },
      // {
      //   title: 'repo_ ',
      //   name: '@uto-usui',
      //   link: 'https://github.com/uto-usui',
      // },
    ],
  },
  works: [
    {
      name: 'WIRED.jp',
      text: 'WIRED is a media about how technology will shape our future. To speed up the old site by quitting WordPress, I implemented the SSG architecture in Nuxt. After the renewal, the load time was reduced to 1/2, and the transition time to 1/5. I build an Atomic Design-based design system and achieve robust component management with Storybook.',
      tag: 'Nuxt / TypeScript / Test / Design System / Interaction Design / Creative Direction',
      link: 'https://wired.jp/',
      color: '#8300d5',
      images: ['wired/1.jpg', 'wired/4.jpg', 'wired/2.jpg', 'wired/3.jpg'],
    },
    {
      name: 'VOGUE JAPAN 20th Anniversary 1999~2019',
      text: 'This is a site that digests the culmination of 20 years of VOGUE JAPAN and introduces the archive with various contents. The luxurious and modest brand image was expressed with WebGL distortion and glitch noise. The subtleties of beauty are controlled by the smoothness and sharpness of the interactions.',
      tag: 'Nuxt / TypeScript / WebGL / Interaction Design / Develop Management / Creative Direction',
      link: 'https://www.vogue.co.jp/anniversary/20th/',
      color: '#fe0000',
      images: ['20th/2.jpg', '20th/3.jpg', '20th/1.jpg', '20th/4.jpg'],
    },
    {
      name: 'WIRED vol.39 <br> The World in 2021',
      text: 'Since this page contains many articles, we implemented a fluid interaction as if a large amount of information were flowing into the magazine. We also used a simple but directional parallax expression to express the feeling of the magazine shaking.',
      tag: 'Nuxt / TypeScript / Interaction Design / Creative Direction',
      link: 'https://wired.jp/vol39-the-world-in-2021/',
      color: '#ff9f00',
      images: ['vol39/2.jpg', 'vol39/3.jpg', 'vol39/4.jpg', 'vol39/1.jpg'],
    },
    {
      name: 'WIRED vol.35 <br> Deep Tech for The Earth',
      text: '',
      tag: 'Nuxt / Interaction Design / Creative Direction',
      link: 'https://wired.jp/vol35-deep-tech-for-the-earth/',
      color: '#e1e638',
      images: ['vol35/2.jpg', 'vol35/3.jpg', 'vol35/4.jpg', 'vol35/1.jpg'],
    },
    {
      name: 'WIRED vol.34 <br> Narrative',
      text: '',
      tag: 'Nuxt / Interaction Design / Creative Direction',
      link: 'https://wired.jp/vol34-narrative-and-deployment/',
      color: '#eeeeee',
      images: ['vol34/4.jpg', 'vol34/2.jpg', 'vol34/1.jpg', 'vol34/3.jpg'],
    },
    {
      name: 'WIRED vol.33 <br> Mirror World',
      text: '',
      tag: 'Nuxt / Interaction Design / Creative Direction',
      link: 'https://wired.jp/vol33-mirror-world/',
      color: '#157bbf',
      images: ['vol33/2.jpg', 'vol33/4.jpg', 'vol33/3.jpg', 'vol33/1.jpg'],
    },
    {
      name: 'WIRED vol.32 <br> Digital Well-Being',
      text: '',
      tag: 'Nuxt / Interaction Design / Creative Direction',
      link: 'https://wired.jp/vol32-digital-well-being/',
      color: '#f27970',
      images: ['vol32/2.jpg', 'vol32/3.jpg', 'vol32/4.jpg', 'vol32/1.jpg'],
    },
    {
      name: 'GQ MEN OF THE YEAR 2018',
      text: '',
      tag: 'Vue / WebGL / Interaction Design / Creative Direction',
      link: 'https://www.gqjapan.jp/_special/moty/2018/',
      color: '#c9af5b',
      images: [
        'moty2018/1.jpg',
        'moty2018/2.jpg',
        'moty2018/3.jpg',
        'moty2018/4.jpg',
      ],
    },
  ],
  about: {
    skill: [
      {
        name: 'Design',
        tags: 'Figma / design system / design tokens / accessibility (WCAG) / UX writing / prototyping',
      },
      {
        name: 'HTML',
        tags: 'semantic markup / WAI-ARIA / SEO / structured data',
      },
      {
        name: 'CSS',
        tags: 'Sass / custom properties / container queries / cascade layers / fluid typography / Tailwind CSS / CSS architecture',
      },
      {
        name: 'JavaScript',
        tags: 'TypeScript / Vue / Nuxt / React / Next / Astro / Vite / Node.js / WebGL / Three.js / gsap',
      },
      {
        name: 'Quality',
        tags: 'Storybook / Playwright / Vitest / visual regression testing / axe / Lighthouse / ESLint / Stylelint',
      },
      {
        name: 'AI',
        tags: 'Claude Code / Codex / MCP / agent skills / LLM-driven development',
      },
      {
        name: 'Sound',
        tags: 'Pro Tools / Logic',
      },
      {
        name: 'Other',
        tags: 'macOS / Git / GitHub Actions / Docker / Cloudflare / pnpm',
      },
    ],
    social: [
      {
        link: 'https://www.instagram.com/uto_ao/',
        name: 'instagram_',
        color: '#e329e3',
      },
      {
        link: 'https://jp.pinterest.com/okiniirinoao/',
        name: 'pinterest_',
        color: '#e60023',
      },
      {
        link: 'https://twitter.com/uto_ao',
        name: 'twitter_',
        color: '#1DA1F2',
      },
      {
        link: 'https://github.com/uto-usui',
        name: 'Github_',
        color: '#24292e',
      },
      {
        link: 'https://qiita.com/uto-usui',
        name: 'Qiita_',
        color: '#55C500',
      },
      {
        link: 'https://zenn.dev/uto_ao',
        name: 'Zenn_',
        color: '#3ea8ff',
      },
    ],
    fav: 'J. R. R. Tolkien / shuntaro tanikawa / shigesato itoi / manabu mizuno / Kenya Hara / hikaru ijyuin / bakery / coffee / wine / americanfootball / hikaru utada / the band apart / Spangle call lilli line / radio',
  },
  other: [
    {
      name: 'woodwork',
      images: [
        [
          'woodwork/7.jpg',
          'woodwork/12.jpg',
          'woodwork/8.jpg',
          'woodwork/9.jpg',
          'woodwork/10.jpg',
          'woodwork/11.jpg',
          'woodwork/14.jpg',
          'woodwork/15.jpg',
        ],
        [
          'woodwork/6.jpg',
          'woodwork/13.jpg',
          'woodwork/6.jpg',
          'woodwork/13.jpg',
          'woodwork/12.jpg',
          'woodwork/18.jpg',
          'woodwork/17.jpg',
          'woodwork/3.jpg',
        ],
        [
          'woodwork/0.jpg',
          'woodwork/1.jpg',
          'woodwork/2.jpg',
          'woodwork/0.jpg',
          'woodwork/3.jpg',
          'woodwork/15.jpg',
          'woodwork/20.jpg',
          'woodwork/5.jpg',
        ],
      ],
    },
    {
      name: 'photograph',
      images: [
        [
          'photo/8.jpg',
          'photo/9.jpg',
          'photo/10.jpg',
          'photo/11.jpg',
          'photo/12.jpg',
          'photo/7.jpg',
          'photo/14.jpg',
          'photo/15.jpg',
        ],
        [
          'photo/6.jpg',
          'photo/13.jpg',
          'photo/5.jpg',
          'photo/4.jpg',
          'photo/16.jpg',
          'photo/17.jpg',
          'photo/1.jpg',
          'photo/3.jpg',
        ],
        [
          'photo/0.jpg',
          'photo/1.jpg',
          'photo/2.jpg',
          'photo/3.jpg',
          'photo/6.jpg',
          'photo/7.jpg',
          'photo/4.jpg',
          'photo/5.jpg',
        ],
      ],
    },
    {
      name: 'music',
      images: [],
      image: 'music/1.jpg',
      youtube: 'Mgl-EP-9RLg',
      youtubeTitle: 'お気に入りの碧 MV『かぞえうた』',
    },
  ],
  nav: ['OVERVIEW', 'WORKS', 'ABOUT', 'OTHER'],
} as const
