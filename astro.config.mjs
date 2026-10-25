import sitemap from '@astrojs/sitemap'
import { defineConfig, envField } from 'astro/config'

export default defineConfig({
  site: 'https://uto-usui.com',
  compressHTML: true,
  scopedStyleStrategy: 'attribute',
  integrations: [sitemap()],
  markdown: { syntaxHighlight: false },
  security: {
    // <meta http-equiv="Content-Security-Policy"> を出す。script と <style> は Astro がハッシュを付ける
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
        "font-src 'self'",
        "media-src 'self'",
        "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
        'frame-src https://www.youtube-nocookie.com',
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
      ],
      scriptDirective: {
        resources: ["'self'", 'https://www.googletagmanager.com'],
      },
      styleDirective: {
        // splitting の --char-index など、要素の style 属性を使う
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  env: {
    schema: {
      // 本番のビルドでだけ .env か環境変数で渡す。ないときは GA4 のタグを出さない
      PUBLIC_GA4_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 旧 Nuxt の style-resources と同じく、全部の SCSS の先頭に変数・関数・mixin を足す
          additionalData: `@use "/src/styles/tokens" as *;\n`,
        },
      },
    },
  },
})
