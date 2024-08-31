import Image from 'next/image';
import React, { FC } from 'react';
import { DATA_MODAL } from '@/constants/enums';
import { TAnnouncementTypes } from '@/services/response-type';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store';
import { isLoggedIn, moneyFormat } from '@/utils/helpers';
import { images, staticImport } from '@/utils/resources';
import styles from './index.module.scss';

type TProps = {
  handleAnnouncementBtnClick: (data: TAnnouncementTypes) => void;
  item: TAnnouncementTypes & {
    icon?: string;
    modal?: string;
    text?: string;
    display?: boolean;
  };
  announcement?: boolean;
};

const renderBonus = (m: number) => (
  <div className={styles.bonusNoti}>
    <div className={styles.coinIcon}>
      <Image
        sizes='(max-width: 100vw) 100vw'
        alt='logo'
        src={images.icon_coin ?? staticImport.game_item_placeholder}
        fill
        quality={100}
        priority
      />
    </div>
    <span>+{moneyFormat(m ? m : 0, true)}</span>
  </div>
);

const HeaderItemHolder: FC<TProps> = ({ handleAnnouncementBtnClick, item, announcement }) => {
  const locale = useAppSelector((s) => s.appData.language);
  const { userInfo } = useAppSelector((state) => state.userData);
  const { loginMethodList } = useAppSelector((state) => state.appData);
  const bonusData = loginMethodList.displayIcon;

  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      className={classNames(styles.iconHolder, {
        [styles.isAuthen]: item.modal === DATA_MODAL.BIND_PHONE,
      })}
      data-lang={locale}
      onClick={() => handleAnnouncementBtnClick(item)}
    >
      <div className={styles.icon}>
        <Image
          sizes='(max-width: 100vw) 100vw'
          fill
          alt={item?.title + 'icon'}
          src={item?.icon ?? item?.image ?? staticImport.game_item_placeholder}
        />
      </div>

      <div className={styles.stage}>
        <Image
          className={styles.stage}
          sizes='(max-width: 100vw) 100vw'
          fill
          alt={'stage'}
          src={images.header_btn_stage ?? staticImport.game_item_placeholder}
        />
      </div>

      {DATA_MODAL.RESCUE_FUND === item?.modal && isLoggedIn() && userInfo.hasRescueBonus && (
        <span className={styles.notification} />
      )}
      {item?.modal === DATA_MODAL.BIND_PHONE && !!bonusData?.money && renderBonus(bonusData?.money)}

      <span
        className={announcement ? styles.title : ''}
        data-lang={locale}
        data-textafter={item?.title ?? item?.text}
      >
        {item?.title ?? item?.text}
      </span>
    </motion.div>
  );
};

export default HeaderItemHolder;
