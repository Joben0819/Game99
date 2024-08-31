import { useEffect } from 'react';

export const useDisableZoom = () => {
  useEffect(() => {
    const disablePinchZoom = (e: any) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', disablePinchZoom, { passive: false });
    return () => {
      document.removeEventListener('touchmove', disablePinchZoom);
    };
  }, []);
};
