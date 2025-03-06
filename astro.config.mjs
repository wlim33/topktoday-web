// @ts-check
import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';


export default defineConfig({
  output: 'server',
  vite: {
    ssr: {
      // Example: Force a broken package to skip SSR processing, if needed
      external: ["pg"],
    }
  },
  adapter: netlify(),

})
