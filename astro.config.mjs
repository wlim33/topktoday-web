// @ts-check
import { defineConfig } from 'astro/config';

import mkcert from 'vite-plugin-mkcert'

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',

  vite: {
      server: {
          https: true
      },
      ssr: {
          noExternal: ['package-name'],
      },

      plugins: [mkcert()]
	},

  adapter: cloudflare()
})