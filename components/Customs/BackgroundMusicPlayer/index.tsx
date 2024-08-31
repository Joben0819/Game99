'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ACTIVITY_PAGES } from '@/constants/app';
import { useAppSelector } from '@/store';
import { audio } from '@/utils/resources';

const BackgroundMusicPlayer = () => {
  const pathname = usePathname();
  const [userInteract, setUserInteract] = useState(false);
  const { isBackgroundMusicOn } = useAppSelector((state) => state.appData);
  const shouldPlayBGMusic = userInteract && isBackgroundMusicOn && !pathname.includes('/game');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const bgMusic = audioRef.current;
    const playAudio = () => {
      if (bgMusic) {
        bgMusic.loop = true;
        bgMusic?.play();
      }
    };
    const pauseAudio = () => {
      if (!bgMusic) return;
      bgMusic.pause();
    };

    const handleUserInteract = () => setUserInteract(true);

    const handleBackgroundMusic = () => {
      if (document.visibilityState === 'visible' && shouldPlayBGMusic) {
        playAudio();
      } else {
        pauseAudio();
      }
    };
    handleBackgroundMusic();

    window.addEventListener('click', handleUserInteract);
    document.addEventListener('visibilitychange', handleBackgroundMusic);
    return () => {
      window.removeEventListener('click', handleUserInteract);
      document.removeEventListener('visibilitychange', handleBackgroundMusic);
    };
  }, [isBackgroundMusicOn, pathname, userInteract]);

  if (ACTIVITY_PAGES.includes(pathname)) return null;

  return (
    <audio
      ref={audioRef}
      src={audio.mp3_music}
    />
  );
};

export default BackgroundMusicPlayer;
