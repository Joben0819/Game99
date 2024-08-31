import { usePathname } from 'next/navigation';
import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BIND_BONUS, DATA_MODAL } from '@/constants/enums';
import {
  bindMobilePhone,
  getCountryCodes,
  registerCode,
  sendSmsVerifyCode,
  sendWhatsAppVerificationCode,
  verifyEmailCode,
} from '@/services/api';
import { TBonusByType, TCountryCodes } from '@/services/response-type';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@/components/Customs/Button';
import NECaptchaComponent from '@/components/Modals/Captcha/NECaptchaComponent';
import { PING_FANG } from '@/public/fonts/PingFang';
import { useAppSelector } from '@/store';
import { emailValidator, getGoogleLoginLink, moneyFormat, setNumbersOnly, toRem } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import { luckiest_guy } from '../..';
import styles from '../profile-form/index.module.scss';

type BindProps = {
  currentView: string;
  phoneNumber: string;
  isCounting: boolean;
  countryCode: string;
  setView: (data: string) => void;
  getOneTimePass: (otp: string) => void;
  getInputtedEmail: (email: string) => void;
  setIsCounting: React.Dispatch<React.SetStateAction<boolean>>;
  setCountryCode: React.Dispatch<React.SetStateAction<string>>;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  setShowVerification: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Bind: FC<BindProps> = ({
  currentView,
  phoneNumber,
  isCounting,
  countryCode,
  setView,
  getOneTimePass,
  getInputtedEmail,
  setIsCounting,
  setCountryCode,
  setPhoneNumber,
  setShowVerification,
}) => {
  const t = useTranslations();
  const { getAccountUserInfo, getNewLoginMethods } = useWithDispatch();
  const {
    activeModal,
    initData,
    language,
    loginMethodList: { displayIcon, dataList },
  } = useAppSelector((state) => state.appData);
  const { userInfo } = useAppSelector((state) => state.userData);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [country, setCountry] = useState<TCountryCodes>();
  const [countries, setCountries] = useState<TCountryCodes[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<TCountryCodes[]>([]);
  const [phoneBonus, setPhoneBonus] = useState<TBonusByType>();
  const [emailBonus, setEmailBonus] = useState<TBonusByType>();
  const [searchQuery, setSearchQuery] = useState('');
  const [defaultCountryCode, setDefaultCountryCode] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [phoneInputState, setPhoneInputState] = useState('UNTOUCHED');
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [phoneTyping, setPhoneTyping] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [codeTyping, setCodeTyping] = useState(false);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (localStorage.getItem('inputtedEmail') && localStorage.getItem('oneTimePass')) {
      const email = localStorage.getItem('inputtedEmail');
      const otp = localStorage.getItem('oneTimePass');
      setEmail(email!);
      setCode(otp!);
    }
    setEmail('');
    setCode('');
    activeModal === DATA_MODAL.BIND_PHONE && fetchAllCountries();
  }, []);

  useEffect(() => {
    fetchBonus();
  }, [activeModal]);

  useEffect(() => {
    if (activeModal === DATA_MODAL.BIND_PHONE) {
      if (!showDropdown) setSearchQuery('');
    }
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowDropdown(false);
        setFilteredCountries(countries);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    validateNumberFormat();
  }, [phoneNumber]);

  useEffect(() => {
    validateCodeFormat();
  }, [code]);

  useEffect(() => {
    setFilteredCountries(countries);
    const filteredDefaultCountry = countries.filter((data: TCountryCodes) => data.country === 'Indonesia');
    setDefaultCountryCode(filteredDefaultCountry[0]?.countryCode);
  }, [countries, language]);

  useEffect(() => {
    let intervalId: any;
    if (isCounting && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
      }, 1000);
    } else if (seconds === 0) {
      setIsCounting(false);
      setSeconds(60);
    }
    return () => clearInterval(intervalId);
  }, [isCounting, seconds]);

  const fetchAllCountries = async () => {
    const res = await getCountryCodes();
    if (res.code === 200) {
      setCountries(res?.data.sort((a, b) => a.sort - b.sort).filter((country) => country.sms || country.whatsApp));
      setCountry(res?.data.find((i) => i.countryCode === countryCode));
    }
  };

  const fetchBonus = async () => {
    if (pathname === '/personal-center') {
      if (!dataList) return;
      const pBonus = dataList?.find((method) => method?.type === BIND_BONUS.PHONE);
      const eBonus = dataList?.find(
        (method) => method?.type === BIND_BONUS.EMAIL || method?.type === BIND_BONUS.GOOGLE_EMAIL,
      );
      setPhoneBonus(pBonus);
      setEmailBonus(eBonus);
    } else {
      if (displayIcon && displayIcon?.type === BIND_BONUS.PHONE) {
        setPhoneBonus(displayIcon);
      } else if (
        (displayIcon && displayIcon?.type === BIND_BONUS.EMAIL) ||
        (displayIcon && displayIcon?.type === BIND_BONUS.GOOGLE_EMAIL)
      ) {
        setEmailBonus(displayIcon);
      }
    }
  };

  const handleCaptchaSuccess = (data1: any) => {
    handleSendCode(data1?.validate);
  };

  const handleCaptchaFailure = (err: any) => {
    toast.error(t.bindToastMessages.captchaFailed);
  };

  const initiateBinding = async () => {
    if (activeModal === DATA_MODAL.BIND_PHONE) {
      try {
        const res = await bindMobilePhone({ mobile: countryCode + phoneNumber, code });

        if (res?.data?.code === 200) {
          getAccountUserInfo();
          setSubmitted(true);
          setView('success');
          toast.success(res?.data?.msg);
          getNewLoginMethods();
        } else if (res?.data?.code === 405) {
          toast.error(t.bindToastMessages.phoneAlreadyRegistered);
        } else {
          toast.error(res?.data?.msg);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.message);
        }
      }
    }
    if (activeModal === DATA_MODAL.BIND_EMAIL || activeModal === DATA_MODAL.BIND_GOOGLE_EMAIL_BONUS) {
      if (code.length > 6 || code.length < 6 || codeError) {
        toast.error(t.bindToastMessages.incorrectCodeFormat);
      } else {
        try {
          const res = await verifyEmailCode({ email, code });
          if (res?.data?.code == 200) {
            // success
            setSubmitted(true);
            getInputtedEmail(email);
            getOneTimePass(code);
            setView('password');
            toast.success(res?.data?.msg);
          } else if (res?.data?.code == 405) {
            // incorrect code or expired
            toast.error(res?.data?.msg);
          } else {
            // error
            toast.error(res?.data?.msg);
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            toast.error(error.message);
          }
        }
      }
    }
  };

  const handleInitiateBinding = () => {
    if (!submitted) {
      setSubmitted(true);
      initiateBinding();

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement> | null, buttonType: string) => {
    e?.preventDefault();

    if (buttonType === 'googleLogin') {
      window.location.href = getGoogleLoginLink();
      return;
    }

    if (activeModal === DATA_MODAL.BIND_EMAIL || activeModal === DATA_MODAL.BIND_GOOGLE_EMAIL_BONUS) {
      if (!emailError && email !== '' && code != '') {
        handleInitiateBinding();
      } else {
        if (!emailValidator(email)) {
          setEmailError(true);
        }
        if (!!!code?.length || code?.length < 6) {
          setCodeError(true);
        }
      }
    }
    if (activeModal === DATA_MODAL.BIND_PHONE) {
      if (!phoneError && !!phoneNumber.length && !!code.length) {
        handleInitiateBinding();
      } else {
        if (!phoneNumber.length) {
          setPhoneError(true);
        }
        if (!!!code?.length || code?.length < 6) {
          setCodeError(true);
        }
      }
    }
  };

  const handleSendCode = (validate?: string) => {
    if (activeModal === DATA_MODAL.BIND_PHONE) {
      if (country?.whatsApp && !country.sms) {
        sendWhatsAppVerificationCode({
          number: country?.countryCode + phoneNumber,
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
        sendSmsVerifyCode({ phone: countryCode + phoneNumber, ...(validate ? { validate } : {}) }).then((res) => {
          if (res.data.code === 200) {
            toast.success(res.data?.msg ?? t.bindToastMessages.codeSentToPhoneSuccess);
            if (!isCounting) {
              setIsCounting(true);
            }
          } else {
            toast.error(res.data?.msg ?? t.bindToastMessages.codeSentToPhoneError);
          }
        });
      }
    }
    if (activeModal === DATA_MODAL.BIND_EMAIL || activeModal === DATA_MODAL.BIND_GOOGLE_EMAIL_BONUS) {
      registerCode({ email, ...(validate ? { validate } : {}) }).then((res) => {
        if (res.data.code === 200) {
          toast.success(t.toasts.verificationCodeSent);
          if (!isCounting) {
            setIsCounting(true);
          }
        } else {
          toast.error(res.data.msg);
        }
      });
    }
  };

  const validateFields = () => {
    const isBindPhone = activeModal === DATA_MODAL.BIND_PHONE && phoneNumber !== '';
    const isBindEmail =
      [DATA_MODAL.BIND_EMAIL, DATA_MODAL.BIND_GOOGLE_EMAIL_BONUS].includes(activeModal as DATA_MODAL) &&
      emailValidator(email);

    if (!!isBindPhone) {
      if (country?.sms && country?.whatsApp) {
        setShowVerification(true);
      } else {
        initData.actionSwitch === '1' ? setShowCaptcha(true) : handleSendCode();
      }
    } else if (!!isBindEmail) {
      initData.actionSwitch === '1' ? setShowCaptcha(true) : handleSendCode();
    } else {
      const errorMessage = email ? t.bindToastMessages.invalidEmail : t.bindToastMessages.necessaryFields;
      toast.error(errorMessage, { id: email ? undefined : 'error' });

      setPhoneError(true);
      setEmailError(true);
    }
  };

  const validateNumberFormat = () => {
    const numberRegex = /^[0-9]+$/;
    if (!numberRegex.test(phoneNumber) && phoneNumber !== '') {
      const timer = setTimeout(() => {
        setPhoneError(true);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setPhoneError(false);
    }
  };

  const validateCodeFormat = () => {
    const numberRegex = /^[0-9]+$/;
    if (!numberRegex.test(code) && code !== '') {
      const timer = setTimeout(() => {
        setCodeError(true);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setCodeError(false);
    }
  };

  const handleOnchangePhone = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneTyping(true);
    setPhoneInputState('TOUCHED');
    setNumbersOnly(e, setPhoneNumber);
  };

  const triggerPhoneError = () => {
    if (phoneInputState === 'TOUCHED' && phoneNumber === '') {
      setPhoneError(true);
    }
  };

  const handleSearches = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value.toLowerCase();
    const filteredCountries = countries.filter((country) =>
      country.country.toLowerCase().includes(newSearchQuery.toLowerCase()),
    );

    setSearchQuery(newSearchQuery);
    setFilteredCountries(filteredCountries);
  };

  const stringWithoutText = (string: string) => {
    return string.replace(/\d+/g, '').replace(', IDR', '');
  };

  const renderBonusDesc = (t: string, money: number, isBindPhone: boolean = false) => (
    <div
      className={classNames([styles.bindBonus, { [styles.bindHeader]: isBindPhone }])}
      data-lang={language}
    >
      <div className={styles.description}>
        <span>{stringWithoutText(t)}</span>
        <span className={styles.bonus}>{moneyFormat(money)} IDR</span>
      </div>
    </div>
  );

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

      <form
        onSubmit={(e) => handleSubmit(e, 'submit')}
        className={styles.bindFormWrapper}
      >
        <div className={styles.bindForm}>
          <h2 className={classNames(styles.formTitle, luckiest_guy.className)}>
            {[DATA_MODAL.BIND_EMAIL, DATA_MODAL.BIND_GOOGLE_EMAIL_BONUS].includes(activeModal as DATA_MODAL)
              ? `${t.bindEmail.modalTitle}`
              : `${t.bindPhone.modalTitle}`}
          </h2>

          {activeModal === DATA_MODAL.BIND_PHONE &&
            !!phoneBonus?.money &&
            !!!userInfo?.phone &&
            currentView === 'bind' &&
            renderBonusDesc(phoneBonus?.description, phoneBonus.money, true)}
          {[DATA_MODAL.BIND_EMAIL, DATA_MODAL.BIND_GOOGLE_EMAIL_BONUS].includes(activeModal as DATA_MODAL) &&
            !!emailBonus?.money &&
            !!!userInfo?.email &&
            currentView === 'bind' &&
            renderBonusDesc(emailBonus?.description, emailBonus.money)}
          {activeModal === DATA_MODAL.BIND_PHONE && (
            <>
              <div
                className={classNames(styles.phoneInput, {
                  [styles.counting]: isCounting,
                  [styles.error]: phoneError,
                })}
              >
                <div
                  className={styles.dropdownSection}
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  <span className={styles.countryCode}>{countryCode === '' ? defaultCountryCode : countryCode}</span>
                </div>
                <input
                  className={classNames(styles.phone, PING_FANG.className)}
                  type='text'
                  disabled={isCounting}
                  value={phoneNumber}
                  placeholder={t.bindPhone.phoneInputPlaceholder}
                  onChange={handleOnchangePhone}
                  maxLength={20}
                  onBlur={() => {
                    if (phoneTyping) {
                      validateNumberFormat();
                      setPhoneTyping(false);
                      triggerPhoneError();
                    }
                  }}
                />
                <span
                  className={classNames(styles.errorIcon, {
                    [styles['errorIcon--phone']]: phoneError,
                  })}
                />

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ height: 0, overflow: 'hidden', padding: 0 }}
                      animate={{ height: 'auto', padding: toRem(5) }}
                      exit={{ height: 0, padding: 0 }}
                      transition={{
                        duration: 0.2,
                        ease: 'easeInOut',
                      }}
                      className={styles.dropdownContainer}
                      ref={dropdownRef}
                    >
                      <div className={styles.searchField}>
                        <span className={styles.searchIcon} />
                        <input
                          className={styles.searchInput}
                          type='text'
                          placeholder={t.bindPhone.searchCountry}
                          value={searchQuery}
                          onChange={(e) => handleSearches(e)}
                        />
                      </div>
                      <div className={styles.dropdownItems}>
                        {filteredCountries.map((data, index) => (
                          <div
                            className={classNames(styles.dropdownItem, {
                              [styles['dropdownItem--active']]: countryCode === data?.countryCode,
                            })}
                            key={index}
                            onClick={() => {
                              setCountry(data);
                              setCountryCode(data?.countryCode);
                              setPhoneNumber('');
                              setShowDropdown(false);
                            }}
                          >
                            <span>{data.country}</span>
                            <span className={styles.countryCode}>{data?.countryCode}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
          {[DATA_MODAL.BIND_EMAIL, DATA_MODAL.BIND_GOOGLE_EMAIL_BONUS].includes(activeModal as DATA_MODAL) && (
            <div
              className={classNames(styles.emailInput, PING_FANG.className, {
                [styles.counting]: isCounting,
                [styles.error]: emailError,
              })}
            >
              <input
                className={classNames(styles.email, PING_FANG.className)}
                type='text'
                disabled={isCounting}
                value={email}
                placeholder={t.bindEmail.emailInputPlaceholder}
                onChange={(e) => {
                  setEmailError(!emailValidator(e.target.value));
                  setEmail(e.target.value?.trim());
                }}
              />
              <span
                className={classNames(styles.errorIcon, {
                  [styles['errorIcon--email']]: emailError,
                })}
              />
            </div>
          )}

          <div className={styles.codeInputWrapper}>
            <input
              className={classNames(styles.code, PING_FANG.className, { [styles.error]: codeError })}
              type='text'
              value={code}
              placeholder={t.bindPhone.verificationCodePlaceholder}
              onChange={(e) => setNumbersOnly(e, setCode)}
              onBlur={() => {
                if (codeTyping) {
                  validateCodeFormat();
                  setCodeTyping(false);
                }
              }}
              maxLength={6}
            />
            <span
              className={classNames(styles.errorIcon, {
                [styles['errorIcon--code']]: codeError,
              })}
            />
            <motion.div
              className={classNames(styles.sendCodeBtn, {
                [styles.disabledBtn]: isCounting,
              })}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                validateFields();
              }}
            >
              {isCounting ? `${seconds}` : t.bindPhone.requestOtp}
            </motion.div>
          </div>
          <div className={styles.submitBtn}>
            <Button
              type='submit'
              className={classNames({ 'pointer-events-none': submitted })}
              text={t.bindPhone.bind}
              variant='orange'
            />

            {(displayIcon?.type === BIND_BONUS.GOOGLE_EMAIL || activeModal === DATA_MODAL.BIND_GOOGLE_EMAIL_BONUS) && (
              <Button
                className={classNames({ 'pointer-events-none': submitted })}
                text={t.bindPhone.googleLogin}
                variant='blue'
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(null, 'googleLogin');
                }}
                style={{ width: '3rem' }}
              />
            )}
          </div>
        </div>
      </form>
    </>
  );
};
