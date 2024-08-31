import { Inter } from 'next/font/google';
import { FC, ReactNode, Suspense } from 'react';
import '@/styles/globals.scss';
import type { Metadata } from 'next';
import BackgroundMusicPlayer from '@/components/Customs/BackgroundMusicPlayer';
import InternetStatusIndicator from '@/components/Customs/InternetStatusIndicator';
import PageLoader from '@/components/Customs/PageLoader';
import Resizer from '@/components/Customs/Resizer';
import SoundEffects from '@/components/Customs/SFX';
import FullScreenWindow from '@/components/FullScreen';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `${process.env.SITE_TITLE} ${process.env.SITE !== '9907' ? 'Slots' : ''}`,
  description: `${process.env.SITE_TITLE} Slots`,
  icons: [
    {
      media: '(prefers-color-scheme: light)',
      url: `/variant/${process.env.SITE}/favicon.ico`,
      href: `/variant/${process.env.SITE}/favicon.ico`,
    },
    {
      media: '(prefers-color-scheme: dark)',
      url: `/variant/${process.env.SITE}/favicon.ico`,
      href: `/variant/${process.env.SITE}/favicon.ico`,
    },
  ],
};

export const viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const RootLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
  return (
    <html>
      <link
        rel='manifest'
        href={`/variant/${process.env.SITE}/manifest.json`}
      />
      <meta
        name='theme-color'
        content='#000000'
      />
      <meta
        name='apple-mobile-web-app-capable'
        content='yes'
      />
      <meta
        name='apple-mobile-web-app-status-bar-style'
        content='black-translucent'
      />
      <body className={inter.className}>
        <Suspense fallback={null}>
          <FullScreenWindow>
            <div id='root'>
              <Providers>
                {children}
                <Resizer />
                <BackgroundMusicPlayer />
                <SoundEffects />
                <InternetStatusIndicator />
                <PageLoader />
              </Providers>
            </div>
          </FullScreenWindow>
        </Suspense>
      </body>
    </html>
  );
};

export default RootLayout;
