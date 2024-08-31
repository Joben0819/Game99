'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { ACTIVITY_PAGES } from '@/constants/app';
import { isHuaweiBrowser } from '@/utils/helpers';

type FullScreenWindowProps = {
  children: ReactNode;
};

const FullScreenWindow: FC<FullScreenWindowProps> = ({ children }) => {
  const params = useSearchParams();
  const handle = useFullScreenHandle();
  const [isXiaomi, setIsXiaomi] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const currentPath = usePathname().replace(/^\/[a-z]{2}(\/|$)/, '/');
  const platformName = params.get('platformName');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator) {
      setIsAndroid(/Android/i.test(window.navigator.userAgent));
      setIsXiaomi(/Xiaomi/i.test(window.navigator.userAgent));
    }
  }, []);

  useEffect(() => {
    const lockOrientation = async () => {
      if (isAndroid && !isXiaomi) {
        try {
          if (!platformName?.includes('PG')) await (screen.orientation as any).lock('landscape');
        } catch (err) {
          console.error('Error locking orientation:', err);
        }
      }
    };
    lockOrientation();

    return () => {
      if (isAndroid && !isXiaomi && screen.orientation) {
        screen.orientation.unlock();
      }
    };
  }, [handle.active, platformName]);

  const clickHandler = () => {
    !isHuaweiBrowser() && handle.enter();
  };

  const handleChange = useCallback(
    (state: any, handle: any) => {
      if (state) {
        document.removeEventListener('click', clickHandler);
        document.body.classList.add('fullscreen-body');
      } else {
        document.addEventListener('click', clickHandler, { once: true });
        document.body.classList.remove('fullscreen-body');
      }
    },

    [handle.enter],
  );

  return (
    <div id='onroot'>
      {isAndroid && !isXiaomi && !ACTIVITY_PAGES.includes(currentPath) ? (
        <FullScreen
          handle={handle}
          onChange={handleChange}
        >
          {children}
        </FullScreen>
      ) : (
        <> {children} </>
      )}
    </div>
  );
};

export default FullScreenWindow;
