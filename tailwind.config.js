// tailwind.config.js
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,svelte,vue}'],
    theme: {
      screens: {
        tall: { raw: '(min-height:600px)' },
      },
      extend: {
      },
    },
    plugins: [],
  };