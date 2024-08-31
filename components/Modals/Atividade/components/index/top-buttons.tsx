import Image from 'next/image';
import { FC } from 'react';
import { ACTIVITY_TYPE, APK_EVENT } from '@/constants/enums';
import classNames from 'classnames';
import { triggerApkEvent } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './styles.module.scss';

type TopButtonsProps = {
  isEvent: boolean;
  refetchMission: () => void;
  setTab: (tab: ACTIVITY_TYPE) => void;
};

const TopButtons: FC<TopButtonsProps> = ({ isEvent, refetchMission, setTab }) => {
  const t = useTranslations().activity;

  const handleClick = () => {
    if (isEvent) {
      refetchMission();
      triggerApkEvent(APK_EVENT.ENTER_TASK);
      setTab(ACTIVITY_TYPE.MISSION);
    } else {
      setTab(ACTIVITY_TYPE.EVENTS);
    }
  };

  return (
    <div className={styles.buttons}>
      <div
        onClick={handleClick}
        className={classNames({ 'pointer-events-none': isEvent })}
      >
        <span
          data-type='events'
          data-active={isEvent}
        >
          {t.events}
        </span>
        <Image
          src={isEvent ? images.act_panel_btn_active : images.act_panel_btn_inactive}
          alt='btn-events'
          fill
          sizes='100%'
        />
      </div>
      <div
        onClick={handleClick}
        className={classNames({ 'pointer-events-none': !isEvent })}
      >
        <span data-active={!isEvent}>{t.mission}</span>
        <Image
          src={!isEvent ? images.act_panel_btn_active : images.act_panel_btn_inactive}
          alt='btn-mission'
          fill
          sizes='100%'
        />
      </div>
    </div>
  );
};

export default TopButtons;
