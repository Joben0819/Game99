import Image from 'next/image';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { BIND_BONUS, COPY_CLIPBOARD, DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { TBonusByType } from '@/services/response-type';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import { getGoogleLoginLink, moneyFormat } from '@/utils/helpers';
import { images, staticImport } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './styles.module.scss';

const PersonalCenterProfile = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations().profile;
  const { userInfo } = useAppSelector((state) => state.userData);
  const { loginMethodList } = useAppSelector((state) => state.appData);
  const phoneBonus = loginMethodList?.dataList?.find((p: TBonusByType) => p.type === BIND_BONUS.PHONE);
  const emailBonus = loginMethodList?.dataList?.find(
    (e: TBonusByType) =>
      e.type === BIND_BONUS.EMAIL || e.type === BIND_BONUS.GOOGLE || e.type === BIND_BONUS.GOOGLE_EMAIL,
  );
  const [
    isBindEmailBonusAvailable,
    isBindGoogleEmailBonusAvailable,
    isBindGoogleBonusAvailable,
    isBindPhoneBonusAvailable,
  ] = [BIND_BONUS.EMAIL, BIND_BONUS.GOOGLE_EMAIL, BIND_BONUS.GOOGLE, BIND_BONUS.PHONE].map(
    (type) => loginMethodList?.dataList?.some((method) => method.type === type),
  );
  const isAnyBindBonusAvailable =
    isBindEmailBonusAvailable ||
    isBindGoogleEmailBonusAvailable ||
    isBindGoogleBonusAvailable ||
    isBindPhoneBonusAvailable;

  useEffect(() => {
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
  }, []);

  const copyText = (toCopy: string) => {
    const textToCopy =
      toCopy === 'ID' ? userInfo.id : toCopy === 'email' ? userInfo.email || 'N/A' : userInfo.phone || 'N/A';
    try {
      copy(textToCopy, {
        message: `${
          (toCopy === COPY_CLIPBOARD.EMAIL && toast.success(t.copyEmail, { id: 'error' }),
          toCopy === COPY_CLIPBOARD.CONTACT && toast.success(t.copyContact, { id: 'error' }),
          toCopy === COPY_CLIPBOARD.ID && toast.success(t.copyId, { id: 'error' }))
        }`,
      });
    } catch (error) {
      toast.error(t.unableToCopy, { id: `${error}` });
    }
  };

  const bindPhone = () => {
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
    dispatch(setActiveModal(DATA_MODAL.BIND_PHONE));
  };

  const bindEmail = () => {
    if (isBindGoogleBonusAvailable) {
      window.location.href = getGoogleLoginLink();
      return;
    }
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
    if (isBindGoogleEmailBonusAvailable) {
      dispatch(setActiveModal(DATA_MODAL.BIND_GOOGLE_EMAIL_BONUS));
      return;
    }
    dispatch(setActiveModal(DATA_MODAL.BIND_EMAIL));
  };

  const openChangeAvatar = () => {
    dispatch(setActiveModal(DATA_MODAL.CHANGE_AVATAR));
  };

  const renderBonus = (num: number) => (
    <div className={styles.bonusNoti}>
      <Image
        alt='coin'
        src={images.bonus_coin ?? ''}
        width={35}
        height={36}
      />
      <span>+{moneyFormat(num || 0, true)}</span>
    </div>
  );

  const renderUserInfo = () => (
    <div className={styles.profile__info}>
      <div className={styles.profile__textContainer}>
        <h1 data-textafter={userInfo?.username ?? userInfo?.nickName?.split(' ')[0]}>
          {userInfo?.username ?? userInfo?.nickName?.split(' ')[0]}
        </h1>
        <ul>
          <li>
            <span>ID:</span>
            <span>{userInfo?.id}</span>
            <motion.span
              whileTap={{ scale: 0.9 }}
              onClick={() => userInfo?.id && copyText('ID')}
            >
              <Image
                alt='copy icon'
                src={images.copy_icon}
                quality={100}
                width={20}
                height={20}
              />
            </motion.span>
          </li>
          <li>
            <span>{t.contact}:</span>
            <span>{userInfo?.phone || 'N/A'}</span>
            <motion.span
              whileTap={{ scale: 0.9 }}
              onClick={() => userInfo?.phone && copyText('Contact')}
            >
              <Image
                alt='copy icon'
                src={images.copy_icon}
                quality={100}
                width={20}
                height={20}
              />
            </motion.span>
            <motion.div
              className={styles.profile__setting}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(setActiveModal(DATA_MODAL.SETTINGS))}
            >
              {t.settings}
            </motion.div>
          </li>
          <li>
            <span>{t.email}:</span>
            <span>{userInfo?.email || 'N/A'}</span>
            <motion.span
              whileTap={{ scale: 0.9 }}
              onClick={() => userInfo?.email && copyText('email')}
            >
              <Image
                alt='copy icon'
                src={images.copy_icon}
                quality={100}
                width={20}
                height={20}
              />
            </motion.span>
          </li>
        </ul>
      </div>
    </div>
  );

  const renderBindButton = () => (
    <div className={styles.profile__bindBtnContainer}>
      {isBindPhoneBonusAvailable && (
        <motion.button
          className={classNames(styles.profile__bindBtn, {
            [styles['profile__bindBtn--hidden']]: userInfo.phone !== null,
          })}
          whileTap={{ scale: 0.9 }}
          onClick={bindPhone}
        >
          {phoneBonus && phoneBonus?.money > 0 && !!!userInfo?.phone && renderBonus(phoneBonus?.money)}
          <span
            className={classNames(styles.profile__bindBtnImgPhone, {
              [styles['profile__bindBtnImgPhone--disabled']]: userInfo.phone !== null,
            })}
          />
          <span>{t.bindPhone}</span>
        </motion.button>
      )}
      {(isBindEmailBonusAvailable || isBindGoogleEmailBonusAvailable || isBindGoogleBonusAvailable) && (
        <motion.button
          className={classNames(styles.profile__bindBtn, {
            [styles['profile__bindBtn--hidden']]: userInfo.email !== null,
          })}
          whileTap={{ scale: 0.9 }}
          onClick={bindEmail}
        >
          {emailBonus && emailBonus?.money > 0 && !!!userInfo?.email && renderBonus(emailBonus?.money)}
          <span
            className={classNames(styles.profile__bindBtnImgEmail, {
              [styles['profile__bindBtnImgEmail--disabled']]: userInfo.email !== null,
            })}
          />
          <span>{isBindGoogleBonusAvailable ? t.bindGoogle : t.bindEmail}</span>
        </motion.button>
      )}
    </div>
  );

  return (
    <div className={styles.profile}>
      <div className={styles.profile__infoContainer}>
        <div className={styles.profile__pic}>
          <motion.div
            whileTap={{ scale: 0.9 }}
            className={styles.profile__imgContainer}
            onClick={() => openChangeAvatar()}
          >
            <Image
              alt='profile border'
              src={images.profile_border}
              quality={100}
              width={146}
              height={128}
            />
            <Image
              alt='profile img'
              src={userInfo.headImg || staticImport.user_icon}
              quality={100}
              width={146}
              height={128}
            />
            <Image
              alt='vip icon'
              src={images[`vip_${userInfo?.vip}`]}
              quality={100}
              width={100}
              height={100}
            />
          </motion.div>
        </div>
        {renderUserInfo()}
      </div>
      <div className={styles.profile__buttonContainer}>
        {isAnyBindBonusAvailable && renderBindButton()}
        <div className={styles.profile__logoutContainer}>
          <span> v{process.env.APP_VERSION}</span>
        </div>
      </div>
    </div>
  );
};

export default PersonalCenterProfile;
