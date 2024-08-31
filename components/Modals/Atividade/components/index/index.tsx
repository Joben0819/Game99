
import PopUp from '../pop-up';
import RightPanel from './right-panel';
import ScreenDisplay from './screen-display';
import TopButtons from './top-buttons';
import CloseButton from '@/components/Customs/CloseButton';
import { useActivity } from './useActivity';

import styles from './styles.module.scss';

const DisplayActivity = () => {
  const {
    isLoading,
    missions,
    showPopup,
    headerProps,
    amountReward,
    setTab,
    isEvent,
    closeModal,
    onShowPopUp,
    refetchMission,
    handlePopUpClose,
  } = useActivity();

  if (showPopup) return <PopUp onClose={handlePopUpClose} amount={amountReward} />;

  return (
    <div className={styles.mainContainer}>
      <CloseButton onClick={closeModal} />
      <TopButtons isEvent={isEvent()} refetchMission={refetchMission} setTab={setTab} />
      <RightPanel isEvent={isEvent()} />
      <ScreenDisplay
        loading={isLoading}
        header={headerProps}
        missionsRepeatList={missions?.repeatMissionList ?? []}
        onShowPopUp={onShowPopUp}
        isEvent={isEvent()}
      />
    </div>
  );
};
export default DisplayActivity;
