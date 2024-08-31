import { FC, Fragment } from 'react';
import { AnnouncementProps } from '@/constants/types';
import { ImgWithFallback } from '@/components/Customs/ImgWithFallback';
import { imagePlaceholder } from '../placeholder';
import styles from './index.module.scss';

const ContentImage: FC<AnnouncementProps> = ({ announcement, setJumpActivity }) => {
  const formatContent = (content: string | null) => {
    return content?.split('\n').map((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  };

  return (
    <div className={styles.announcementWrapper}>
      <div className={styles.titleWrapper}>
        <p data-textafter={announcement?.title}>{announcement?.title}</p>
      </div>

      <div
        className={styles.innerWrapper}
        onClick={setJumpActivity}
      >
        <p>{formatContent(announcement?.content!)}</p>
      </div>
      {!!announcement?.image?.length && (
        <div
          className={styles.imageWrapper}
          onClick={setJumpActivity}
        >
          <div className={styles.imageContainer}>
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
        </div>
      )}
    </div>
  );
};

export default ContentImage;
