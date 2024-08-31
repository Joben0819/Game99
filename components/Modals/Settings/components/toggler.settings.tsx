import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { setBackGroundMusic, setSoundEffects } from '@/reducers/appData';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from '../index.module.scss';

type TogglerProps = {
  type: 'music' | 'sound';
};

const Toggler: FC<TogglerProps> = ({ type }) => {
  const locale = useAppSelector((state) => state.appData.language);
  const dispatch = useAppDispatch();
  const t = useTranslations().settings;
  const isBackgroundMusicOn = useAppSelector((state) => state.appData.isBackgroundMusicOn);
  const isSoundEffectsOn = useAppSelector((state) => state.appData.isSoundEffectsOn);
  const isMusic = type === 'music';
  const headerTitle = isMusic ? t.music : t.effect;
  const togglerBtnIcon = isMusic ? images.music_icon : images.sound_icon;
  const [isOn, setIsOn] = useState(isMusic ? isBackgroundMusicOn : isSoundEffectsOn);

  useEffect(() => {
    (function () {
      if (isMusic) return dispatch(setBackGroundMusic(isOn));
      return dispatch(setSoundEffects(isOn));
    })();
  }, [isOn]);

  return (
    <div>
      <span>{headerTitle}</span>
      <div
        className={styles.togglerComponent}
        onClick={() => setIsOn(!isOn)}
        data-lang={locale}
      >
        <motion.div
          animate={{ x: isOn ? 0 : '-100%' }}
          transition={{ duration: 0.2 }}
          className={styles.togglerBg}
        />
        <span className={styles.on}>{t.on}</span>
        <span className={styles.off}>{t.off}</span>
        <motion.div
          className={styles.togglerBtn}
          animate={{ x: isOn ? '100%' : '0' }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.togglerBtnIcon}>
            <Image
              src={togglerBtnIcon}
              width={88}
              height={88}
              alt='Music icon'
              sizes='100vw'
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Toggler;
