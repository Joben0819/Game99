import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { LOGIN_MODAL } from '@/constants/enums';
import { setShowLoginModal } from '@/reducers/appData';
import { forgotPassword, resetForgetLoginPassword, verifyEmailCode } from '@/services/api';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import CloseButton from '@/components/Customs/CloseButton';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { useAppSelector } from '@/store';
import { emailValidator, setNumbersOnly } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import NECaptchaComponent from '../../Captcha/NECaptchaComponent';
import { cabinCondensed } from '../Login';
import styles from './index.module.scss';

const Forgot = () => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const { initData, language } = useAppSelector((state) => state.appData);
  const [state, setState] = useState(0);
  const [code, setOtpNumber] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [eye, setEye] = useState(false);
  const [eye2, setEye2] = useState(false);
  const [forgotErr, setForgotErr] = useState({
    newPasswd: false,
    passWd: false,
    code: false,
    email: false,
  });

  const sendEmail = (validate?: string) => {
    setIsLoading(true);
    if (email) {
      forgotPassword({ email, validate }).then((res) => {
        if (res.data.code === 200) {
          setState(1);
          toast.success(res?.data?.msg, { id: 'success' });
        } else {
          toast.error(res?.data?.msg, { id: 'error' });
        }
        setIsLoading(false);
      });
    }
  };

  const verifyEmail = async () => {
    if (email && code) {
      setIsLoading(true);
      try {
        const res = await verifyEmailCode({ email, code });
        if (res.data.code === 200) {
          setState(2);
          toast.success(res.data.msg, { id: 'success' });
        } else {
          toast.error(res.data.msg, { id: 'error' });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetPassword = () => {
    if (newPassword?.length < 6 || confirmPassword?.length < 6) {
      setNewPassword('');
      setConfirmPassword('');
      setForgotErr({ ...forgotErr, passWd: true, newPasswd: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t.toasts.passwordNotMatched, { id: 'error' });
      return;
    }
    setIsLoading(true);
    resetForgetLoginPassword({
      email,
      newPassword,
      confirmPassword,
      code,
    }).then((res) => {
      if (res.data.code === 200) {
        setState(3);
        toast.success(res.data.msg, { id: 'success' });
      } else {
        toast.error(res.data.msg, { id: 'error' });
      }
    });
    setIsLoading(false);
  };

  const getEyeIcon = (isEyeOpen: boolean, password: string, hasError: boolean) => {
    if (password?.length === 0 && hasError) {
      return images.warning;
    }

    return isEyeOpen ? images.open_eye : images.close_eye;
  };

  const field: { [key: number]: string } = {
    3: 'passWd',
    4: 'newPasswd',
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, onState: any, Err: number) => {
    const newEmail: string = e.target.value;
    const fields = field[Err];

    onState(newEmail);

    if (fields) {
      setForgotErr({ ...forgotErr, [fields]: !emailValidator(newEmail) });
    }
  };

  return (
    <>
      {showCaptcha && (
        <NECaptchaComponent
          onSuccess={(data: any) => sendEmail(data?.validate)}
          onFailure={() => toast.error(t.toasts.captchaFailed)}
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
          <div className={styles.sizeImg5}>
            <CloseButton
              className='btn'
              onClick={() => dispatch(setShowLoginModal(LOGIN_MODAL.LOGIN))}
            />
          </div>
          {state === 0 && (
            <div className={styles.Inputs}>
              <div
                className={styles.sizeImg3}
                data-state={0}
                data-lang={language}
              >
                {t.login.resetPassword}
              </div>
              <div className={styles.emailWrapper}>
                {forgotErr.email && (
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
                  id='enterEmail'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value?.trim());
                    setForgotErr({ ...forgotErr, email: e.target.value === '' });
                  }}
                  className={classNames( {[styles.inputError]: forgotErr.email} )}
                />
                <span>{t.login.pleaseEnter}</span>
              </div>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={styles.btnOtpWrapper}
                onClick={() => {
                  const isEmailValid = emailValidator(email);

                  if (!isEmailValid) {
                    const errorMessage = email === '' ? t.login.pleaseEnter : t.login.enterValidEmail;
                    toast.error(errorMessage, { id: 'error' });

                    setForgotErr({ ...forgotErr, email: !isEmailValid });
                    return;
                  }

                  if (initData?.actionSwitch === '1') {
                    setShowCaptcha(true);
                  } else {
                    sendEmail();
                  }
                }}
              >
                <Image
                  src={images.google_login}
                  alt='otp'
                  width={143.71}
                  height={39.92}
                />
                <span>{t.login.requestOtp}</span>
              </motion.div>
            </div>
          )}
          {state === 1 && (
            <div className={styles.Inputs}>
              <div
                className={styles.sizeImg3}
                data-state={1}
                data-lang={language}
              >
                {t.login.resetPassword}
              </div>
              <div className={styles.enterVerify}>
                {!code && forgotErr.code && (
                  <div className={styles.warning_enter}>
                    <Image
                      src={images.warning}
                      alt='warning'
                      fill
                    />
                  </div>
                )}
                <input
                  type='text'
                  id='verification'
                  value={code}
                  onChange={(e) => {
                    setNumbersOnly(e, setOtpNumber);
                    setForgotErr({ ...forgotErr, code: false });
                  }}
                  placeholder={t.login.enterOtp}
                  className={classNames( {[styles.inputError]: forgotErr.code} )}
                  maxLength={6}
                />
                <span>{t.login.verificationLabel}</span>
              </div>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={styles.btnVerifyWrapper}
                onClick={() => {
                  if (code?.length > 5) {
                    verifyEmail();
                  } else {
                    const errorMessage = code ? t.login.invalidOtp : t.login.emptyOtp;
                    toast.error(errorMessage, { id: 'error' });

                    setOtpNumber('');
                    setForgotErr({ ...forgotErr, code: true });
                  }
                }}
              >
                <Image
                  src={images.login_btn}
                  alt='loginBtn'
                  width={143.71}
                  height={39.92}
                />
                <span>{t.login.veriFy}</span>
              </motion.div>
            </div>
          )}
          {state === 2 && (
            <div className={styles.Inputs}>
              <div
                className={styles.sizeImg3}
                data-lang={language}
              >
                {t.login.resetPassword}
              </div>
              <div className={styles.enterPasswdWrapper}>
                <div className={styles.setPasswd}>
                  <div className={styles.eyeIcon}>
                    <Image
                      onClick={() => {
                        setEye(!eye);
                      }}
                      src={getEyeIcon(eye, newPassword, forgotErr.newPasswd)}
                      alt='set pass'
                      fill
                    />
                  </div>
                  <input
                    type={eye ? 'text' : 'password'}
                    placeholder={t.login.createNewPassword}
                    value={newPassword}
                    onChange={(e) => {
                      handleChange(e, setNewPassword, 4);
                    }}
                    className={classNames( {[styles.inputError]: !newPassword && forgotErr.newPasswd} )}
                  />
                </div>
                <div className={styles.confirmPasswd}>
                  <div
                    className={styles.eyeIcon}
                    onClick={() => {
                      setEye2((prev) => !prev);
                    }}
                  >
                    <Image
                      src={getEyeIcon(eye2, confirmPassword, forgotErr.passWd)}
                      alt='new pass'
                      fill
                    />
                  </div>
                  <input
                    type={eye2 ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      handleChange(e, setConfirmPassword, 3);
                    }}
                    placeholder={t.login.confirmNewPassword}
                    className={classNames( {[styles.inputError]: !confirmPassword && forgotErr.passWd} )}
                  />
                </div>
              </div>
              <motion.div
                className={styles.btnVerifyWrapper}
                whileTap={{ scale: 0.9 }}
                onClick={resetPassword}
              >
                <Image
                  src={images.login_btn}
                  alt='loginBtn'
                  width={143.71}
                  height={39.92}
                />
                <span>{t.login.confirm}</span>
              </motion.div>
            </div>
          )}
          {state === 3 && (
            <div
              className={styles.Inputs}
              style={{ gap: '.22rem' }}
            >
              <div
                className={styles.sizeImg3}
                data-state={3}
                data-lang={language}
              >
                {t.login.verifiedSuccessfully}
              </div>
              <span
                className={styles.footer_note}
                data-lang={language}
              >
                {t.login.pleaseLogintoEmailAgain}
              </span>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={classNames(styles.btnVerifyWrapper, cabinCondensed.className)}
                onClick={() => dispatch(setShowLoginModal(LOGIN_MODAL.LOGIN))}
                data-lang={language}
              >
                <Image
                  src={images.login_btn}
                  alt='loginBtn'
                  width={143.71}
                  height={39.92}
                />
                <span>{t.login.backToLogin}</span>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Forgot;
