'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/store';
import { ACTIVITY_PAGES } from '@/constants/app';
import { audio } from '@/utils/resources';

const SoundEffects = () => {
  const { isSoundEffectsOn } = useAppSelector((state) => state.appData);
  const audioRef = useRef<HTMLAudioElement>(null);
  const pathname = usePathname().replace(/^\/[a-z]{2}(\/|$)/, '/');

  useEffect(() => {
    if (isSoundEffectsOn) {
      document.body.addEventListener('click', handleWindowClick);
    }
    return () => {
      document.body.removeEventListener('click', handleWindowClick);
    };
  }, [isSoundEffectsOn]);

  const handleWindowClick = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  if (ACTIVITY_PAGES.includes(pathname)) return null;

  return <audio ref={audioRef} className="sfx" src={audio.plastic_bubble_click} />;
};

export default SoundEffects;
