import Image from 'next/image';
import { FC } from 'react';
import classNames from 'classnames';
import { TAnnouncementData } from '@/services/response-type';
import { images } from '@/utils/resources';
import { SideMenuProps } from '..';
import styles from './styles.module.scss';

type ItemProps = Omit<SideMenuProps, 'filteredAnnouncements'> & Pick<TAnnouncementData, 'id' | 'title'>;

const Item: FC<ItemProps> = ({ id, title, activeAnnouncement, handleActive }) => {
  const btnClassNames = classNames('btn', activeAnnouncement === id ? styles.activeBtn : styles.btn);

  return (
    <div className={btnClassNames} key={id} onClick={() => handleActive(id)}>
      <Image
        src={activeAnnouncement === id ? images.platform_active_btn : images.platform_btn}
        width={200}
        height={80}
        alt=""
      />
      <span>{title}</span>
    </div>
  );
};

export default Item;
