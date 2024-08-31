import { useEffect } from 'react';
import { APK_EVENT, EVENT_ACTIVITY_ENUM } from '@/constants/enums';
import { triggerApkEvent } from '@/utils/helpers';
import RechargeAndCodeBonus from '../RechargeAndCodeBonus';
import CoinRoulette from '../coinRoulette';
import Screen from './components/screen';
import SideMenu from './components/side-menu';
import styles from './index.module.scss';
import { useEvent } from './useEvent';

const Events = () => {
  const {
    isLoading,
    isLoadingEvents,
    selectedBannerIndex,
    eventsTypes,
    activeFrame,
    events,
    handleActiveSideMenu,
    refreshEvent,
  } = useEvent();

  useEffect(() => {
    triggerApkEvent(APK_EVENT.ENTER_EVENT_CENTER);
  }, []);

  return (
    <>
      <SideMenu
        types={eventsTypes}
        handleActiveSideMenu={handleActiveSideMenu}
        activeIndex={selectedBannerIndex}
      />
      <div className={styles.screen}>
        {activeFrame?.activityTypeEnum === EVENT_ACTIVITY_ENUM.SPIN ? (
          <CoinRoulette />
        ) : activeFrame?.activityTypeEnum === EVENT_ACTIVITY_ENUM.RECHARGE ? (
          <RechargeAndCodeBonus />
        ) : (
          <Screen
            activeFrame={activeFrame}
            events={events}
            isLoading={isLoading}
            isLoadingEvents={isLoadingEvents}
            refreshEvent={refreshEvent}
          />
        )}
      </div>
    </>
  );
};

export default Events;
