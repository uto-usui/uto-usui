import path from 'path'
import StylelintPlugin from 'stylelint-webpack-plugin'

import Fiber from 'fibers'
import Sass from 'sass'

const scss = {
  implementation: Sass,
  sassOptions: {
    fiber: Fiber,
  },
}

module.exports = {
  target: 'static',

  buildModules: [
    '@nuxt/typescript-build',
    '@aceforth/nuxt-optimized-images',
    '@nuxtjs/style-resources',
  ],

  typescript: {
    typeCheck: true,
  },

  /**
   * https://marquez.co/docs/nuxt-optimized-images/
   */
  optimizedImages: {
    optimizeImages: false,
  },

  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src:
          'https://cdn.polyfill.io/v2/polyfill.js?features=IntersectionObserver,es6,es7',
        type: 'text/javascript',
      },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~plugins/vue-lazyload.client',
    '~plugins/locomotive.client',
    '~plugins/splitting.client',
    '~plugins/gtag.client',
    '~plugins/composition-api',
    '~plugins/image-env',
    '~plugins/vuex-router-sync',
    '~plugins/exStore',
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    'nuxt-user-agent',
    'nuxt-webfontloader',
    '@uto-usui/nuxt-google-gtag',
    'nuxt-mq',
  ],

  /**
   * media query breakpoint
   *
   * doc
   * : https://github.com/AlexandreBonaventure/vue-mq
   *
   * css break points
   * /assets/sass/foundation/variable/_breakpoint.scss
   *
   * <mq-layout mq="lg">
   *   <span> Display on lg </span>
   * </mq-layout>
   * <mq-layout mq="md+">
   *   <span> Display on md and larger </span>
   * </mq-layout>
   * <mq-layout :mq="['sm', 'lg']">
   *   <span> Display on sm and lg </span>
   * </mq-layout>
   */
  mq: {
    defaultBreakpoint: 'mobile',
    breakpoints: {
      mobile: 1279,
      desktop: Infinity,
    },
  },

  'google-gtag': {
    id: 'UA-xxxxxx',
    config: {
      send_page_view: false, // might be necessary to avoid duplicated page track on page reload
    },
    disableAutoPageTrack: false, // disable if you don't want to track each page route with router.afterEach(...).
  },

  /**
   * global scss variables and functions
   */
  styleResources: {
    scss: [
      '~/assets/sass/foundation/variable/_variable.scss',
      '~/assets/sass/foundation/mixin/_mixin.scss',
    ],
  },

  /**
   * global webfonts
   * // https://github.com/Developmint/nuxt-webfontloader
   */
  webfontloader: {
    //
  },

  router: {
    base: process.env.BASE_URL || '/',
  },

  /*
   ** Build configuration
   */
  build: {
    loaders: {
      scss,
    },

    babel: {
      presets({ isServer }) {
        return [
          [require.resolve('babel-preset-vca-jsx')],
          [
            require.resolve('@nuxt/babel-preset-app'),
            {
              targets: isServer ? { node: 'current' } : { ie: '11' },
            },
          ],
        ]
      },
    },

    terser: {
      terserOptions: {
        // disable console on prod
        compress: { drop_console: true },
      },
    },

    /*
     ** You can extend webpack config here
     */
    extend(config, { isClient, isDev }) {
      // Run ESLint on save
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })

        // stylelint
        config.plugins.push(
          new StylelintPlugin({
            files: ['**/*.vue'],
          }),
        )

        config.devtool = '#source-map'
      }

      // glsl
      config.module.rules.push({
        test: /\.(glsl|vs|fs)$/,
        use: ['raw-loader', 'glslify-loader'],
        exclude: /(node_modules)/,
      })

      config.output.globalObject = 'this'

      config.module.rules.unshift({
        test: /\.worker\.ts$/,
        loader: 'worker-loader',
      })
      config.module.rules.unshift({
        test: /\.worker\.js$/,
        loader: 'worker-loader',
      })

      // import alias
      config.resolve.alias.Sass = path.resolve(__dirname, './assets/sass/')
      config.resolve.alias.Js = path.resolve(__dirname, './assets/js/')
      config.resolve.alias.Images = path.resolve(__dirname, './assets/images/')
      config.resolve.alias['~'] = path.resolve(__dirname)
      config.resolve.alias['@'] = path.resolve(__dirname)
    },
  },

  postcss: {
    preset: {
      // IE grid support
      autoprefixer: {
        grid: 'autoplace',
      },
    },
  },

  generate: {
    exclude: [/^(?=.*\bmixins\b).*$/],
  },

  /**
   * env variables
   */
  env: {
    nodeEnv: process.env.NODE_ENV,
  },
  // server and client
  publicRuntimeConfig: {
    nodeEnv: process.env.NODE_ENV,
  },
  // server only
  privateRuntimeConfig: {},

  /**
   * PWA workbox setting
   *
   * doc
   * : https://pwa.nuxtjs.org/
   * : https://developers.google.com/web/tools/workbox/guides/get-started
   */
  workbox: {
    // ios safari video support
    cachingExtensions: '~/plugins/workbox-range-request.js',
    runtimeCaching: [
      // google fonts
      {
        urlPattern: '^https://fonts.(?:googleapis|gstatic).com/(.*)',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
      },
      {
        // cdn
        urlPattern: 'https://cdn.jsdelivr.net/.*',
        handler: 'cacheFirst',
      },
    ],
  },

  icon: {
    iconFileName: 'icon.png',
  },
}
