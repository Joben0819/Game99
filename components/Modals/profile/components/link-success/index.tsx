import { useEffect } from 'react';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import classNames from 'classnames';
import Button from '@/components/Customs/Button';
import { useAppDispatch, useAppSelector } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import { luckiest_guy } from '../..';
import styles from '../profile-form/index.module.scss';

export const LinkSuccess = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations().linkSuccess;
  const { getAccountUserInfo } = useWithDispatch();
  const { activeModal } = useAppSelector((state) => state.appData);

  useEffect(() => {
    return () => {
      removeStoredDataInLocalStorage();
    };
  }, []);

  const handleClick = () => {
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
    sessionStorage.removeItem('part');
    getAccountUserInfo();
  };

  const removeStoredDataInLocalStorage = () => {
    localStorage.removeItem('inputtedEmail');
    localStorage.removeItem('oneTimePass');
  };

  return (
    <div className={styles.successLinkWrapper}>
      <div className={styles.successLink}>
        <div className={styles.successLinkImg} />
        <h1 className={classNames(styles.successLinkTitle, luckiest_guy.className)}>
          {[DATA_MODAL.BIND_EMAIL, DATA_MODAL.BIND_GOOGLE_EMAIL_BONUS].includes(activeModal as DATA_MODAL)
            ? t.emailBindSuccess
            : t.cellularTitle}
        </h1>
        <Button
          text={t.done}
          variant='orange'
          onClick={handleClick}
        />
      </div>
    </div>
  );
};
