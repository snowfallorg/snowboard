import theme from 'tailwindcss/defaultTheme';
import nord from 'tailwind-nord';
import tinycolor from 'tinycolor2';
import clip from 'tailwind-clip-path';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const colors = nord.config.theme.extend.colors({});

// For easily bootstrapping color css variables.
for (let i = 0; i < 16; i++) {
  const name = `nord${i}`;
  const color = tinycolor(colors[name]).toRgb();
  console.log(`--color-${name}: ${color.r}, ${color.g}, ${color.b};`);
}

const env = globalThis.process.env.NODE_ENV;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content:
    // Do not include CSS in the library output. Only include it in the application.
    env === 'publish' ? [] : ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', ...theme.fontFamily.sans],
      },
      screens: {
        phone: '480px',
        tablet: '640px',
        laptop: '1024px',
        desktop: '1280px',
      },
      colors: {
        background: {
          light: 'rgba(var(--color-background-light), <alpha-value>)',
          DEFAULT: 'rgba(var(--color-background), <alpha-value>)',
          dark: 'rgba(var(--color-background-dark), <alpha-value>)',
        },
        foreground: {
          light: 'rgba(var(--color-foreground-light), <alpha-value>)',
          DEFAULT: 'rgba(var(--color-foreground), <alpha-value>)',
          dark: 'rgba(var(--color-foreground-dark), <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgba(var(--color-primary), <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgba(var(--color-secondary), <alpha-value>)',
        },
        error: {
          DEFAULT: 'rgba(var(--color-error), <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgba(var(--color-warning), <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgba(var(--color-success), <alpha-value>)',
        },
      },
    },
  },
  variants: {
    extend: {
      visibility: ['group-hover'],
    },
  },
  plugins: [nord, clip],
};
