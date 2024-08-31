'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { LANGUAGES } from '@/constants/app';
import { APK_EVENT, BIND_BONUS, DATA_MODAL, LOGIN_MODAL } from '@/constants/enums';
import {
  setActiveModal,
  setAddToHomeShown,
  setFourthModal,
  setLanguage,
  setPrevPage,
  setShowLoginModal,
} from '@/reducers/appData';
import { resetPaymentData } from '@/reducers/paymentData';
import { setUserInfo } from '@/reducers/userData';
import { loginDevice, storeLang } from '@/services/api';
import { TNewLoginMethodsDataList } from '@/services/response-type';
import { TLanguage } from '@/services/types';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { debounce } from 'lodash-es';
import CloseButton from '@/components/Customs/CloseButton';
import { ImgWithFallback } from '@/components/Customs/ImgWithFallback';
import LoadingIcon from '@/components/Customs/LoadingIcon';
// import { Pixel } from '@framit/meta-pixel';
import { useAppSelector } from '@/store';
import {
  getFcmTokenOnLogin,
  getGoogleLoginLink,
  isIOSChrome,
  isIOSSafari,
  isMobilePlatform,
  isiOSStandaloneMode,
  moneyFormat,
  triggerApkEvent,
} from '@/utils/helpers';
import { images } from '@/utils/resources';
import useClickOutSide from '@/hooks/useClickOutSide';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import NECaptchaComponent from '../Captcha/NECaptchaComponent';
import ConnectionError from './ConnectionError';
import styles from './index.module.scss';

