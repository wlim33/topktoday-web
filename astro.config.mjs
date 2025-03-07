// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import netlify from '@astrojs/netlify';


export default defineConfig({
  output: 'server',
  vite: {

    plugins: [tailwindcss()],
    ssr: {
      // Example: Force a broken package to skip SSR processing, if needed
      external: ["pg"],
    }
  },
  experimental: {
    svg: {
      mode: 'sprite',
    }
  },
  adapter: netlify(),

})
