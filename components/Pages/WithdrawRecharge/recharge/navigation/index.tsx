import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveInviteContent, setActiveModal, setPrevPage } from '@/reducers/appData';
import { setPageLoad } from '@/reducers/appData';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/store';
import { hasAnnounceJumpType } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type NavigationProps = {
  isRechargeRecord: boolean;
  handleBack: () => void;
  setActivePage: () => void;
};

const Navigation: FC<NavigationProps> = ({ isRechargeRecord, handleBack, setActivePage }) => {
  const locale = useAppSelector((state) => state.appData.language);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations().recharge;

  useEffect(() => {
    return () => {
      dispatch(setPageLoad(false));
    };
  }, []);

  const closeModal = () => {
    if (localStorage.getItem('redEnvelope')) {
      dispatch(setPrevPage('loginRegister-page'));
      dispatch(setPageLoad(true));
      localStorage.removeItem('prevModal');
      router.push('/');
      return;
    }
    if (isRechargeRecord) {
      handleBack();
    } else if (hasAnnounceJumpType()) {
      dispatch(setPageLoad(true));
      router.push('/');
      setTimeout(() => {
        dispatch(setActiveModal(DATA_MODAL.OTHER_ANNOUNCEMENT));
      }, 200);
    } else if (localStorage.getItem('prev-modal') === 'login-register') {
      localStorage.setItem('recent-modal', 'first_recharge');
      dispatch(setPageLoad(true));
      router.push('/');
    } else {
      if (localStorage.getItem('prevModal') === 'PINDUODUO') {
        localStorage.removeItem('prevModal');
        router.push('invite');
        dispatch(setActiveInviteContent(''));
      } else {
        if (localStorage.getItem('activate_recharge_modal') === '1') {
          localStorage.setItem('recent-modal', 'first_recharge');
        }
        dispatch(setPageLoad(true));
        router.push('/');
      }
    }
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerWrapper}>
        <Image
          src={images.headline}
          alt='header-wrapper'
          fill
          sizes='100%'
        />
      </div>

      <div
        className={styles.historyWrapper}
        onClick={() => router.push('/recharge-record')}
      >
        <div
          className={styles.textWrapper}
          data-lang={locale}
        >
          <p
            data-textafter={t.titleBesidesCopyIcon}
            data-lang={locale}
          >
            {t.titleBesidesCopyIcon}
          </p>

          <div className={styles.border}></div>
        </div>
        <span className={styles.recordIcon}>
          <Image
            src={images.records_icon}
            alt='back-to-deposit'
            fill
            sizes='100%'
          />
        </span>
      </div>

      <div
        className={classNames(styles.IconContainer, 'btn')}
        onClick={closeModal}
      >
        <Image
          src={images.go_back}
          alt='back-to-home'
          fill
          sizes='100%'
        />
      </div>
    </div>
  );
};

export default Navigation;
