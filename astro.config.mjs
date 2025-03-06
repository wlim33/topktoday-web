// @ts-check
import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify/functions';


export default defineConfig({
  output: 'server',
  //vite: {
  //  plugins
  //},
  adapter: netlify({ edgeMiddleware: true }),

})
