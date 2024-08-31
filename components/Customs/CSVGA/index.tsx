import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { DATA_MODAL } from '@/constants/enums';
import classNames from 'classnames';
import { useAppSelector } from '@/store';
import styles from './index.module.scss';

type CSVGAProps = {
  src: string;
  option?: any;
  className?: string;
  isSVGALoaded?: () => void;
};

const CSVGA: FC<CSVGAProps> = ({ src, option, className = '', isSVGALoaded }) => {
  const path = usePathname();
  const { activeModal } = useAppSelector((state) => state.appData);
  const [playerState, setPlayerState] = useState<any>();
  const [parserState, setParserState] = useState<any>();
  const [isPlayed, setIsPlayed] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !playerState && !parserState) {
      loadSvga();
    }
    return () => {
      svgaCleanup();
    };
  }, [src, parserState, playerState]);

  useEffect(() => {
    if (
      activeModal !== DATA_MODAL.CLOSE &&
      (src.includes('main_bg') || src.includes('money') || src.includes('dailybonus'))
    ) {
      pausePlayer();
    } else {
      playPlayer();
    }
  }, [activeModal, playerState, path]);

  const loadSvga = async () => {
    const { Parser, Player } = await require('svga');
    const canvas = document.getElementById(src) as HTMLCanvasElement | null;
    setParserState(new Parser({ isDisableImageBitmapShim: true, isDisableWebWorker: true }));
    if (canvas) {
      setPlayerState(new Player({ container: canvas, loop: 0 }));
    }
  };

  const svgaCleanup = () => {
    if (playerState && parserState) {
      parserState?.destroy();
      playerState?.destroy();
    }
  };

  const startPlayer = async () => {
    if (!playerState || !parserState) return;
    const svga = await parserState?.load(src);
    await playerState?.mount(svga);
    playerState?.start();
    if (activeModal === DATA_MODAL.MAIL_OPENED && option.pause) {
      setTimeout(() => {
        playerState?.pause();
      }, 4000);
    }

    setTimeout(() => {
      isSVGALoaded && isSVGALoaded();
    }, 300);
  };

  const playPlayer = () => {
    if (!playerState || !parserState) return;
    if (isPlayed) {
      // playerState?.resume();
    } else {
      setIsPlayed(true);
      startPlayer();
    }
  };

  const pausePlayer = () => {
    playerState?.pause();
  };

  return (
    <canvas
      className={classNames(styles.svga, className)}
      id={src}
    />
  );
};

export default CSVGA;
