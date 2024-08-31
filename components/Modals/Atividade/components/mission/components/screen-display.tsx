import { FC } from 'react';

import Loader from '@/components/Customs/Loader';

import { MissionProps } from '..';
import { useMission } from '../useMission';
import Contents from './contents/contents';
import Header from './header';

type ScreenDisplayProps = MissionProps;

const ScreenDisplay: FC<ScreenDisplayProps> = ({ header, loading, missionsRepeatList, onShowPopUp }) => {
  const { isCollecting, collectReward } = useMission({ onShowPopUp });
  const headerProps = { ...header, onCollect: collectReward };
  const contentProps = { missionsRepeat: missionsRepeatList, isCollecting, onCollect: collectReward };

  if (loading) return <Loader radius='10' />;
  return (
    <>
      <Header {...headerProps} />
      <Contents {...contentProps} />
    </>
  );
};

export default ScreenDisplay;
