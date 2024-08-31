import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, FC, FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { DATA_MODAL, LOGIN_MODAL } from '@/constants/enums';
import { setActiveModal, setPrevPage, setShowLoginModal } from '@/reducers/appData';
import { setLoginEmail, setUserInfo } from '@/reducers/userData';
import { mRegister, registerCode, verifyEmailCode } from '@/services/api';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import CloseButton from '@/components/Customs/CloseButton';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { useAppSelector } from '@/store';
import { emailValidator, getFcmTokenOnLogin } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import NECaptchaComponent from '../../Captcha/NECaptchaComponent';
import styles from './index.module.scss';

const Register = () => {
  const dispatch = useDispatch();
  const t = useTranslations();
  const channelCode = localStorage.getItem('channelCode');
  const searchParams = useSearchParams();
  const isAdjust = searchParams.get('link_token');
  const { loginEmail, userAdid } = useAppSelector((s) => s.userData);
  const { initData, language } = useAppSelector((state) => state.appData);
  const [email, setEmail] = useState('');
  const [passwd, set_Passwd] = useState('');
  const [code, setOtpNumber] = useState('');
  const [confirmPasswd, set_Confirm_Passwd] = useState('');
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [steps, setSteps] = useState(0);
  const [eye, setEye] = useState({ eye1: false, eye2: false });
  const [registerErr, setRegisterErr] = useState({
    setPasswd: false,
    passWd: false,
    code: false,
    email: false,
  });

  const registerEmail = (validate?: string) => {
    setIsLoading(true);
    if (email) {
      registerCode({ email, ...(validate ? { validate } : {}) }).then((res) => {
        setIsLoading(false);
        if (res.data.code === 200) {
          setSteps(1);
          toast.success(t.toasts.verificationCodeSent, { id: 'success' });
        } else {
          toast.error(res.data?.msg, { id: 'error' });
        }
      });
    }
  };

  const initializeGuardian = async () => {
    setIsLoading(true);
    const NEGuardian = await require('@/scripts/YiDunProtector-Web-2.0.3');

    if (NEGuardian) {
      setIsLoading(false);
      const neg = NEGuardian({ appId: initData?.productId, timeout: 10000 });

      neg.getToken().then((data: any) => {
        const token = data?.token;
        if (data?.code === 200) {
          registerFn(token);
        }
      });
    }
  };

  const registerFn = (token: string) => {
    const fcmToken = localStorage.getItem('fcm-token');
    mRegister({
      email,
      passwd,
      confirmPasswd,
      code,
      token,
      ...(channelCode ? { channelCode } : {}),
      ...(isAdjust && userAdid ? { adjustId: userAdid } : {}),
      ...(isAdjust ? { isFromAdjust: true } : {}),
      ...(fcmToken ? { fcmToken } : {}),
    }).then((res) => {
      if (res.data.code === 200) {
        dispatch(setUserInfo(res.data?.data));
        dispatch(setActiveModal(DATA_MODAL.CLOSE));
        toast.success(res.data.msg, { id: 'success' });
        dispatch(setPrevPage('loginRegister-page'));
        getFcmTokenOnLogin();
      } else {
        passwd === '' && confirmPasswd === '' && setRegisterErr({ ...registerErr, passWd: true, setPasswd: true });
        toast.error(res.data.msg, { id: 'error' });
      }
      setIsLoading(false);
    });
  };

  const verifyEmail = async () => {
    try {
      const res = await verifyEmailCode({ email, code });
      if (res.data.code === 200) {
        setSteps(2);
        toast.success(res.data.msg, { id: 'success' });
      } else {
        toast.error(res.data.msg, { id: 'error' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ImageClose: FC = () => (
    <div className={styles.sizeImg5}>
      <CloseButton onClick={() => dispatch(setShowLoginModal(LOGIN_MODAL.LOGIN))} />
    </div>
  );

  const EyeIcon = (data: boolean, data_length: string, Err: boolean) => {
    const eyes = data ? images.open_eye : images.close_eye;
    return data_length?.length === 0 ? (Err ? images.warning : eyes) : eyes;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, onState: any, errNumber: number, Dispatch?: any) => {
    const response_data: string = e.target.value;
    Dispatch && dispatch(Dispatch(''));
    if (onState === setOtpNumber) {
      onState(response_data.trim());
    } else {
      onState(response_data);
    }
    errNumber === 1 && setRegisterErr({ ...registerErr, email: !emailValidator(response_data) });
    errNumber === 2 && setRegisterErr({ ...registerErr, code: !emailValidator(response_data) });
    errNumber === 3 && setRegisterErr({ ...registerErr, passWd: !emailValidator(response_data) });
    errNumber === 4 && setRegisterErr({ ...registerErr, setPasswd: !emailValidator(response_data) });
  };

  const otpValid = () => {
    setRegisterErr({ ...registerErr, code: !emailValidator('') });
    setOtpNumber('');
    toast.error(t.login.enterValidOtp);
    return;
  };

  const errorInput = (dataLength: string, err_data: boolean) => dataLength?.length === 0 && err_data;

  const stepHandleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailValidator(email)) {
      setRegisterErr({ ...registerErr, email: true });
      toast.error(t.login.enterValidEmail, { id: 'error' });
      return;
    }

    if (initData?.actionSwitch === '1') {
      setShowCaptcha(true);
    } else {
      registerEmail();
    }
  };

  const step2HandleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (code.length > 2) {
      verifyEmail();
      return;
    }

    otpValid();
  };

  const handleClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    initializeGuardian();
  };

  return (
    <>
      {showCaptcha && (
        <NECaptchaComponent
          onSuccess={(data1: any) => registerEmail(data1?.validate)}
          onFailure={() => toast.error(t.common.captcha)}
          captchaId={initData?.captchaId ?? ''}
          showCaptcha={showCaptcha}
          setShowCaptcha={setShowCaptcha}
        />
      )}
      {(!isBgLoaded || isLoading) && (
        <div className='loader'>
          <LoadingIcon />
        </div>
      )}

      <div
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
          <ImageClose />
          {steps === 0 && (
            <form
              onSubmit={stepHandleSubmit}
              className={styles.Inputs}
            >
              <div
                data-lang={language}
                className={classNames(styles.sizeImg3, {
                  [styles.chinese_resizeTxt]: language === 'cn'
                })}
              >
                {t.login.criarConta}
              </div>

              <div className={styles.wrapperEmail}>
                {registerErr.email && (
                  <div className={styles.warning}>
                    <Image
                      src={images.warning}
                      alt='warning'
                      fill
                    />
                  </div>
                )}
                <input
                  type='text'
                  placeholder={t.login.enterEmail}
                  value={email || loginEmail}
                  onChange={(e: any) => {
                    setRegisterErr({ ...registerErr, email: false });
                    setEmail(e.target.value);
                    // clearing of loginEmail state when user tries to create new account
                    dispatch(setLoginEmail(''));
                  }}
                  className={classNames(styles.enterEmail, {
                    [styles.inputError]: registerErr?.email
                  })}
                />
              </div>
              <span className={styles.emailMessage}>{t.login.pleaseEnter}</span>
              <motion.button
                className={styles.requestOtp}
                type='submit'
                whileTap={{ scale: 0.9 }}
                disabled={registerErr.email}
              >
                <Image
                  className='z-[0]'
                  src={images.google_login}
                  alt='googleLogin'
                  width={143.71}
                  height={39.92}
                />
                <span>{t.login.requestOtp}</span>
              </motion.button>
            </form>
          )}
          {steps === 1 && (
            <form
              onSubmit={step2HandleSubmit}
              className={styles.Inputs}
            >
              <div
                data-state={1}
                className={classNames(styles.sizeImg3, {
                  [styles.chinese_resizeTxt]: language === 'cn'
                })}
              >
                {t.login.enterOtpHeader}
              </div>
              <div className={styles.code}>
                {code?.length === 0 && registerErr.code && (
                  <div className={styles.warning_input}>
                    <Image
                      src={images.warning}
                      alt='warning'
                      fill
                    />
                  </div>
                )}
                <input
                  className={classNames(styles.enterCode, {
                    [styles.inputError]: code?.length === 0 && registerErr.code
                  })}
                  type='text'
                  id='enterPasswd'
                  placeholder={t.login.enterOtp}
                  value={code}
                  onChange={(e) => handleChange(e, setOtpNumber, 2)}
                  maxLength={6}
                />
                <span className={styles.codeMessage}>{t.login.verificationLabel}</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={styles.verifyBtn}
                type='submit'
              >
                <Image
                  src={images.login_btn}
                  alt='button'
                  width={143.71}
                  height={39.92}
                />
                <span className={styles.verifyTxt}>{t.login.veriFy}</span>
              </motion.button>
            </form>
          )}
          {steps === 2 && (
            <form
              onSubmit={handleClick}
              className={styles.Inputs}
            >
              <div 
                className={classNames(styles.sizeImg3, {
                  [styles.chinese_resizeTxt]: language === 'cn'
                })}
              >  
                {t.login.setPassword}
              </div>
              <div className={styles.passWdWrapper}>
                <div className={styles.setPassWd}>
                  <div
                    className={classNames(styles.eyeIcon, {
                      [styles.warning]: errorInput(passwd, registerErr.setPasswd)
                    })}
                    onClick={() => setEye((prev) => ({ ...prev, eye1: !prev.eye1 }))}
                  >
                    <Image
                      src={EyeIcon(eye.eye1, passwd, registerErr.setPasswd)}
                      alt='setPasswd'
                      fill
                    />
                  </div>
                  <input
                    type={eye.eye1 ? 'text' : 'password'}
                    placeholder={t.login.createPassword}
                    value={passwd}
                    onChange={(e) => handleChange(e, set_Passwd, 4)}
                    className={classNames(styles.enterSetPasswd, {
                      [styles.inputError]: passwd?.length === 0 && registerErr.setPasswd
                    })}
                  />
                </div>
                <div className={styles.confirmPasswd}>
                  <div
                    className={classNames(styles.eyeIcon, {
                      [styles.warning]: errorInput(confirmPasswd, registerErr.passWd)
                    })}
                    style={{ right: '.1rem' }}
                    onClick={() => setEye((prev) => ({ ...prev, eye2: !prev.eye2 }))}
                  >
                    <Image
                      src={EyeIcon(eye.eye2, confirmPasswd, registerErr.passWd)}
                      alt='confirm '
                      fill
                    />
                  </div>
                  <input
                    type={eye.eye2 ? 'text' : 'password'}
                    value={confirmPasswd}
                    onChange={(e) => handleChange(e, set_Confirm_Passwd, 3)}
                    placeholder={t.login.confirmPassword}
                    className={classNames(styles.confirmPass, {
                      [styles.inputError]: confirmPasswd?.length === 0 && registerErr.passWd
                    })}
                  />
                </div>
              </div>
              <motion.button
                className={styles.confirmBtn}
                type='submit'
                whileTap={{ scale: 0.9 }}
              >
                <Image
                  src={images.login_btn}
                  alt='button'
                  width={143.71}
                  height={39.92}
                />
                <span className={styles.confirmTxt}>{t.login.confirm}</span>
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
