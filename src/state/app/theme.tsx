import useGetAtomValue from '@/hooks/util/useGetAtomValue';
import { useRerenderEffect } from '@/hooks/util/useRerenderEffect';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { useEffect } from 'react';

export type AppTheme = 'light' | 'dark' | 'system';

export const initialThemeAtom = atom<AppTheme>(() => {
  const html = document.querySelector('html');

  // If the theme hasn't been prepopulated from client hints, then we should try
  // to pick the right one.
  const theme = localStorage.getItem('app/theme');

  if (theme !== 'dark' && theme !== 'light') {
    return 'system';
  }

  if (html?.classList.contains('dark')) {
    return 'dark';
  }

  if (html?.classList.contains('light')) {
    return 'light';
  }

  return theme as AppTheme;
});

export const selectedThemeAtom = atom<AppTheme | null>(null);

export const themeAtom = atom<AppTheme>((get) => {
  const initialTheme = get(initialThemeAtom);
  const selectedTheme = get(selectedThemeAtom);

  if (selectedTheme) {
    return selectedTheme;
  }

  return initialTheme;
});

export interface ThemeProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const getTheme = useGetAtomValue(themeAtom);
  const setTheme = useSetAtom(themeAtom);
  const theme = useAtomValue(themeAtom);

  useRerenderEffect(() => {
    const html = document.querySelector('html');

    if (!html) {
      return;
    }

    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
    }

    if (html.classList.contains('light')) {
      html.classList.remove('light');
    }

    if (theme === 'system') {
      html.classList.add(
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
      );
    } else {
      html.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      const theme = getTheme();
      const html = document.querySelector('html');

      if (!html || theme !== 'system') {
        return;
      }

      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
      }

      if (html.classList.contains('light')) {
        html.classList.remove('light');
      }

      html.classList.add(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [getTheme, setTheme]);

  return children;
}
