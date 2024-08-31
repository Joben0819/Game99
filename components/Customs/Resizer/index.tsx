'use client';

import { usePathname } from 'next/navigation';

import { useEffect, useState } from 'react';
import { isMobile, osVersion } from 'react-device-detect';

import { isHuaweiBrowser, isIOS, isMobilePlatform, isiOSStandaloneMode } from '@/utils/helpers';
import { images } from '@/utils/resources';

const Resizer = () => {
  const pathname = usePathname();
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [hasFocus, setHasFocus] = useState(false);

  useEffect(() => {
    window.addEventListener('orientationchange', handleOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  useEffect(() => {
    setHasFocus(false);
  }, [pathname]);

  useEffect(() => {
    setAppSize();
    const rootEl = document.getElementById('root');
    let debounceId: any;

    // Tester's iPhone 7 version - 15.7.9
    const handleDebouncedResize = () => {
      if (debounceId) clearTimeout(debounceId);
      const debounceDelay = osVersion === '15.7.9' && isiOSStandaloneMode() ? 500 : 400;
      debounceId = setTimeout(setAppSize, debounceDelay);
    };

    if (pathname.includes('/game')) {
      rootEl?.classList.add('in-game');
    } else {
      rootEl?.classList.remove('in-game');
    }

    const events = ['resize', 'orientationchange', 'visibilitychange'];
    events.forEach(event => window.addEventListener(event, handleDebouncedResize));
    window.addEventListener('focusin', handleFocus);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleDebouncedResize));
      window.removeEventListener('focusin', handleFocus);
    };
  }, [pathname, hasFocus]);

  const updateContainer = () => {
    const html = document.documentElement;
    const body = document.body;
    body.setAttribute('data-body-hight', `${screenHeight}px`);
    body.classList.add('modified-body');
    html.classList.add('modified-body');
    document.documentElement.style.setProperty('--main-height', `${screenHeight}px`);
  };

  const handleFocus = (event: FocusEvent) => {
    const focusedElement = event.target as HTMLElement;
    updateContainer();
    if (focusedElement.tagName === 'INPUT' && isHuaweiBrowser()) {
      setHasFocus(true);
    }
  };

  const handleOrientationChange = () => {
    setHasFocus(false);
    setScreenHeight(window.innerHeight);
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) focusedElement.blur();
    updateContainer();
  };

  const setAppSize = () => {
    setScreenHeight(window.innerHeight);
    const rootEl = document.getElementById('root');
    const onRootEl = document.getElementById('onroot');
    const htmlEl = document.querySelector('html');
    const bodyEl = document.querySelector('body');
    let height = window.innerHeight;
    let width = window.innerWidth;
    let newFontSize: number;

    if (!hasFocus) {
      if (isHuaweiBrowser()) {
        bodyEl?.classList.remove('has-focus');
      }

      if (rootEl && onRootEl && htmlEl && bodyEl) {
        if (isMobile) {
          const isPortrait = width < height;
          if (!pathname.includes('game')) {
            height = isPortrait ? window.innerWidth : window.innerHeight;
            width = isPortrait ? window.innerHeight : window.innerWidth;
            let sizeMultiplier = 2;

            if (isPortrait && !isiOSStandaloneMode() && isIOS() && isMobilePlatform()) {
              sizeMultiplier = 1.78;
            }
            const isSpecificiOSVersion = osVersion === '15.7.9' && isiOSStandaloneMode() && isIOS() && isMobilePlatform();
            const isiOSStandalone = isiOSStandaloneMode() && isIOS() && isMobilePlatform();

            if (isSpecificiOSVersion || isiOSStandalone) {
              sizeMultiplier = 1.9;
            }
            if (pathname === '/') {
              sizeMultiplier = 1.7;
            }
            if (pathname.includes('pinduoduo') && isIOS() && width <= 500) {
              sizeMultiplier = 1.95;
            }

            const insufficientWidthValue = height * sizeMultiplier - width;
            rootEl.style.height = height + 'px';
            rootEl.style.width = width + 'px';
            onRootEl.style.height = height + 'px';
            onRootEl.style.width = width + 'px';

            if (pathname.includes('pinduoduo') && isIOS()) {
              newFontSize = insufficientWidthValue > 0
                ? (13.333 / 70) * (height - insufficientWidthValue)
                : (13.333 / 100) * height;
            } else {
              newFontSize = insufficientWidthValue > 0
                ? (13.333 / 100) * (height - insufficientWidthValue)
                : (13.333 / 100) * height;
            }
            document.documentElement.style.setProperty('--base-font-size', `${newFontSize}px`);
            htmlEl.style.fontSize = newFontSize + 'px';
          } else {
            document.documentElement.style.setProperty('--base-font-size', `${38}px`);
            htmlEl.style.fontSize = 38 + 'px';
          }
        } else {
          const isPortrait = width < height;
          height = isPortrait ? window.innerWidth : window.innerHeight;
          width = isPortrait ? window.innerHeight : window.innerWidth;
          const insufficientWidthValue = height * 2 - width; //insufficientWidthValue -> this is greater than 0 if height * 2 is greater than width

          //setting the font size for rem and width-height of root element
          rootEl.style.height = height + 'px';
          rootEl.style.width = width + 'px';
          onRootEl.style.height = height + 'px';
          onRootEl.style.width = width + 'px';

          if (insufficientWidthValue > 0) {
            newFontSize = (13.333 / 100) * (height - insufficientWidthValue);
          } else {
            newFontSize = (13.333 / 100) * height;
          }
          document.documentElement.style.setProperty('--base-font-size', `${newFontSize}px`);
          htmlEl.style.fontSize = newFontSize + 'px';
        }
      }

      //i dont know why I set the body size LOL :(
      if (htmlEl && bodyEl) {
        bodyEl.style.height = `${window.innerHeight}px`;
        bodyEl.style.width = `${window.innerWidth}px`;
      }
    } else {
      if (isHuaweiBrowser()) {
        bodyEl?.classList.add('has-focus');
      }
    }
    document.documentElement.style.setProperty('--main-height', `${screenHeight}px`);

    //ignoring the root rotation when in /game
    if (rootEl && onRootEl && pathname.includes('/game')) {
      const isPortrait = width < height;
      if (isPortrait) {
        rootEl.style.background = `url("${images.main_bg_web_portrait}")`;
      } else {
        rootEl.style.background = '';
      }
      rootEl.style.backgroundSize = '100% 100%';
      rootEl.style.transform = 'rotate(0deg)';
      onRootEl.style.transform = 'rotate(0deg)';
      rootEl.style.height = '100%';
      rootEl?.classList.add('in-game');
    }
    //restore rotation behavior in css
    else if (rootEl && onRootEl && !pathname.includes('/game')) {
      rootEl.style.background = '';
      rootEl.style.transform = '';
      onRootEl.style.transform = '';
    }
  };

  return null;
};

export default Resizer;
