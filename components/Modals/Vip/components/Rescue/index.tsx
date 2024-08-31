import Image from 'next/image';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { staticImport } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const Rescue = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const t = useTranslations().vip;
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.appData.rescueDetails);
  const [rescueDetails, yesterdayRescueDetails] = data;

  return (
    <div
      className={styles.rescueWrapper}
      data-lang={locale}
    >
      <div className={styles.header}>
        <h1
          data-lang={locale}
          style={{ paddingInline: t.todaysRescue === 'Cairkan Hari Ini' ? '.3rem' : '' }}
        >
          {t.todaysRescue}
        </h1>
      </div>
      <div className={styles.iconHolder}>
        <div className={styles.chestImg}>
          <Image
            sizes='25vw'
            alt='rescue_fund'
            src={staticImport.fund_lightning}
            quality={100}
            height={110}
            width={125}
            priority
            placeholder='blur'
          />
          <span>
            {yesterdayRescueDetails?.rescueBonus ? moneyFormat(Number(yesterdayRescueDetails?.rescueBonus), true) : 0}
          </span>
        </div>
        <div className={styles.chatImg}>
          <Image
            sizes='25vw'
            alt=''
            src={staticImport.chat_icon}
            fill
            priority
            quality={100}
            placeholder='blur'
          />
          <span className={styles.percentage}>
            {yesterdayRescueDetails?.rescueBonusRate
              ? moneyFormat(+(yesterdayRescueDetails?.rescueBonusRate * 100).toFixed(2))
              : 0}
            %
          </span>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        className={styles.collectBtn}
        onClick={() => {
          if (rescueDetails?.collected === 1) return;
          if (rescueDetails?.collected === 0) {
            localStorage.setItem('recent-modal', 'VIP');
            dispatch(setActiveModal(DATA_MODAL.RESCUE_FUND));
          }
        }}
        style={{
          filter: yesterdayRescueDetails?.collected === 1 ? 'grayscale(1)' : '',
        }}
        disabled={yesterdayRescueDetails?.collected === 1}
      >
        <span>{t.collect}</span>
      </motion.button>
    </div>
  );
};

export default Rescue;
