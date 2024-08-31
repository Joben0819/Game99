import Image from 'next/image';
import { FC } from 'react';
import { TAnnouncementData } from '@/services/response-type';
import { images } from '@/utils/resources';
import Item from './components/item';
import styles from './index.module.scss';

export type SideMenuProps = {
  activeAnnouncement: number;
  filteredAnnouncements: TAnnouncementData[];
  handleActive: (id: number) => void;
};

const SideMenu: FC<SideMenuProps> = ({ activeAnnouncement, filteredAnnouncements, handleActive }) => {
  return (
    <div className={styles.sidebar}>
      <Image src={images.platform_sidebar} alt="sidebar" width={188.75} height={300} />
      <div className={styles.sidebarContainer}>
        {filteredAnnouncements.map(
          ({ id, title, homePrompt }) =>
            homePrompt === 1 && (
              <Item
                key={id}
                id={id}
                title={title}
                activeAnnouncement={activeAnnouncement}
                handleActive={handleActive}
              />
            ),
        )}
      </div>
    </div>
  );
};

export default SideMenu;
