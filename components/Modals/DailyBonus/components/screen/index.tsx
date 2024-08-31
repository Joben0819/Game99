import { FC } from 'react';
import HeaderTitle from '@/components/Customs/HeaderTitle';
import { useTranslations } from '@/hooks/useTranslations';
import DisplayRewards, { DisplayRewardProps } from './components/display-rewards';
import Note from './components/note';
import styles from './index.module.scss';

const BonusScreen: FC<DisplayRewardProps> = ({ activeVip, setShowPopup }) => {
  const t = useTranslations().dailyBonus;

  return (
    <div className={styles.bonusWrapper}>
      <HeaderTitle
        text={t.header}
        size={35}
        transform='uppercase'
      />
      <Note />
      <DisplayRewards
        activeVip={activeVip}
        setShowPopup={setShowPopup}
      />
    </div>
  );
};

export default BonusScreen;
