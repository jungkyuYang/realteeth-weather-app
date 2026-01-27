import type { StorybookConfig } from '@storybook/react-vite';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'vite.config.ts',
      },
    },
  },
  staticDirs: ['../public'],
  async viteFinal(config) {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': join(__dirname, '../src'),
        '@app': join(__dirname, '../src/app'),
        '@pages': join(__dirname, '../src/pages'),
        '@widgets': join(__dirname, '../src/widgets'),
        '@features': join(__dirname, '../src/features'),
        '@entities': join(__dirname, '../src/entities'),
        '@shared': join(__dirname, '../src/shared'),
      };
    }
    return config;
  },
};
export default config;
