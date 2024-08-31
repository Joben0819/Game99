import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { setBackGroundMusic, setSoundEffects } from '@/reducers/appData';
import { useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type ToggleSwitchProps = {
  toggle: string;
  isChecked: boolean;
};

const ToggleSwitch: FC<ToggleSwitchProps> = ({ toggle, isChecked }) => {
  const locale = useAppSelector((state) => state.appData.language);
  const dispatch = useDispatch();
  const t = useTranslations().profile;
  const { isBackgroundMusicOn, isSoundEffectsOn } = useAppSelector((state) => state.appData);

  const handleChange = () => {
    if (toggle === 'music') {
      dispatch(setBackGroundMusic(!isBackgroundMusicOn));
    }
    if (toggle === 'effects') {
      dispatch(setSoundEffects(!isSoundEffectsOn));
    }
  };

  const toggleHandleStyles = {
    left: `${!isChecked ? '0%' : ''}`,
    right: `${isChecked ? '-50%' : ''}`,
  };

  return (
    <div
      className={styles.switch}
      onClick={handleChange}
    >
      <div
        className={styles.switchToggle}
        style={toggleHandleStyles}
        data-lang={locale}
      >
        <span
          className={styles.leftSpan}
          style={{ color: isChecked ? '#00e3ff' : '', display: isChecked ? '' : 'none' }}
        >
          {t.on}
        </span>
        <span
          className={styles.toggleIcon}
          style={{ backgroundImage: `url(${images[`profile_${toggle}_icon`]})` }}
        />
        <span
          className={styles.rightSpan}
          style={{ color: !isChecked ? '#00e3ff' : '', display: isChecked ? 'none' : '' }}
        >
          {t.off}
        </span>
      </div>
    </div>
  );
};

export default ToggleSwitch;
