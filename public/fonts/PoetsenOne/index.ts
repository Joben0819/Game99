import localFont from 'next/font/local';

export const POETSEN_ONE = localFont({
  src: [
    {
      path: '../PoetsenOne/PoetsenOne-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-poetsen-one',
});
