import { defineConfig } from "astro/config";
import tsconfigPaths from "vite-tsconfig-paths"; 
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss(), tsconfigPaths()],
    server: {
      allowedHosts: [
        "localhost",
      ],
    }
  },
});
