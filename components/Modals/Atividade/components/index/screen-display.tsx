import dynamic from 'next/dynamic';

import { FC } from 'react';

import { MissionProps } from './../mission';

type DisplayProps = MissionProps & {
  isEvent: boolean;
};

const Mission = dynamic(() => import('./../mission'));
const Events = dynamic(() => import('./../events'));

const ScreenDisplay: FC<DisplayProps> = ({ loading, header, missionsRepeatList, isEvent, onShowPopUp }) => {
  if (isEvent) return <Events />;
  return (
    <Mission
      loading={loading}
      header={header}
      missionsRepeatList={missionsRepeatList ?? []}
      onShowPopUp={onShowPopUp}
    />
  );
};

export default ScreenDisplay;
