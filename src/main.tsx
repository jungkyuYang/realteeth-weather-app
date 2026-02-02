import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react'; // 1. Sentry 임포트

import './app/index.css';
import App from './app/App.tsx';

import { initTheme } from '@/shared/lib/theme';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
});

initTheme();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>에러가 발생했습니다. 잠시 후 다시 시도해주세요.</p>}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
);
