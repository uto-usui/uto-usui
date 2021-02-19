const path = require('path')
const rootPath = path.resolve(__dirname, '../');

module.exports = {
  addons: ['@storybook/addon-essentials'],
  stories: ['../**/*.stories.ts'],
  webpackFinal: async config => {
    config.module.rules.push({
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              additionalData: `
                @import "~/assets/sass/foundation/function/_index.scss";
                @import "~/assets/sass/foundation/variable/_index.scss";
                @import "~/assets/sass/foundation/mixin/_index.scss";
            `
            }
          },
        ],
      include: rootPath
      })
    config.module.rules.push({
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "ts-loader",
          options: {
            appendTsSuffixTo: [/\.vue$/],
            transpileOnly: true,
          },
        },
      ],
    })
    config.resolve.extensions.push('.ts')

    config.resolve.alias.Sass = path.resolve(rootPath, './assets/sass/')
    config.resolve.alias.Js = path.resolve(rootPath, './assets/js/')
    config.resolve.alias.Images = path.resolve(rootPath, './assets/images/')
    config.resolve.alias['@'] = rootPath
    config.resolve.alias['~'] = rootPath

    return config
  }
}
