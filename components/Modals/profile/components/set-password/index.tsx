import Image from 'next/image';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { bindEmail } from '@/services/api';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import Button from '@/components/Customs/Button';
import { PING_FANG } from '@/public/fonts/PingFang';
import { useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import { luckiest_guy } from '../..';
import styles from '../profile-form/index.module.scss';

type SetPasswordProps = {
  formTitle: string;
  currentView: string;
  setView: (data: string) => void;
};

export const SetPassword: FC<SetPasswordProps> = ({ currentView, setView }) => {
  const t = useTranslations();
  const locale = useAppSelector((state) => state.appData.language);
  const { getAccountUserInfo, getNewLoginMethods } = useWithDispatch();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passErr, setPassErr] = useState(false);
  const [cPassErr, setCPassErr] = useState(false);

  const handleSubmit = () => {
    if (password !== confirmPassword || password === '' || confirmPassword === '') {
      setPassErr(password === '');
      setCPassErr(confirmPassword === '');
      toast.error(t.toasts.passwordNotMatched);
      return;
    }
    if (!password && !confirmPassword) {
      setPassErr(true);
      setCPassErr(true);
      setPassword('');
      setConfirmPassword('');
      return;
    }
    if (localStorage.getItem('inputtedEmail') && localStorage.getItem('oneTimePass')) {
      const email = localStorage.getItem('inputtedEmail')!;
      const code = localStorage.getItem('oneTimePass')!;
      if (password !== '' && confirmPassword !== '' && password === confirmPassword) {
        bindEmail({ email, code, password, confirmPassword }).then((res) => {
          if (res?.data?.code === 200) {
            setView('success');
            toast.success(res?.data?.msg);
            getAccountUserInfo();
            getNewLoginMethods();
          } else if (res?.data?.code === 405) {
            toast.error(t.toasts.verificationCodeUsedIncorrect);
            localStorage.removeItem('oneTimePass');
          } else {
            toast.error(res?.data?.msg);
            localStorage.removeItem('inputtedEmail');
            localStorage.removeItem('oneTimePass');
          }
        });
      }
    }
  };

  return (
    <>
      <div
        className={styles.bindFormWrapper}
        data-form={currentView}
      >
        <div className={styles.bindForm}>
          <h2 className={classNames(styles.formTitle, luckiest_guy.className)}>{t.setPassword.modalTitle}</h2>
          <div className={classNames(styles.emailInput, { ['!border-red-500']: passErr })}>
            <input
              className={classNames(styles.email, PING_FANG.className)}
              type={showPassword ? 'text' : 'password'}
              placeholder={t.setPassword.passwordPlaceholder}
              onChange={(e) => {
                const inputValue = e.target.value;
                setPassErr(inputValue === '');
                setPassword(inputValue);
              }}
              value={password}
            />
            <Image
              className={styles.previewIcon}
              src={passErr ? images.warning : showPassword ? images.open_eye : images.close_eye}
              onClick={() => setShowPassword(!showPassword)}
              width={30}
              height={30}
              alt='password'
            />
          </div>
          <div className={classNames(styles.emailInput, { ['!border-red-500']: cPassErr })}>
            <input
              className={classNames(styles.email, PING_FANG.className)}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={t.setPassword.confirmPasswordPlaceholder}
              onChange={(e) => {
                const inputValue = e.target.value;
                setCPassErr(inputValue === '');
                setConfirmPassword(inputValue);
              }}
              value={confirmPassword}
            />
            <Image
              className={styles.previewIcon}
              src={cPassErr ? images.warning : showConfirmPassword ? images.open_eye : images.close_eye}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              width={30}
              height={30}
              alt='confirm_password'
            />
          </div>
          <motion.div
            className={classNames(styles.submitBtn, luckiest_guy.className)}
            data-form={currentView}
            data-lang={locale}
          >
            <Button
              text={t.setPassword.submit}
              variant='orange'
              onClick={handleSubmit}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
};
