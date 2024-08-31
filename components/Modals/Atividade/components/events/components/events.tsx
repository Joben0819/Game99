import { FC, Fragment } from 'react';
import { TEvents } from '@/services/types';
import NoData from '@/components/Customs/NoData';
import Event from './event';
import { useEventContent } from './useEventContent';

type EventsProps = {
  events: TEvents[];
};

const Events: FC<EventsProps> = ({ events }) => {
  const { selectedEventIDs, handleClick } = useEventContent({ events });

  if (!!!events?.length) return <NoData />;

  return (
    <Fragment>
      {events?.map((event) => (
        <Event
          key={event.id}
          event={event}
          selectedEventIDs={selectedEventIDs}
          onClick={handleClick}
        />
      ))}
    </Fragment>
  );
};

export default Events;