const LoginModal = () => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { getAccountUserInfo, getNewLoginMethods } = useWithDispatch();
  const isAdjust = searchParams.get('link_token');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const { userAdid } = useAppSelector((state) => state.userData);
  const { loginMethodList, initData, addToHomeShown } = useAppSelector((state) => state.appData);
  const language = useAppSelector((state) => state.appData?.language);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const clickOutSide = useClickOutSide(dropDownRef);

  useEffect(() => {
    if ((isIOSSafari() || isIOSChrome()) && isMobilePlatform() && !isiOSStandaloneMode() && !addToHomeShown) {
      dispatch(setFourthModal(DATA_MODAL.ADD_TO_HOME));
      dispatch(setAddToHomeShown(true));
    }
    setDefaultLanguage();
  }, []);

  useEffect(() => {
    if (clickOutSide) {
      setShowLanguageDropdown(false);
    }
  }, [clickOutSide]);

  const buttonControls: any = {
    BIND_DEVICE_BONUS: {
      name: t.loading.loginDevice,
      bg: images.guest_login_btn,
      display: loginMethodList?.dataList?.some((method) => method.type === BIND_BONUS.DEVICE),
      redirectTo: () => loginGuest(),
    },
    BIND_PHONE_BONUS: {
      name: t.loading.loginCell,
      bg: images.mobile_login_btn,
      display: loginMethodList?.dataList?.some((method) => method.type === BIND_BONUS.PHONE),
      redirectTo: () => dispatch(setActiveModal(DATA_MODAL.PHONE)),
    },
    BIND_GOOGLE_BONUS: {
      name: t.loading.loginGoogleBtn,
      bg: images.google_login_btn,
      display: loginMethodList?.dataList?.some((method) => method.type === BIND_BONUS.GOOGLE),
      redirectTo: () => (window.location.href = getGoogleLoginLink()),
    },
    BIND_EMAIL_BONUS: {
      name: t.loading.loginGoogle,
      bg: images.google_login_btn,
      display: loginMethodList?.dataList?.some((method) => method.type === BIND_BONUS.EMAIL),
      redirectTo: () => {
        dispatch(setActiveModal(DATA_MODAL.LOGIN));
        dispatch(setShowLoginModal(LOGIN_MODAL.LOGIN));
      },
    },
    BIND_GOOGLE_EMAIL_BONUS: {
      name: t.loading.loginGoogle,
      bg: images.google_login_btn,
      display: loginMethodList?.dataList?.some((method) => method.type === BIND_BONUS.GOOGLE_EMAIL),
      redirectTo: () => {
        dispatch(setActiveModal(DATA_MODAL.LOGIN));
        dispatch(setShowLoginModal(LOGIN_MODAL.LOGIN));
      },
    },
  };

  const initializeGuardian = async (validate?: string) => {
    const NEGuardian = await require('@/scripts/YiDunProtector-Web-2.0.3');
    if (NEGuardian) {
      const channelCode = localStorage.getItem('channelCode');
      const ip = localStorage.getItem('ip');
      const neg = NEGuardian({ appId: initData?.productId, timeout: 10000 });
      neg.getToken().then((data: any) => {
        if (data?.code === 200) {
          const fcmToken = localStorage.getItem('fcm-token');
          loginDevice({
            ...(channelCode ? { channelCode } : {}),
            ...(ip ? { ip } : {}),
            ...(validate ? { validate } : {}),
            ...(isAdjust && userAdid ? { adjustId: userAdid } : {}),
            ...(isAdjust ? { isFromAdjust: true } : {}),
            ...(fcmToken ? { fcmToken } : {}),
            token: data?.token,
          })
            .then(async (res) => {
              if (res?.data?.code === 200) {
                dispatch(setUserInfo(res?.data?.data));
                dispatch(setActiveModal(DATA_MODAL.CLOSE));
                toast.success(res?.data?.msg ?? t.common.success);
                dispatch(setPrevPage('loginRegister-page'));
                // dispatch(setPrevPage('pinduoduo'));
                // Pixel.trackCustom('LoginDevice', {});
              } else {
                toast.error(res?.data?.msg);
              }
            })
            .finally(() => {
              setIsDisabled(false);
              setIsLoading(false);
              getAccountUserInfo();
              getFcmTokenOnLogin();
            });
        }
      });
    }
  };

  const loginGuest = () => {
    const debouncedLogin = debounce(() => {
      setIsLoading(true);
      if (+initData?.actionDeviceLogin === 1) {
        setShowCaptcha(true);
      } else {
        if (typeof window !== 'undefined' && !isDisabled) {
          setIsDisabled(true);
          initializeGuardian();
        }
      }
    }, 3000);

    debouncedLogin();
  };

  const handleLoginCLick = (control: TNewLoginMethodsDataList) => {
    setIsLoading(true);
    if (!showLanguageDropdown && !isDisabled) {
      triggerApkEvent(APK_EVENT.LOGIN);
      buttonControls[control.type].redirectTo();
    }
  };

  const toggleDropdown = () => setShowLanguageDropdown(!showLanguageDropdown);

  const handleSelectClick = async (lang: TLanguage) => {
    storeLang(lang.locale);
    localStorage.setItem('lang', lang.locale);
    dispatch(setLanguage(lang.locale));
    dispatch(resetPaymentData());
    getNewLoginMethods();
    setSelectedLanguage(lang);
    setShowLanguageDropdown(false);
  };

  const setDefaultLanguage = () => {
    const userLanguage = LANGUAGES.find((lang) => lang.code === 'id-ID');
    if (!localStorage.getItem('lang')) {
      localStorage.setItem('lang', userLanguage !== undefined ? userLanguage.locale : LANGUAGES[0].locale);
      storeLang(userLanguage !== undefined ? userLanguage.locale : LANGUAGES[0].locale);
      setSelectedLanguage(userLanguage !== undefined ? userLanguage : LANGUAGES[0]);
    } else {
      const lang = LANGUAGES.find((lang) => lang.locale === localStorage.getItem('lang'))!;
      setSelectedLanguage(lang);
    }
  };

  const renderBonus = (m: number) => (
    <div className={styles.bonusNoti}>
      <div className={styles.coinIcon}>
        <ImgWithFallback
          sizes='(max-width: 100vw) 100vw'
          alt='logo'
          src={images.bonus_coin ?? ''}
          fill
          quality={100}
          priority
        />
      </div>
      <span>+{moneyFormat(m ? m : 0, true)}</span>
    </div>
  );

  const renderCaptcha = () => {
    return (
      showCaptcha && (
        <NECaptchaComponent
          onSuccess={({ validate }) => initializeGuardian(validate)}
          onFailure={() => toast.error(t.toasts.captchaFailed)}
          captchaId={initData?.captchaId ?? ''}
          showCaptcha={showCaptcha}
          setShowCaptcha={setShowCaptcha}
        />
      )
    );
  };

  return (
    <>
      {renderCaptcha()}
      <div className={styles.modalWrapper}>
        {!isBgLoaded ||
          (isLoading && (
            <div className='loader'>
              <LoadingIcon />
            </div>
          ))}
        <div
          className={classNames(styles.modalContainer, {
            [styles.isLoaded]: isBgLoaded,
          })}
        >
          <div className={styles.bgContainer}>
            <CloseButton
              className={styles.closeBtn}
              onClick={() => dispatch(setActiveModal(DATA_MODAL.CLOSE))}
            />
          </div>
          <div className={styles.contents}>
            <Image
              sizes='100vw'
              alt='Login'
              src={images.login_bg}
              fill
              priority
              quality={100}
              onLoad={() => setIsBgLoaded(true)}
            />
            <div
              className={styles.languageDropdown}
              ref={dropDownRef}
            >
              <span className={styles.dropdownLabel}>{t.login.language}:</span>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={styles.dropdown}
                onClick={toggleDropdown}
              >
                <span
                  className={styles.flag}
                  style={{ backgroundImage: `url(${selectedLanguage?.icon})` }}
                />
                <span className={styles.locale}>{selectedLanguage?.text}</span>
                <span
                  className={styles.dropdownIcon}
                  onClick={toggleDropdown}
                />
              </motion.div>
            </div>
            <AnimatePresence>
              {showLanguageDropdown && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{
                    duration: 0.2,
                  }}
                  className={styles.dropdownContainer}
                >
                  <div className={styles.dropdownList}>
                    {LANGUAGES?.map((lang) => {
                      return (
                        <div
                          key={lang?.text}
                          className={classNames(styles.dropdownItem, { [styles.active]: lang.locale === language })}
                          onClick={() => handleSelectClick(lang)}
                        >
                          <span
                            className={styles.flag}
                            style={{ backgroundImage: `url(${lang?.icon})` }}
                          />
                          <span className={styles.locale}>{lang?.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className={classNames(styles.buttonGroup, {
                [styles.noLoginMethods]: loginMethodList?.dataList?.length < 1,
              })}
            >
              {loginMethodList?.dataList?.length < 1 && <ConnectionError />}
              {loginMethodList?.dataList?.map((control, index) => {
                return (
                  <motion.div
                    key={index}
                    whileTap={!showLanguageDropdown ? { scale: 0.9 } : {}}
                    className={classNames(styles.btn, {
                      [styles['btn--indexOne']]: index === 1,
                      [styles['btn--cn']]: language === 'cn',
                      [styles['btn--in']]: language === 'in',
                    })}
                    onClick={() => handleLoginCLick(control)}
                    style={{
                      backgroundImage: `url(${buttonControls[control?.type]?.bg})`,
                      display: `${buttonControls[control?.type]?.display ? 'flex' : 'none'}`,
                    }}
                  >
                    {control?.money > 0 && renderBonus(control?.money)}
                    <span
                      className={classNames(styles.btnText, {
                        [styles['btnText--cnEn']]: language === 'cn' || language === 'en',
                      })}
                      data-control-name={control?.type}
                    >
                      {buttonControls[control?.type]?.name}
                    </span>
                  </motion.div>
                );
              })}
              <span
                key={'version'}
                className={styles.appVersion}
              >
                v{process.env.APP_VERSION}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
