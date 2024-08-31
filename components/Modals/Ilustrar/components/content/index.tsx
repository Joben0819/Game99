import Image from 'next/image';

import { FC, Fragment } from 'react';

import { images } from '@/utils/resources';

import { SideMenuProps } from '../side-menu';
import styles from './index.module.scss';

const Content: FC<Omit<SideMenuProps, 'handleActive'>> = ({ filteredAnnouncements, activeAnnouncement }) => {
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  };

  return (
    <div className={styles.content}>
      <Image src={images.platform_content} alt="" width={574.25} height={312.5} priority />
      <div className={styles.announcementContent}>
        {filteredAnnouncements.map(
          ({ id, homePrompt, content }) =>
            homePrompt === 1 && id === activeAnnouncement && <span key={id}>{formatContent(content)}</span>,
        )}
      </div>
    </div>
  );
};

export default Content;
