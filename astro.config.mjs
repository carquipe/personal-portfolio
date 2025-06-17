// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    integrations: [react()],
    vite: {
        plugins: [tailwindcss()],
        server: {
            allowedHosts: [
              'localhost',
              'ef9d-88-22-77-144.ngrok-free.app' // tu subdominio actual de Ngrok
            ]
          }
    }
});
