import { useEffect } from 'react';

export default function useTheme() {
  useEffect(() => {
    const html = document.querySelector('html');

    if (!html) {
      return;
    }

    let theme = localStorage.getItem('app/theme');

    if (theme !== 'dark' && theme !== 'light') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.add('light');
    }
  }, []);
}
