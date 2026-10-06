import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const siteUrl = loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL || 'https://pirinola-neural.vercel.app';

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'pirinola-site-url',
        transformIndexHtml: (html) => html.replaceAll('%PIRINOLA_SITE_URL%', siteUrl),
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
