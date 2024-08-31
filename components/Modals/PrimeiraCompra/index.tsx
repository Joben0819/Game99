import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal, setSecondModal, setThirdModal } from '@/reducers/appData';
import { setPageLoad } from '@/reducers/appData';
import { configBonus, getActivityTypes } from '@/services/api';
import { TConfigBonusResponseData } from '@/services/response-type';
import classNames from 'classnames';
import CSVGA from '@/components/Customs/CSVGA';
import HeaderTitle from '@/components/Customs/HeaderTitle';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { useAppDispatch, useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const FirstRecharge = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const router = useRouter();
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((s) => s.userData);
  const { activeModal, secondModal, otherDialogAnnouncementsData } = useAppSelector((state) => state.appData);
  const [bonusData, setBonusData] = useState<TConfigBonusResponseData[]>([]);
  const [isLoadedBG, setIsLoadedBG] = useState<boolean>(false);

  useEffect(() => {
    configBonus().then(({ code, data }) => {
      if (code === 200) {
        setBonusData(data);
        setIsLoadedBG(true);
      }
    });
    return () => {
      dispatch(setPageLoad(false));
    };
  }, []);

  useEffect(() => {
    if (!(userInfo?.accountCharge === 0)) {
      closeModal();
    }
  }, [userInfo]);

  const isSVGAloaded = () => {
    setIsLoadedBG(true);
  };

  const removeLocalStorage = () => {
    localStorage.removeItem('prev-modal');
    localStorage.removeItem('activate_recharge_modal');
  };

  const closeModal = () => {
    if (localStorage.getItem('recent-modal') === 'vip') {
      dispatch(setActiveModal(DATA_MODAL.VIP));
    } else if (localStorage.getItem('recent-modal') === 'activities') {
      dispatch(setActiveModal(DATA_MODAL.ACTIVITIES));
    } else if (localStorage.getItem('prev-modal') === 'header-recharge') {
      removeLocalStorage();
      checkModal();
    } else if (localStorage.getItem('prev-modal') === 'login-register') {
      callOtherAnnouncements();
      removeLocalStorage();
      // } else if (localStorage.getItem('prev-modal') === 'first-recharge') {
      //   callOtherAnnouncements();
      //   removeLocalStorage();
    } else {
      checkModal();
    }
  };

  const callOtherAnnouncements = () => {
    if (!!otherDialogAnnouncementsData?.length) {
      dispatch(setSecondModal(DATA_MODAL.OTHER_ANNOUNCEMENT));
      dispatch(setActiveModal(DATA_MODAL.CLOSE));
    } else {
      checkModal();
    }
  };

  const checkModal = () => {
    activeModal === DATA_MODAL.FIRST_RECHARGE
      ? dispatch(setActiveModal(DATA_MODAL.CLOSE))
      : secondModal === DATA_MODAL.FIRST_RECHARGE
        ? dispatch(setSecondModal(DATA_MODAL.CLOSE))
        : dispatch(setThirdModal(DATA_MODAL.CLOSE));
  };

  const handleEventClick = async (typeId: number) => {
    const { data } = await getActivityTypes();
    const selectedEvent = data.find((item) => item.id === typeId);

    if (selectedEvent?.id) {
      localStorage.setItem('activityTypes', JSON.stringify(data));
      localStorage.setItem('banner-clicked', String(typeId));
      dispatch(setActiveModal(DATA_MODAL.ACTIVITIES));
    } else router.push('/recharge');

    if (localStorage.getItem('prev-modal') !== 'header-recharge') {
      localStorage.setItem('prev-modal', 'first-recharge');
    }
  };

  const renderHeader = () => (
    <>
      <HeaderTitle
        text={t.firstRecharge.firstRecharge}
        className={styles.primeiraContainer__titleText}
        size={26}
      />
      <div
        className={classNames(styles.primeiraContainer__closeButton, 'transition-all')}
        onClick={closeModal}
        data-lang={locale}
      >
        <Image
          src={images.announcement_close_btn}
          sizes='(max-width: 100vw) 100vw'
          alt='close-button'
          fill
          quality={100}
        />
      </div>
    </>
  );

  const renderPrimeiraContent = () => {
    if (bonusData.length > 1) {
      return (
        <div className={styles.primeiraContainer__contentContainer}>
          <div className={styles.primeiraContainer__leftContent}>
            <div className={styles.primeiraContainer__svgaContainer}>
              <CSVGA
                src={images.svga_first_purchase}
                isSVGALoaded={isSVGAloaded}
              />
            </div>
          </div>
          <div className={styles.primeiraContainer__rightContent}>
            <ul>
              {bonusData &&
                bonusData.map((item: TConfigBonusResponseData, index: number) => (
                  <li key={index}>
                    <Image
                      src={images.first_purchase_battery}
                      width={50}
                      height={31}
                      alt='first purchase battery'
                    />
                    <div>
                      <span>{t.firstRecharge.rechargeOver}</span>
                      <span className={styles['primeiraContainer--redText']}>{item.minAmount}</span>
                      <span>{locale != 'cn' && ', '}</span>
                      <br />
                      <span> {t.firstRecharge.get}</span>
                      <span
                        className={classNames(styles['primeiraContainer--redText'], styles.free)}
                        data-locale={locale}
                        data-sequence-text={`${t.firstRecharge.free}`}
                      >{` ${bonusData[0]?.bonus}% `}</span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div
        className={classNames(styles.primeiraContainer__contentContainer, {
          [styles['primeiraContainer__contentContainer--oneBonus']]: bonusData.length < 2,
        })}
        onClick={() =>
          bonusData[0].activityTypeId ? handleEventClick(bonusData[0].activityTypeId) : router.push('/recharge')
        }
      >
        {bonusData && (
          <div
            className={styles.primeiraContainer__oneBonus}
            data-locale={locale}
          >
            <Image
              src={images.first_purchase_battery}
              width={50}
              height={31}
              alt='first purchase battery'
            />
            <div>
              <span>{t.firstRecharge.rechargeOver}</span>
              <span className={styles['primeiraContainer--redText']}> {bonusData[0]?.minAmount}</span>
              <span>{locale != 'cn' && ', '}</span>
              <span> {t.firstRecharge.get}</span>
              <span
                className={classNames(styles['primeiraContainer--redText'], styles.free)}
                data-locale={locale}
                data-sequence-text={`${t.firstRecharge.free}`}
              >{` ${bonusData[0]?.bonus}% `}</span>
            </div>
          </div>
        )}
        <div className={classNames(styles.primeiraContainer__details, 'btn')}>
          <span>{t.firstRecharge.details}</span>
        </div>
        <div
          className={classNames(styles.primeiraContainer__svgaContainer, {
            [styles['primeiraContainer__svgaContainer--oneBonus']]: bonusData.length < 2,
          })}
        >
          <CSVGA
            src={images.svga_first_purchase}
            isSVGALoaded={isSVGAloaded}
          />
        </div>
      </div>
    );
  };

  const renderButton = () => (
    <div
      className={classNames(styles.primeiraContainer__buttonContainer, 'btn')}
      onClick={() => {
        if (
          localStorage.getItem('prev-modal') === 'login-register' ||
          localStorage.getItem('prev-modal') === 'header-recharge'
        ) {
          localStorage.setItem('activate_recharge_modal', '1');
        }
        dispatch(setPageLoad(true));
        router.push('/recharge');
      }}
    >
      <Image
        src={images.first_purchase_btn}
        sizes='(max-width: 100vw) 100vw'
        alt='recharge-button'
        fill
        quality={100}
      />

      <div className={styles.primeiraContainer__rechargeWrapper}>
        <span>{t.payment.recharge}</span>
      </div>
    </div>
  );

  const renderContent = () => {
    if (!isLoadedBG) {
      return (
        <div className={classNames(styles.primeiraBackdrop, '!opacity-100')}>
          <LoadingIcon />
        </div>
      );
    }

    return (
      <div className={styles.primeiraContainer}>
        {renderHeader()}
        {renderPrimeiraContent()}
        {renderButton()}
      </div>
    );
  };

  return <div className={styles.primeiraBackdrop}>{renderContent()}</div>;
};

export default FirstRecharge;
