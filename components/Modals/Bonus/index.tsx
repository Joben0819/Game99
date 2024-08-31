import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal, setSecondModal, setThirdModal } from '@/reducers/appData';
import { collectTestMoney } from '@/services/api';
import classNames from 'classnames';
import CSVGA from '@/components/Customs/CSVGA';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { useAppDispatch, useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import styles from './index.module.scss';

const BonusComponent = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations().bonus;
  const { getAccountBalance } = useWithDispatch();
  const locale = useAppSelector((s) => s.appData.language);
  const { activeModal, secondModal } = useAppSelector((state) => state.appData);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isLoadedBG, seIsLoadedBG] = useState<boolean>(false);

  const handleCollect = () => {
    setIsDisabled(true);
    collectTestMoney().then((res) => {
      if (res.data?.code === 200) {
        toast.success(res.data?.msg ?? t.bonusCollected);
        getAccountBalance();
        setTimeout(() => {
          dispatch(setThirdModal(DATA_MODAL.CLOSE));
        }, 1500);
      } else {
        toast.error(res.data?.msg);
      }
    });

    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };

  const isSVGAloaded = () => {
    seIsLoadedBG(true);
  };

  return (
    <div className={styles.bonusBackdrop}>
      {!isLoadedBG && (
        <div className={classNames(styles.bonusBoard, '!opacity-100')}>
          <LoadingIcon />
        </div>
      )}

      <div
        className={classNames(styles.bonusBoard, {
          fadeIn: isLoadedBG,
          '!hidden': !isLoadedBG,
        })}
      >
        <CSVGA
          src={images.svga_bonus}
          isSVGALoaded={isSVGAloaded}
        />

        <div
          className={styles.closeButton}
          onClick={() => {
            if (activeModal === DATA_MODAL.BONUS) {
              dispatch(setActiveModal(DATA_MODAL.CLOSE));
            } else if (secondModal === DATA_MODAL.BONUS) {
              dispatch(setSecondModal(DATA_MODAL.CLOSE));
            } else [dispatch(setThirdModal(DATA_MODAL.CLOSE))];
          }}
        >
          <Image
            src={images.bonus_close_button}
            sizes='(max-width: 100vw) 100vw'
            alt='close-button'
            fill
            quality={100}
          />
        </div>

        <div className={styles.bonusContainer}>
          <div className={styles.bonusMoney}>
            <p>{t.currency}</p>
            <p>10</p>
          </div>
        </div>

        <div
          className={classNames(styles.bonusTip, {
            [styles['bonusTip--indo']]: locale === 'in',
          })}
        >
          <p>{t.header}</p>
          <p>
            {t.info1} <br /> {t.info2}
          </p>
        </div>

        <div
          className={classNames(styles.submitContainer, {
            [styles['submitContainer--disabled']]: isDisabled,
          })}
          onClick={!isDisabled ? () => {} : handleCollect}
        >
          <Image
            src={images.bonus_submit_button}
            sizes='(max-width: 100vw) 100vw'
            alt='close-button'
            fill
            quality={100}
          />
          <span className={styles.text}>{t.receive}</span>
          <span className={styles.shadow}>{t.receive}</span>
        </div>
      </div>
    </div>
  );
};

export default BonusComponent;
