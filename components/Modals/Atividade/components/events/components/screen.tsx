import { FC } from 'react';
import { ActivityTypesData } from '@/services/response-type';
import { TEvents } from '@/services/types';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import Display from './display';

type ScreenProps = {
  events: TEvents[];
  isLoading: boolean;
  isLoadingEvents: boolean;
  activeFrame: ActivityTypesData;
  refreshEvent: () => Promise<void>;
};

const Screen: FC<ScreenProps> = ({ events, isLoading, isLoadingEvents, activeFrame, refreshEvent }) => {
  if (isLoading) return <LoadingIcon />;

  return (
    <Display
      {...activeFrame}
      events={events}
      isLoading={isLoadingEvents}
      onRefresh={refreshEvent}
    />
  );
};

export default Screen;
