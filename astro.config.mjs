// @ts-check
import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify/functions';


export default defineConfig({
  output: 'server',
  vite: {
    ssr: {
      external: ['pg'],
    }
  },
  adapter: netlify({ edgeMiddleware: true }),

})
