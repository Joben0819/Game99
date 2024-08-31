import { FC } from 'react';
import HeaderTitle from '@/components/Customs/HeaderTitle';
import { useTranslations } from '@/hooks/useTranslations';
import Amount from './components/amount';
import BackgroundImage from './components/background-image';
import ClaimBtn from './components/claim-btn';
import Energy from './components/energy';
import Spinner from './components/spinner';
import styles from './index.module.scss';

type PopUpProps = {
  amount: number;
  onClose: () => void;
};

const PopUp: FC<PopUpProps> = ({ amount, onClose }) => {
  const t = useTranslations().activity;

  return (
    <div className={styles.popUpWrapper}>
      <div className={styles.body}>
        <HeaderTitle
          text={t.congrats}
          size={30}
        />
        <BackgroundImage />
        <Spinner />
        <Energy />
        <Amount amount={amount} />
        <ClaimBtn onClose={onClose} />
      </div>
    </div>
  );
};

export default PopUp;
