/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    // 1. Terser 대신 더 안전하고 빠른 esbuild 사용 (타입 에러 방지)
    minify: 'esbuild',
    // 2. 프로덕션에서 console/debugger 제거
    sourcemap: false, // hidden보다 false가 용량 절감에 유리합니다.
    assetsInlineLimit: 10240, // 20KB는 너무 큼 -> 10KB로 낮춰서 JS 크기 감소
    cssCodeSplit: true,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'recharts';
            if (id.includes('@tanstack')) return 'tanstack';
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(dirname, 'src') },
      { find: '@app', replacement: path.resolve(dirname, 'src/app') },
      { find: '@pages', replacement: path.resolve(dirname, 'src/pages') },
      { find: '@widgets', replacement: path.resolve(dirname, 'src/widgets') },
      { find: '@features', replacement: path.resolve(dirname, 'src/features') },
      { find: '@entities', replacement: path.resolve(dirname, 'src/entities') },
      { find: '@shared', replacement: path.resolve(dirname, 'src/shared') },
    ],
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
