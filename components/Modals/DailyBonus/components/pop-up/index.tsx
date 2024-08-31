import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { MODAL_BG_ANIMATION, MODAL_CONTENT_ANIMATION } from '@/constants/app';
import { DAILY_BONUS_POPUP_CODE, DATA_MODAL } from '@/constants/enums';
import { TDailyBonusShowPopUp } from '@/services/types';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import Button from '@/components/Customs/Button';
import CloseButton from '@/components/Customs/CloseButton';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { DisplayRewardProps } from '../screen/components/display-rewards';
import styles from './index.module.scss';

type PopUpProps = Pick<DisplayRewardProps, 'setShowPopup'> & TDailyBonusShowPopUp;

const PopUp: FC<PopUpProps> = ({ status, msg, setShowPopup }) => {
  const t = useTranslations().payment;
  const { push } = useRouter();

  const handleRecharge = () => {
    localStorage.setItem('recent-modal', DATA_MODAL.DAILY_BONUS);
    push(`/recharge`);
  };

  return (
    <motion.div
      variants={MODAL_BG_ANIMATION}
      exit='exit'
      className={styles.wrapper}
    >
      <motion.div
        variants={MODAL_CONTENT_ANIMATION}
        exit='exit'
        className={styles.container}
      >
        <CloseButton
          onClick={() =>
            setShowPopup({
              status: 0,
              msg: '',
            })
          }
        />
        <Image
          src={images.db_pop_bg}
          fill
          alt=''
          sizes='100%'
        />

        <div
          className={classNames(styles.content, [{ '!justify-center': status === DAILY_BONUS_POPUP_CODE.NO_RECHARGE }])}
        >
          <div className={classNames(styles.text, { '!h-auto': status === DAILY_BONUS_POPUP_CODE.NO_RECHARGE })}>
            <p dangerouslySetInnerHTML={{ __html: msg.replace(/\n/g, '<br/>') }} />
          </div>
          {status !== DAILY_BONUS_POPUP_CODE.NO_RECHARGE && (
            <Button
              onClick={handleRecharge}
              variant='orange'
              text={t.recharge}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PopUp;
