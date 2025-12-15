import { defineConfig } from "astro/config";
import tsconfigPaths from "vite-tsconfig-paths"; 
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: 'https://carlosquinza.es',
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/_astro/'),
      customPages: [
        '/blog'
      ]
    })
  ],
  vite: {
    plugins: [tailwindcss(), tsconfigPaths()],
    server: {
      allowedHosts: [
        "localhost",
      ],
    }
  },
});
