import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from "vite-plugin-pwa";
import pkg from './package.json';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), checker({
    typescript: true,
    eslint: false,
  }), VitePWA({
    registerType: "autoUpdate",
    filename: 'service-worker.js',
    includeAssets: ["favicon.ico", "robots.txt", "icon-192x192.png", "icon-512x512.png"],
    manifest: {
      name: "",
      short_name: "AgencyX",
      theme_color: "#000000",
      background_color: "#ffffff",
      display: "standalone",
      start_url: "/",
      icons: [
        {
          src: "/logo-agencyx-svg-png.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/logo-agencyx-svg-png-sin-fondo.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fcm.googleapis.com\/.*/,
          handler: "NetworkOnly",
        },
        {
          urlPattern: /\.(js|css|html)$/,
          handler: "NetworkFirst",  // Siempre intenta obtener los archivos actualizados
          options: {
            cacheName: "dynamic-cache",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24, // 1 día
            },
          },
        },
      ],
    }
  }), sentryVitePlugin({
    org: "maen-studios",
    project: "agencyx-web"
  })],

  base: '/',
  
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['.ngrok-free.app'],
  },

  build: {
    sourcemap: true
  }
});
