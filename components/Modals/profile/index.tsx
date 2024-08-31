import { Langar, Luckiest_Guy, Poppins } from 'next/font/google';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BIND_BONUS, COPY_CLIPBOARD, DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { getBonusByTypes } from '@/services/api';
import { TBonusByType } from '@/services/response-type';
import { TFindByTypeItem } from '@/services/types';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { motion } from 'framer-motion';
import CSVGA from '@/components/Customs/CSVGA';
import { ImgWithFallback } from '@/components/Customs/ImgWithFallback';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { useAppDispatch, useAppSelector } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { staticImport } from '@/utils/resources';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import ToggleSwitch from './components/toggle-switch/index';
import styles from './index.module.scss';

export const langar = Langar({ weight: '400', subsets: ['latin'] });
export const poppins = Poppins({ weight: '400', subsets: ['latin'] });
export const luckiest_guy = Luckiest_Guy({ weight: '400', subsets: ['latin'] });

export default function Profile() {
  const locale = useAppSelector((state) => state.appData.language);
  const dispatch = useAppDispatch();
  const { logoutUser } = useWithDispatch();
  const t = useTranslations().profile;
  const { isBackgroundMusicOn, isSoundEffectsOn } = useAppSelector((state) => state.appData);
  const { userInfo } = useAppSelector((state) => state.userData);
  const [bonusData, setBonusData] = useState<TBonusByType>();
  const [isLoadedBG, seIsLoadedBG] = useState(false);

  useEffect(() => {
    getBonusByTypes({}).then((res) => {
      const phone = res?.data.data?.find((q: TFindByTypeItem) => q?.type === BIND_BONUS.PHONE);
      if (!!phone) {
        setBonusData(phone);
      }
    });
  }, []);

  const onCloseBtn = () => {
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
  };

  const bindPhone = () => {
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
    dispatch(setActiveModal(DATA_MODAL.BIND_PHONE));
  };

  const bindEmail = () => {
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
    dispatch(setActiveModal(DATA_MODAL.BIND_EMAIL));
  };

  const isSVGAloaded = () => {
    seIsLoadedBG(true);
  };

  const userLogOut = () => {
    logoutUser();
  };

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

  const modalTitleStyles = {
    width: `${(locale === 'in' && '3.6rem') || (locale === 'en' && '2.3rem')}`,
    height: `${(locale === 'in' && '1.3rem') || (locale === 'en' && '0.8rem')}`,
    top: `${(locale === 'in' && '4%') || (locale === 'en' && '10%')}`,
  };

  const bindStyles = {
    width: `${(locale === 'in' && '65%') || (locale === 'en' && '60%')}`,
  };

  const btnLogoutStyles = {
    width: `${(locale === 'in' && '45%') || (locale === 'en' && '42%')}`,
    height: `${(locale === 'in' && '18%') || (locale === 'en' && '15%')}`,
  };

  const fontWeightStyles = {
    fontWeight: `${locale === 'cn' && 'bolder'}`,
  };

  const bonusNotifStyles = {
    top: `${
      userInfo.phone === null && userInfo.email !== null
        ? '56'
        : userInfo.phone === null && userInfo.email === null
          ? '51'
          : '56'
    }%`,
  };

  return (
    <div className={styles.modalWrapper}>
      {!isLoadedBG && (
        <div className={classNames(styles.modalContainer, '!opacity-100')}>
          <LoadingIcon />
        </div>
      )}
      <div className={classNames(styles.modalContainer, isLoadedBG ? 'fadeIn' : '!hidden')}>
        <div className={styles.svgaContainer}>
          <CSVGA
            src={images.svga_profile_bg}
            isSVGALoaded={isSVGAloaded}
          />
        </div>
        <motion.div
          whileTap={{ scale: 0.9 }}
          className={styles.closeBtn}
          onClick={onCloseBtn}
        />
        <div
          className={styles.userProfileTitle}
          style={modalTitleStyles}
        >
          <span>{t.modalTitle}</span>
        </div>
        <div className={styles.profileContents}>
          <div className={styles.profileLeftDetails}>
            <div className={styles.profileUserIcon}>
              <ImgWithFallback
                sizes='(max-width: 100vw) 100vw'
                alt='logo'
                src={userInfo?.headImg ?? staticImport.game_item_placeholder}
                fill
                quality={100}
              />
              <span
                className={styles.vipIcon}
                style={{ backgroundImage: `url(${images[`vip_${userInfo?.vip}`]})` }}
              />
            </div>
            <p className={classNames(styles.profileName, poppins.className)}>{userInfo.nickName}</p>
            <div className={styles.userDetailsWrapper}>
              <p className={styles.profileId}>
                <span className={styles.key}>ID:</span>
                <span className={styles.value}>{userInfo.id}</span>
                <span
                  className={classNames(styles.copyIcon, 'active:scale-75 active:opacity-90')}
                  onClick={() => copyText('ID')}
                />
              </p>
              <p className={styles.profileMobileNumber}>
                <span className={styles.key}>{t.contact}:</span>
                <span className={styles.value}>
                  {userInfo?.phone ? userInfo?.phone?.replace(/\*\*\*\*/g, '-') : 'N/A'}
                </span>
                <span
                  className={classNames(styles.copyIcon, 'active:scale-75 active:opacity-90')}
                  onClick={() => copyText('Contact')}
                />
              </p>
              <p className={styles.emailAdd}>
                <span className={styles.key}>{t.email}:</span>
                <span className={styles.value}>{userInfo.email ?? 'N/A'}</span>
                <span
                  className={classNames(styles.copyIcon, 'active:scale-75 active:opacity-90')}
                  onClick={() => copyText('email')}
                />
              </p>
            </div>

            <motion.div
              whileTap={{ scale: 0.9 }}
              className={styles.btnLogout}
              onClick={userLogOut}
              style={btnLogoutStyles}
            >
              <p style={fontWeightStyles}>{t.logOut}</p>
            </motion.div>
          </div>
          <div className={styles.profileRightDetails}>
            <p className={styles.title}>{t.music}</p>
            <ToggleSwitch
              toggle='music'
              isChecked={isBackgroundMusicOn}
            />
            <p className={styles.title}>{t.soundEffect}</p>
            <ToggleSwitch
              toggle='effects'
              isChecked={isSoundEffectsOn}
            />
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={styles.bindPhone}
              onClick={bindPhone}
              style={{ display: `${userInfo.phone === null ? 'flex' : 'none'}`, ...bindStyles }}
            >
              <p className={classNames(styles.bindText, langar.className)}>{t.bindPhone}</p>
            </motion.div>
            {bonusData && !userInfo?.phone && (
              <div
                className={styles.bonusNoti}
                style={bonusNotifStyles}
              >
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
                <span>+{moneyFormat(bonusData?.money ? bonusData?.money : 0, true)}</span>
              </div>
            )}
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={styles.bindEmail}
              onClick={bindEmail}
              style={{ display: `${userInfo.email === null ? 'flex' : 'none'}`, ...bindStyles }}
            >
              <p className={classNames(styles.bindText, langar.className)}>{t.bindEmail}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
