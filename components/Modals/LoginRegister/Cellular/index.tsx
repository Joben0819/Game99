import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { DATA_MODAL, VERIFICATION_METHOD } from '@/constants/enums';
import { setActiveModal, setPrevPage } from '@/reducers/appData';
import { setUserInfo } from '@/reducers/userData';
import { getCountryCodes, mobileLogin, sendSmsVerifyCode, sendWhatsAppVerificationCode } from '@/services/api';
import { TCountryCodeResponseData, TCountryCodes } from '@/services/response-type';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import CloseButton from '@/components/Customs/CloseButton';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { useAppDispatch, useAppSelector } from '@/store';
import { getFcmTokenOnLogin, isLoggedIn, setNumbersOnly } from '@/utils/helpers';
import { images } from '@/utils/resources';
import useClickOutSide from '@/hooks/useClickOutSide';
import { useTranslations } from '@/hooks/useTranslations';
import NECaptchaComponent from '../../Captcha/NECaptchaComponent';
import SMSVerification from '../../profile/components/sms-verification';
import { Countdown } from './components/Countdown';
import styles from './index.module.scss';

const Cellular = () => {
  let loginTimeout: NodeJS.Timeout | undefined;
  const dispatch = useAppDispatch();
  const t = useTranslations().login;
  const searchParams = useSearchParams();
  const isAdjust = searchParams.get('link_token');
  const { initData, language } = useAppSelector((state) => state.appData);
  const { userAdid } = useAppSelector((state) => state.userData);
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const [countryCode, setCountryCode] = useState<TCountryCodes>();
  const [countries, setCountries] = useState<TCountryCodeResponseData[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [phoneNum, setPhoneNum] = useState<string>('');
  const [Otp, setOtp] = useState<string>('');
  const [disabled, setDisabled] = useState(false);
  const [warn, setWarn] = useState({ activeNum: false, otpNum: false });
  const [filteredCountries, setFilteredCountries] = useState<TCountryCodes[]>([]);
  const channelCode = localStorage.getItem('channelCode');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const clickOutSide = useClickOutSide(dropdownRef);
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [isCounting, setIsCounting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState(VERIFICATION_METHOD.SMS);

  useEffect(() => {
    fetchCountryCodes();
  }, []);

  useEffect(() => {
    setFilteredCountries(countries);
  }, [countries]);

  useEffect(() => {
    if (clickOutSide) {
      setShowDropdown(false);
    }
  }, [clickOutSide]);

  const fetchCountryCodes = async () => {
    const { code, data } = await getCountryCodes();
    if (code !== 200) return;
    if (data.length <= 0) return;
    setCountries(data.sort((a, b) => a.sort - b.sort).filter((country) => country.sms || country.whatsApp));
    setCountryCode(data.find((i) => i.countryCode === '+62'));
  };

  const handleCaptchaSuccess = (data1: any) => {
    processVerify(data1?.validate);
  };

  const handleCaptchaFailure = () => {
    toast.error('Captcha falhou!');
  };

  const processVerify = (validate?: string) => {
    setDisabled(true);

    if (countryCode?.whatsApp && !countryCode.sms) {
      sendWhatsAppVerificationCode({
        number: countryCode?.countryCode + phoneNum,
        ...(validate ? { validate } : {}),
      }).then((res) => {
        if (res.data.code === 200) {
          toast.success(res.data.msg);
          setIsCounting(true);
        } else {
          toast.error(res.data.msg);
        }
      });
    } else {
      sendSmsVerifyCode({
        phone: (countryCode?.countryCode ?? '+62') + phoneNum,
        ...(validate ? { validate } : {}),
      }).then((res) => {
        if (res.data.code === 200) {
          toast.success(res.data.msg);
          setIsCounting(true);
        } else {
          toast.error(res.data.msg);
        }
      });
    }

    setDisabled(false);
  };

  const loginFn = (token: string) => {
    const fcmToken = localStorage.getItem('fcm-token');
    mobileLogin({
      mobile: countryCode?.countryCode + phoneNum,
      code: Otp!,
      token,
      ...(channelCode ? { channelCode } : {}),
      ...(isAdjust && userAdid ? { adjustId: userAdid } : {}),
      ...(isAdjust ? { isFromAdjust: true } : {}),
      ...(fcmToken ? { fcmToken } : {}),
    }).then((res) => {
      if (res?.data?.code === 200) {
        toast.success(res.data.msg);
        dispatch(setUserInfo(res?.data?.data));
        dispatch(setActiveModal(DATA_MODAL.CLOSE));
        dispatch(setPrevPage('loginRegister-page'));
        setIsLoading(false);
        getFcmTokenOnLogin();
      } else {
        toast.error(res.data.msg);
        setIsLoading(false);
      }
    });
  };

  const generateToken = (data: any) => {
    data.getToken().then((data: any) => {
      const token = data?.token;
      if (data?.code === 200) {
        loginFn(token);
      }
    });
  };

  const initializeGuardian = async () => {
    const NEGuardian = await require('@/scripts/YiDunProtector-Web-2.0.3');
    if (NEGuardian) {
      const neg = NEGuardian({ appId: initData?.productId, timeout: 10000 });
      generateToken(neg);
    }

    setOtp('');
  };

  const phoneLogin = () => {
    clearTimeout(loginTimeout);
    if (!phoneNum || Otp?.length < 6) {
      return setWarn(() => ({
        activeNum: !phoneNum,
        otpNum: Otp?.length < 6,
      }));
    }
    setIsLoading(true);

    loginTimeout = setTimeout(() => {
      initializeGuardian();
    }, 1000);
  };

  const handleSearches = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value.toLowerCase();
    const filteredCountries = countries.filter((country: TCountryCodes) =>
      country.country.toLowerCase().includes(newSearchQuery.toLowerCase()),
    );
    setFilteredCountries(filteredCountries);
  };

  const WarningInput = ({ type }: { type: number }) => {
    return (
      <div className={classNames({
        [styles.warnOtp]: type === 0,
        [styles.warnNum]: type === 1
      })}>
        <Image src={images.warning} alt='warning' sizes='20vw' fill />
      </div>
    );
  };

  return (
    <>
      {showCaptcha && (
        <NECaptchaComponent
          onSuccess={handleCaptchaSuccess}
          onFailure={handleCaptchaFailure}
          captchaId={initData?.captchaId ?? ''}
          showCaptcha={showCaptcha}
          setShowCaptcha={setShowCaptcha}
        />
      )}

      {showVerification && (
        <SMSVerification
          setShowVerification={setShowVerification}
          phoneNumber={phoneNum}
          countryCode={countryCode ? countryCode.countryCode : '+62'}
          setIsCounting={setIsCounting}
          isCounting={isCounting}
          setVerificationMethod={setVerificationMethod}
          verificationMethod={verificationMethod}
        />
      )}

      {(!isBgLoaded || isLoading) && (
        <div className='loader'>
          <LoadingIcon />
        </div>
      )}

      <form
        name='cellular-form'
        className={classNames(styles.modal, {
          [styles.isLoaded]: isBgLoaded,
        })}
      >
        <div className={styles.content}>
          <div className={styles.sizeImg}>
            <Image
              sizes='100vw'
              alt='Login'
              src={images.bg_login_template}
              fill
              priority
              quality={100}
              onLoad={() => setIsBgLoaded(true)}
            />
          </div>

          <div className={styles.Inputs}>
            <div
              className={styles.sizeImg3}
              data-lang={language}
            >
              {t.phoneHeader}
            </div>
            <motion.div
              className={styles.sizeImg4}
              whileTap={{ scale: 0.8 }}
              data-lang={language}
            >
              <CloseButton
                onClick={() => {
                  dispatch(setActiveModal(DATA_MODAL.CLOSE));
                  if (!isLoggedIn()) {
                    dispatch(setActiveModal(DATA_MODAL.LOGIN_MODAL));
                  }
                }}
              />
            </motion.div>
            <div
              className={classNames(styles.phoneNumber, {
                [styles['phoneNumber--warn']]: warn.activeNum
              })}
            >
              {warn.activeNum && <WarningInput type={1} />}
              <div className={styles.flagWrapper}>
                <div className={styles.inputNumberContainer}>
                  <div
                    className={styles.flagButtonContainer}
                    onClick={() => {
                      !disabled && setShowDropdown((prev) => !prev);
                    }}
                  >
                    {countryCode?.countryCode}
                  </div>
                  <div
                    ref={dropdownRef}
                    className={classNames(styles.dropdownContainer, {
                      [styles['dropdownContainer--show']]: showDropdown
                    })}>
                    <div className={styles.dropdownItems}>
                      <div className={styles.searchWrapper}>
                        <Image
                          className={styles.searchIcon}
                          src={images.search}
                          alt='search'
                          width={30}
                          height={30}
                        />
                        <input
                          type='text'
                          className={styles.searchInput}
                          placeholder={t.searchCountry}
                          onChange={(e) => handleSearches(e)}
                        />
                      </div>
                      {filteredCountries.map((data, index) => (
                        <div
                          key={index}
                          className={classNames(styles.dropdownItem, {
                            [styles['dropdownItem--active']]: countryCode?.countryCode === data?.countryCode
                          })}
                          onClick={() => {
                            setCountryCode(data);
                            setShowDropdown((prev) => !prev);
                            setPhoneNum('');
                          }}
                        >
                          <span>{data?.country}</span>
                          <span className={styles.countryCode}>{data?.countryCode}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <input
                type='text'
                id='tab1'
                onChange={(e) => {
                  setWarn((prevState) => ({
                    ...prevState,
                    activeNum: e.target.value === '',
                  }));
                  setNumbersOnly(e, setPhoneNum);
                }}
                placeholder={t.mobilePlaceholder}
                className={styles.mobileNum}
                maxLength={20}
                value={phoneNum}
                data-lang={language}
                disabled={disabled}
              />
            </div>

            <div className={styles.otpWrapper}>
              {warn.otpNum && <WarningInput type={0} />}
              <input
                type='text'
                placeholder={t.mobileOTPlaceholder}
                value={Otp}
                maxLength={6}
                onChange={(e) => {
                  setWarn((prevState) => ({
                    ...prevState,
                    otpNum: e.target.value === '',
                  }));
                  setNumbersOnly(e, setOtp);
                }}
                className={classNames(styles.enterOtp, {
                  [styles['enterOtp--warn']]: warn.otpNum
                })}/>
              <Countdown
                disabled={disabled}
                isCounting={isCounting}
                setDisabled={setDisabled}
                setIsCounting={setIsCounting}
                onClick={() => {
                  if (phoneNum?.length === 0) {
                    setWarn((prevState) => ({
                      ...prevState,
                      activeNum: true,
                      otpNum: true,
                    }));
                    return;
                  }

                  if (countryCode?.sms && countryCode.whatsApp) {
                    setShowVerification(true);
                  } else {
                    if (initData?.actionSwitch === '1') {
                      setShowCaptcha(true);
                    } else {
                      processVerify();
                    }
                  }
                }}
              />
            </div>
            <motion.div
              className={styles.loginButton}
              whileTap={{ scale: 0.9 }}
              onClick={phoneLogin}
            >
              {t.login}
            </motion.div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Cellular;
