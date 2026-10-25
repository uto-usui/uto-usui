/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config'

export default getViteConfig({
  test: {
    projects: [
      {
        extends: true,
        test: { name: 'unit', include: ['test/unit/**/*.test.ts'] },
      },
      {
        extends: true,
        test: { name: 'dist', include: ['test/dist/**/*.test.ts'] },
      },
    ],
  },
})
