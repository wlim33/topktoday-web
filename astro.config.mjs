// @ts-check
import { defineConfig } from 'astro/config';

import { nodePolyfills } from 'vite-plugin-node-polyfills'
import netlify from '@astrojs/netlify/functions';


export default defineConfig({
  output: 'server',
  vite: {
    plugins: [nodePolyfills()]
  },
  adapter: netlify({ edgeMiddleware: true }),

})
