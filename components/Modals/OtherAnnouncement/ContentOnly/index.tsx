import { FC } from 'react';
import { AnnouncementProps } from '@/constants/types';
import styles from './index.module.scss';

const ContentOnly: FC<AnnouncementProps> = ({ announcement, setJumpActivity }) => {
  return (
    <div className={styles.announcementWrapper}>
      <div className={styles.announcementContainer}>
        <div className={styles.titleWrapper}>
          <p data-textafter={announcement?.title}>{announcement?.title}</p>
        </div>
        <div
          className={styles.innerWrapper}
          onClick={setJumpActivity}
        >
          {announcement?.content}
        </div>
      </div>
    </div>
  );
};

export default ContentOnly;
