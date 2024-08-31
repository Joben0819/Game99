import { Cabin_Condensed } from 'next/font/google';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { APK_EVENT, BIND_BONUS, DATA_MODAL, LOGIN_MODAL } from '@/constants/enums';
import { setActiveModal, setPrevPage, setShowLoginModal } from '@/reducers/appData';
import { setLoginEmail, setUserInfo } from '@/reducers/userData';
import { loginEmail } from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { z } from 'zod';
import CloseButton from '@/components/Customs/CloseButton';
import { Input } from '@/components/Customs/Input';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { useAppDispatch, useAppSelector } from '@/store';
import { getFcmTokenOnLogin, getGoogleLoginLink, isLoggedIn, triggerApkEvent } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import NECaptchaComponent from '../../Captcha/NECaptchaComponent';
import styles from './index.module.scss';

export const cabinCondensed = Cabin_Condensed({
  subsets: ['latin'],
  weight: '400',
});

const LoginEmailSchema = z
  .object({
    email: z.string().email(),
    passwd: z.string().min(1),
  })
  .required();

const Login = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const dispatch = useAppDispatch();
  const t = useTranslations().login;
  const { initData, loginMethodList } = useAppSelector((state) => state.appData);
  const [loading, setLoading] = useState(false);
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [validate, setValidate] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(setLoginEmail(''));
  }, [isBgLoaded]);

  const { handleSubmit, register, formState, reset } = useForm<z.infer<typeof LoginEmailSchema>>({
    resolver: zodResolver(LoginEmailSchema),
    defaultValues: {
      email: '',
      passwd: '',
    },
  });

  const loginFn = async ({ token, email, passwd }: { token: string; email: string; passwd: string }) => {
    setLoading(true);
    const fcmToken = localStorage.getItem('fcm-token');
    try {
      const { code, data, msg } = await loginEmail({
        email,
        passwd,
        token,
        validate,
        ...(fcmToken ? { fcmToken } : {}),
      });
      if (code !== 200) throw new Error(msg);
      toast.success(msg);
      dispatch(setLoginEmail(email));
      dispatch(setUserInfo(data));
      dispatch(setActiveModal(DATA_MODAL.CLOSE));
      dispatch(setPrevPage('loginRegister-page'));
      getFcmTokenOnLogin();
      reset();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message, { id: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const initializeGuardian = async ({ email, passwd }: { email: string; passwd: string }) => {
    if (typeof window !== 'undefined') {
      const NEGuardian = (await require('@/scripts/YiDunProtector-Web-2.0.3')) as Awaited<
        (params: { appId: string; timeout: number }) => { getToken: () => Promise<{ token: string; code: number }> }
      >;
      if (NEGuardian) {
        const neg = NEGuardian({ appId: initData?.productId, timeout: 10000 });
        const { code, token } = await neg.getToken();
        if (code !== 200) return;
        loginFn({
          token,
          email,
          passwd,
        });
      }
    }
  };

  const handleCaptchaFailure = () => toast.error(t.captcha);

  const onSubmit = ({ email, passwd }: z.infer<typeof LoginEmailSchema>) => {
    initializeGuardian({ email, passwd });
  };

  return (
    <>
      {showCaptcha && (
        <NECaptchaComponent
          onSuccess={setValidate}
          onFailure={handleCaptchaFailure}
          captchaId={initData?.captchaId ?? ''}
          showCaptcha={showCaptcha}
          setShowCaptcha={setShowCaptcha}
        />
      )}

      {(!isBgLoaded || loading) && (
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
          <div className={classNames(styles.sizeImg, {
            [styles['sizeImg--loading']]: loading
          })}>
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
          <form
            className={styles.Inputs}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.sizeImg3}>
              <CloseButton
                className='btn'
                onClick={() => {
                  dispatch(setActiveModal(DATA_MODAL.CLOSE));
                  if (!isLoggedIn()) {
                    dispatch(setActiveModal(DATA_MODAL.LOGIN_MODAL));
                  }
                }}
              />
            </div>
            <div
              className={styles.sizeImg2}
              data-lang={locale}
            >
              {t.login_email_login}
            </div>

            <Input
              placeholder={t.enterEmail}
              formState={!!formState.errors.email}
              {...register('email')}
            />

            <Input
              type='password'
              placeholder={t.enterPassword}
              formState={!!formState.errors.passwd}
              {...register('passwd')}
            />

            <motion.span
              whileTap={{ scale: 0.9 }}
              className={classNames(cabinCondensed.className, styles.forgotPasswd)}
              onClick={() => dispatch(setShowLoginModal(LOGIN_MODAL.FORGOT_PASS))}
            >
              {t.forgotPassword}
            </motion.span>

            <div className={classNames(cabinCondensed.className, styles.loginBtnWrapper)}>
              {loginMethodList?.dataList?.some(
                (item) => item?.type === BIND_BONUS.EMAIL || item?.type === BIND_BONUS.GOOGLE_EMAIL,
              ) && (
                <motion.button
                  className={classNames(styles.btnWrapper, styles.loginBtn)}
                  whileTap={{ scale: 0.9 }}
                  type='submit'
                >
                  {t.login}
                </motion.button>
              )}
              {loginMethodList?.dataList?.some((item) => item?.type === BIND_BONUS.GOOGLE_EMAIL) && (
                <motion.a
                  whileTap={{ scale: 0.9 }}
                  href={getGoogleLoginLink()}
                  className={styles.googleHref}
                >
                  {t.googleLogin}
                </motion.a>
              )}
            </div>
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={classNames(cabinCondensed.className, styles.createAccount)}
              onClick={() => {
                triggerApkEvent(APK_EVENT.REGISTER_CLICK);
                dispatch(setShowLoginModal(LOGIN_MODAL.REGISTER));
              }}
            >
              {t.criarConta}
            </motion.div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
