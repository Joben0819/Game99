import type { Config } from 'tailwindcss';
import { ADD_UTILITIES } from './services/types';

const plugin = require('tailwindcss/plugin');
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }: ADD_UTILITIES) => {
      addUtilities({
        '.flex-all-center': {
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
      });
    }),
  ],
};
export default config;
