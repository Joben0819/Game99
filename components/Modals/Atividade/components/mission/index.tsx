import { FC } from 'react';
import { TEnergyItem, TRepeatMissionItem } from '@/services/response-type';
import ScreenDisplay from './components/screen-display';
import styles from './index.module.scss';

export type MissionProps = {
  header: {
    missions: TEnergyItem[];
    progressPercentage: number;
    progressCounter: number;
  };
  missionsRepeatList: TRepeatMissionItem[];
  loading: boolean;
  onShowPopUp: (amount: number, message: string) => void;
};

const Mission: FC<MissionProps> = ({ header, missionsRepeatList, loading = true, onShowPopUp }) => {
  const missionProps = {
    header: header,
    missionsRepeatList: missionsRepeatList,
    loading: loading,
    onShowPopUp: onShowPopUp,
  };
  return (
    <div className={styles.screen}>
      <ScreenDisplay {...missionProps} />
    </div>
  );
};

export default Mission;
