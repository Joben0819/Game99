import { FC, memo } from 'react';
import { TRepeatMissionItem } from '@/services/response-type';
import MissionList from './mission-list';
import styles from './styles.module.scss';

export type ContentProps = {
  isCollecting: boolean;
  missionsRepeat: TRepeatMissionItem[];
  onCollect: (id: string, status: string, amount: number, type: number) => void;
};

const Contents: FC<ContentProps> = ({ isCollecting, missionsRepeat, onCollect }) => {
  return (
    <div className={styles.contentWrapper}>
      <MissionList
        missionsRepeat={missionsRepeat}
        isCollecting={isCollecting}
        onCollect={onCollect}
      />
    </div>
  );
};

export default memo(Contents);
