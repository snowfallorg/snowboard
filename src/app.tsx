import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/components/App';
import './index.css';
import { ThemeProvider } from './state/app/theme';

const root = document.querySelector('#root');

if (!root) {
  console.error('[Snowboard] Could not find root element.');
} else {
  const html = document.querySelector('html');

  // If the theme hasn't been prepopulated from client hints, then we should try
  // to pick the right one.
  if (!html?.classList.contains('dark') && !html?.classList.contains('light')) {
    let theme = localStorage.getItem('app/theme');

    if (theme !== 'dark' && theme !== 'light') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    if (theme === 'dark') {
      html?.classList.add('dark');
    } else {
      html?.classList.add('light');
    }
  } else {
    localStorage.setItem('app/theme', 'system');
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>,
  );
}
