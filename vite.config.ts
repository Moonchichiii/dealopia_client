import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // New Tailwind CSS v4 Vite plugin
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 3000000, // 3MB limit to avoid memory issues
      },
      manifest: {
        name: 'Dealopia',
        short_name: 'Dealopia',
        description: 'Modern local deals website',
        theme_color: '#6366f1',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@api': path.resolve(__dirname, './src/api'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@context': path.resolve(__dirname, './src/context'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      timeout: 30000,
      clientPort: 5173,
      path: '/ws',
      overlay: true,
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
        cookieDomainRewrite: 'localhost',
        cookiePathRewrite: '/',
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            console.log('Sending Request to the Target:', proxyReq.method, proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, _req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, (proxyRes as any).req?.url);
          });
        },
      },
      '/auth': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/accounts': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/admin': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/static': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/media': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: 'lightningcss',
    reportCompressedSize: false, // Speeds up build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query', '@tanstack/query-sync-storage-persister', '@tanstack/react-query-persist-client'],
          forms: ['react-hook-form', 'zod'],
          ui: ['react-toastify', 'lucide-react', 'clsx', 'tailwind-merge'],
          cloud: ['@cloudinary/react', '@cloudinary/url-gen'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096, // Inline small assets as base64
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'react-hook-form',
      'zod',
      'axios',
      'clsx',
      'tailwind-merge',
      '@cloudinary/react',
      '@cloudinary/url-gen',
    ],
  },
  preview: {
    port: 5173,
    strictPort: true,
    host: true,
  }
})