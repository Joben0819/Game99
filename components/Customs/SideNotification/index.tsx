'use client';

import Image from 'next/image';
import { FC } from 'react';
import { useAppSelector } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useSideNotification } from './useSideNotification';
import styles from './index.module.scss';

type SideNotificationProps = {};

const SideNotification: FC<SideNotificationProps> = () => {
  const { handleClick, parsedNotification } = useSideNotification();
  const userId = useAppSelector((state) => state.userData.userInfo?.id);

  if (!userId || !parsedNotification.title) return null;

  return (
    <div
      onClick={() => parsedNotification?.content?.gameId && handleClick(parsedNotification.content.gameId)}
      className={styles.wrapper}
    >
      <Image
        src={images.winnerBanner}
        alt=""
        fill
        sizes="50vw"
      />
      <div className={styles.img}>
        <Image
          src={parsedNotification.content?.icon}
          alt=""
          fill
          sizes="40vw"
        />
      </div>
      <p>
        {parsedNotification.title} <br /> <span>{moneyFormat(parsedNotification.content?.profit)}</span>
      </p>
    </div>
  );
};

export default SideNotification;
