import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://homes.ax',
  output: 'static',
  integrations: [sitemap()],
  image: { responsiveStyles: true },
});
