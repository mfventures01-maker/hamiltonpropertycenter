import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

window.onerror = function (message, source, lineno, colno, error) {
  console.error("HPC Production Client-Side Error:", { message, source, lineno, colno, error });
};

window.addEventListener("unhandledrejection", (event) => {
  console.error("HPC Production Unhandled Promise Rejection:", event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
