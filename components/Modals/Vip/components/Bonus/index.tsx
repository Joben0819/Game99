import Image from 'next/image';
import { FC } from 'react';
import { TVipGiftInfo } from '@/services/response-type';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { staticImport } from '@/utils/resources';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type BonusComponentProps = {
  type: 'monthly' | 'weekly' | 'upgrade';
  vipGiftInfoList: TVipGiftInfo | null;
  collectLevelBonus: (type: number) => void;
};

const BonusComponent: FC<BonusComponentProps> = ({ type, vipGiftInfoList, collectLevelBonus }) => {
  const locale = useAppSelector((state) => state.appData.language);
  const t = useTranslations().vip;
  const { userInfo } = useAppSelector((state) => state.userData);

  const bonusTitleType = {
    monthly: t.monthlyReward,
    weekly: t.weeklyReward,
    upgrade: t.vipUpgradeBonus,
  };
  const bonusTitle = bonusTitleType[type];

  const bonusStatusType = {
    monthly: vipGiftInfoList?.monthBonusStatus,
    weekly: vipGiftInfoList?.weekBonusStatus,
    upgrade: vipGiftInfoList?.levelBonusStatus,
  };
  const bonusStatus = bonusStatusType[type];

  const bonusAmount = (() => {
    switch (type) {
      case 'monthly':
        return vipGiftInfoList?.vipSetList?.find((item) => item.level === userInfo?.vip)?.monthBonus;
      case 'weekly':
        return vipGiftInfoList?.vipSetList?.find((item) => item.level === userInfo?.vip)?.weekBonus;
      case 'upgrade':
        return vipGiftInfoList?.vipSetList?.find((item) => item.level === userInfo?.vip)?.levelBonus;
      default:
        return null;
    }
  })();

  const typeValues = {
    upgrade: 1,
    weekly: 2,
    monthly: 3,
  };
  const collectType = typeValues[type];

  return (
    <div
      className={styles.bonusWrapper}
      data-lang={locale}
      data-vip={userInfo?.vip}
    >
      <div className={styles.header}>
        <h1>{bonusTitle}</h1>
      </div>
      <div className={styles.iconHolder}>
        <div className={styles.coinImg}>
          <Image
            sizes='25vw'
            alt='bonus'
            src={staticImport.vip_bonus_coin}
            width={126}
            height={109}
            quality={100}
            priority
            placeholder='blur'
          />
          <span>{moneyFormat(bonusAmount || 0, true)}</span>
        </div>
      </div>
      {bonusStatus === 1 ? (
        <motion.div
          whileTap={{ scale: 0.9 }}
          className={styles.collectBtn}
          onClick={() => collectLevelBonus(collectType)}
        >
          <span>{t.collect}</span>
        </motion.div>
      ) : bonusStatus === 2 && userInfo?.vip === 50 ? (
        <div className={styles.subdetails}></div>
      ) : (
        <div className={styles.details}>
          {bonusStatus === 2 && (
            <div className={styles.claimed}>
              <span>{t.claimed}</span>
            </div>
          )}

          <span>{t.vipNextLevet}:</span>
          <span>V{userInfo?.vip + 1 ?? 0}</span>
          <span>
            {moneyFormat(bonusAmount || 0, true)}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='34'
              height='6'
              viewBox='0 0 34 6'
              fill='none'
            >
              <path
                d='M34 3L29 0.113251L29 5.88675L34 3ZM-4.24258e-08 3.5L29.5 3.5L29.5 2.5L4.24258e-08 2.5L-4.24258e-08 3.5Z'
                fill='#8AF6FE'
              />
            </svg>{' '}
            <span className={styles.nextBenefit}>
              {moneyFormat(
                vipGiftInfoList?.vipSetList?.find((item) => item.level === userInfo?.vip + 1)?.[
                  type === 'upgrade' ? 'levelBonus' : type === 'weekly' ? 'weekBonus' : 'monthBonus'
                ] ?? 0,
                true,
              )}
            </span>
          </span>
        </div>
      )}
      {bonusStatus === 2 && userInfo?.vip === 50 && (
        <div className={styles.maxClaimed}>
          <div className={styles.iconContainer}>
            <Image
              sizes='25vw'
              alt='logo'
              src={images.max_claimed}
              fill
              priority
              quality={100}
            />
          </div>
          <div className={classNames(styles.claimBtn, styles.claimed)}>
            <span>{t.claimed}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BonusComponent;
