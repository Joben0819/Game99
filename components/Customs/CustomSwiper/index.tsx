'use client';

import { ReactNode, forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { Swiper, SwiperProps } from 'swiper/react';

type CustomSwiperProps = SwiperProps & {
  children?: ReactNode;
};

const CustomSwiper = forwardRef<ReactNode, CustomSwiperProps>((props, ref) => {
  const { children, ...rest } = props;
  const swiperRef = useRef<any>(null);
  useImperativeHandle(ref, () => swiperRef.current);

  useEffect(() => {
    setSwiperOrientation();
    let debounceId: any;

    function handleDebouncedResize() {
      if (debounceId) {
        clearTimeout(debounceId);
      }
      debounceId = setTimeout(() => {
        handleOrientation();
      }, 500);
    }

    window.addEventListener('resize', handleDebouncedResize);
    window.addEventListener('orientationchange', handleDebouncedResize);
    window.addEventListener('pageshow', handleDebouncedResize);
    return () => {
      window.removeEventListener('resize', handleDebouncedResize);
      window.removeEventListener('orientationchange', handleDebouncedResize);
      window.removeEventListener('pageshow', handleDebouncedResize);
    };
  }, [swiperRef.current]);

  const handleOrientation = useCallback(() => {
    setSwiperOrientation();
  }, []);

  const rotate90Swiper = function (swiper: any, optIsRotate90: boolean) {
    var isRotate90 = !!optIsRotate90;
    if (swiper && swiper.touches) {
      swiper.___touches = {};
      swiper.___touches.currentX = swiper.touches.currentX;
      Object.defineProperty(swiper.touches, 'currentX', {
        set: function (v) {
          if (!isRotate90) {
            swiper.___touches.currentX = v;
          } else {
            swiper.___touches.currentY = v;
          }
        },
        get: function () {
          return swiper.___touches.currentX;
        },
      });
      swiper.___touches.currentY = swiper.touches.currentY;
      Object.defineProperty(swiper.touches, 'currentY', {
        set: function (v) {
          if (!isRotate90) {
            swiper.___touches.currentY = v;
          } else {
            swiper.___touches.currentX = v;
          }
        },
        get: function () {
          return swiper.___touches.currentY;
        },
      });
    }
    return function (b: any) {
      isRotate90 = b;
    };
  };

  const setSwiperOrientation = () => {
    if (swiperRef.current) {
      const isPortrait = screen?.orientation?.type.includes('portrait');
      const setRotate90 = rotate90Swiper(swiperRef.current, true);
      setRotate90(!!isPortrait);
    }
  };

  return (
    <Swiper
      onInit={(swiper) => {
        swiperRef.current = swiper;
        const isPortrait = screen?.orientation?.type.includes('portrait');
        const setRotate90 = rotate90Swiper(swiper, true);
        setRotate90(!!isPortrait);
      }}
      {...rest}
    >
      {children}
    </Swiper>
  );
});

CustomSwiper.displayName = 'CustomSwiper';

export default CustomSwiper;
