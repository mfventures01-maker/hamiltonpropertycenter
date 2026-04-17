import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

const getContext = () => ({
  route: window.location.pathname,
  timestamp: new Date().toISOString(),
  buildVersion: import.meta.env.VITE_BUILD_VERSION || 'v1.0.0-prod',
});

window.onerror = function (message, source, lineno, colno, error) {
  console.error("HPC Production Client-Side Error:", { message, source, lineno, colno, error, ...getContext() });
  // Optional: Send to Supabase logs table here in the future
};

window.addEventListener("unhandledrejection", (event) => {
  console.error("HPC Production Unhandled Promise Rejection:", { reason: event.reason, ...getContext() });
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
