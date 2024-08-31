import { useEffect, useState } from 'react';

const useOrientation = () => {
  const [isPortrait, setIsPortrait] = useState(window.matchMedia('(orientation: portrait)').matches);

  useEffect(() => {
    const handleOrientationChange = (e: MediaQueryListEvent) => {
      setIsPortrait(e.matches);
    };

    const mediaQuery = window.matchMedia('(orientation: portrait)');
    mediaQuery.addEventListener('change', handleOrientationChange);

    return () => {
      mediaQuery.removeEventListener('change', handleOrientationChange);
    };
  }, []);

  return isPortrait;
};

export default useOrientation;
