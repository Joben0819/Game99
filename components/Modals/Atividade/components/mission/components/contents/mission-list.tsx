import { FC, useMemo } from 'react';

import { TRepeatMissionItem } from '@/services/response-type';

import Loader from '@/components/Customs/Loader';

import { ContentProps } from './contents';
import MissionItem from './mission-item';

export type StatusOrder = {
  FINISHED: number;
  CLAIMED: number;
};

type MissionListProps = Pick<ContentProps, 'isCollecting' | 'onCollect'> & {
  missionsRepeat: TRepeatMissionItem[];
};

const MissionList: FC<MissionListProps> = ({ missionsRepeat, isCollecting, onCollect }) => {
  const statusOrder: StatusOrder = { FINISHED: 1, CLAIMED: 2 };

  const sortedMissions = useMemo(() => {
    return missionsRepeat?.slice().sort((a, b) => {
      const statusA = a.status || '';
      const statusB = b.status || '';

      return (
        (statusOrder[statusA as keyof StatusOrder] || Infinity) -
        (statusOrder[statusB as keyof StatusOrder] || Infinity)
      );
    });
  }, [missionsRepeat]);

  if (isCollecting) return <Loader radius='10' />;

  return (
    <ul>
      {sortedMissions?.map((mission) => (
        <MissionItem key={mission.id} {...mission} isCollecting={isCollecting} onCollect={onCollect} />
      ))}
    </ul>
  );
};

export default MissionList;
