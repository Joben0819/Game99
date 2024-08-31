import Image from 'next/image';
import { FC } from 'react';
import { EVENT_TYPES } from '@/constants/enums';
import { TEvents } from '@/services/types';
import classNames from 'classnames';
import NoData from '@/components/Customs/NoData';
import styles from './styles.module.scss';

type EventProp = {
  event: TEvents;
  selectedEventIDs: number[];
  onClick: (event: TEvents) => void;
};

const Event: FC<EventProp> = ({ event, onClick }) => {
  const { id, url, type, content, icon } = event;
  const isEventContentAvailable = type === 0 && content && content !== '';

  // display iframe / webView events
  if (type === EVENT_TYPES.TYPE_2) {
    return url ? (
      <div className={styles.iframeContainer}>
        <iframe
          title='description'
          src={url}
          className={styles.iFrameWrapper}
        />
      </div>
    ) : (
      <NoData />
    );
  }

  return (
    <>
      {isEventContentAvailable ? (
        <div
          id={`content-container-${id}`}
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div
          className={classNames(styles.eventsContainer, {
            [styles.withDropdown]: (url || type) && type === 0,
          })}
          onClick={() => onClick(event)}
        >
            <Image src={icon} alt='' fill sizes='100%' />
        </div>
      )}
    </>
  );
};

export default Event;
