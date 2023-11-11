import { useAtomValue, useSetAtom } from 'jotai';
import Dropdown from './Dropdown';
import { AppTheme, selectedThemeAtom, themeAtom } from '@/state/app/theme';
import { Monitor, Moon, Sunrise } from 'react-feather';
import { useEffect, useState } from 'react';

export interface CurrentThemeIconProps {
  theme: AppTheme;
}

export function CurrentThemeIcon(props: CurrentThemeIconProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (props.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } else {
      return props.theme;
    }
  });

  useEffect(() => {
    if (props.theme !== 'system') {
      setTheme(props.theme);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    setTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [props.theme]);

  switch (theme) {
    case 'dark':
      return <Moon size={18} color="currentColor" />;
    case 'light':
      return <Sunrise size={18} color="currentColor" />;
    default:
      return <Monitor size={18} color="currentColor" />;
  }
}

export default function ThemeSelector() {
  const setTheme = useSetAtom(selectedThemeAtom);
  const theme = useAtomValue(themeAtom);

  return (
    <div>
      <Dropdown
        TriggerProps={{
          className:
            'hover:bg-background flex items-center justify-center w-8 h-8 rounded',
        }}
        trigger={<CurrentThemeIcon theme={theme} />}
        items={[
          {
            children: (
              <span className="flex gap-2 items-center">
                <Monitor size={18} /> System
              </span>
            ),
            onSelect: () => {
              setTheme('system');
            },
          },
          {
            children: (
              <span className="flex gap-2 items-center">
                <Sunrise size={18} /> Light
              </span>
            ),
            onSelect: () => {
              setTheme('light');
            },
          },
          {
            children: (
              <span className="flex gap-2 items-center">
                <Moon size={18} /> Dark
              </span>
            ),
            onSelect: () => {
              setTheme('dark');
            },
          },
        ]}
      />
    </div>
  );
}
