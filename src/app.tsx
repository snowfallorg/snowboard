import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/components/App';
import './index.css';
import { ThemeProvider } from './state/app/theme';
import * as Tooltip from '@radix-ui/react-tooltip';

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

      localStorage.setItem('app/theme', 'system');
    }

    if (theme === 'dark') {
      html?.classList.add('dark');
    } else {
      html?.classList.add('light');
    }
  } else {
    const theme = localStorage.getItem('app/theme');

    if (theme !== 'dark' && theme !== 'light') {
      localStorage.setItem('app/theme', 'system');
    }
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Tooltip.Provider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Tooltip.Provider>
    </React.StrictMode>,
  );
}
