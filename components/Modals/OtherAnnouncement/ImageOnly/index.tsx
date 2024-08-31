import { FC } from 'react';
import { AnnouncementProps } from '@/constants/types';
import classNames from 'classnames';
import { ImgWithFallback } from '@/components/Customs/ImgWithFallback';
import { imagePlaceholder } from '../placeholder';
import styles from './index.module.scss';

const ImageOnly: FC<AnnouncementProps> = ({ announcement, setJumpActivity }) => {
  return (
    <div
      className={classNames(styles.announcementWrapper, {
        [styles['announcementWrapper--noTitle']]: !announcement?.title?.length,
      })}
    >
      {!!announcement?.title?.length && (
        <div className={styles.titleWrapper}>
          <p>{announcement?.title}</p>
        </div>
      )}

      {!!announcement?.image?.length && (
        <div
          className={classNames(styles.imageWrapper, {
            [styles['imageWrapper--noTitle']]: !announcement?.title?.length,
          })}
          onClick={setJumpActivity}
        >
          <ImgWithFallback
            sizes="(max-width: 100vw) 100vw"
            alt="logo"
            src={announcement?.image ?? imagePlaceholder}
            fill
            quality={100}
            priority
            loadingPlaceholder={imagePlaceholder}
          />
        </div>
      )}
    </div>
  );
};

export default ImageOnly;
