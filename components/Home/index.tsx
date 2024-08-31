'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { ANNOUNCEMENT_SHOW_TYPE, DATA_MODAL } from '@/constants/enums';
import {
  setActiveGamesType,
  setActiveModal,
  setAnnouncements,
  setButtonClickAnnouncements,
  setFourthModal,
  setGamesTypeItems,
  setIsPopup,
  setOtherDialogAnnouncementsData,
  setPrevPage,
  setSecondModal,
  setThirdModal,
} from '@/reducers/appData';
import { setUserInfo } from '@/reducers/userData';
import { announcement, escGame, getGameTypes, loginDevice, otherAnnouncement } from '@/services/api';
// import { Pixel } from '@framit/meta-pixel';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import { deleteParams, hasEventJumpType, isLoggedIn, isUpdatingAvatar } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import SideNotification from '../Customs/SideNotification';
import styles from './index.module.scss';

const GameList = dynamic(() => import('./components/GameList'), { ssr: false });
const Footer = dynamic(() => import('./components/Footer'), { ssr: false });
const Header = dynamic(() => import('./components/Header'), { ssr: false });

const Home = () => {
  const locale = useAppSelector((s) => s.appData.language);
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const t = useTranslations().toasts;
  const isAdjust = searchParams.get('link_token');
  const { userInfo, userAdid } = useAppSelector((state) => state.userData);
  const { getAccountUserInfo, getAccountBalance } = useWithDispatch();
  const {
    gamesTypeItems,
    activeGamesType,
    initData,
    prevPage,
    activeModal,
    announcementData,
    otherDialogAnnouncementsData,
  } = useAppSelector((state) => state.appData);

  useEffect(() => {
    if (!isLoggedIn() && isAdjust && !!userAdid?.length) {
      initLogin();
    }
  }, [userAdid, isAdjust]);

  useEffect(() => {
    if (userInfo.id && activeModal === DATA_MODAL.LOGIN_MODAL) {
      dispatch(setActiveModal(DATA_MODAL.CLOSE));
    }
  }, [userInfo.id, activeModal]);

  useEffect(() => {
    fetchGameTypes();
  }, [locale]);

  useEffect(() => {
    deleteParams('otp');
    if (!hasEventJumpType() && localStorage.getItem('recent-modal') !== 'activities') {
      localStorage.removeItem('banner-clicked');
    }
    if (prevPage !== 'recharge-page') {
      sessionStorage.removeItem('eventJumpType');
    }
    localStorage.removeItem('support-modal');

    if (!isLoggedIn()) {
      setTimeout(() => {
        initLogin();
      }, 1000);
    } else {
      const isContinue = localStorage.getItem('redEnvelope');
      localStorage.removeItem('redEnvelope');
      if (!isContinue) {
        dispatch(setActiveModal(DATA_MODAL.CLOSE));
        dispatch(setThirdModal(DATA_MODAL.CLOSE));
        dispatch(setSecondModal(DATA_MODAL.CLOSE));
        const activeModal = localStorage.getItem('recent-modal') ?? '';
        setTimeout(() => {
          if (activeModal !== DATA_MODAL.OTHER_ANNOUNCEMENT) {
            dispatch(setActiveModal(activeModal));
            localStorage.removeItem('recent-modal');
          }
          if (isUpdatingAvatar()) {
            dispatch(setActiveModal(DATA_MODAL.CHANGE_AVATAR));
          }
        }, 400);
      }
    }

    if (prevPage === 'other-page' || prevPage === 'game' || prevPage === 'recharge-page') {
      setTimeout(() => {
        dispatch(setPrevPage(''));
      }, 500);
    }

    if (prevPage === 'game') {
      userInfo?.id &&
        isLoggedIn() &&
        escGame({ id: Number(localStorage.getItem('game-id')) }).then((res) => {
          if (res.data.code === 200) {
            toast.success(res.data?.msg ?? t.escGameSuccess);
            //show recharge bonus
            setTimeout(() => {
              if (localStorage.getItem('rechargeBonusData')) dispatch(setActiveModal(DATA_MODAL.RECHARGE_BONUS));
            }, 200);

            setTimeout(() => {
              getAccountBalance();
            }, 1000);
          } else dispatch(setActiveModal(DATA_MODAL.POINTS_TRANSFER_FAILED));

          setTimeout(() => {
            localStorage.removeItem('game-id');
          }, 2000);
        });
    } else {
      userInfo?.id && isLoggedIn() && getAccountUserInfo();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn() && userInfo.id) {
      if (!localStorage.getItem('announcements-called')) {
        callAnnouncement();
      }
    }
  }, [userInfo.id]);

  useEffect(() => {
    if (prevPage === 'loginRegister-page') {
      dispatch(setFourthModal(DATA_MODAL.PINDUODUO));
      localStorage.setItem('redEnvelope', '1');
    } else if (prevPage === 'pinduoduo-page') {
      dispatch(setActiveModal(DATA_MODAL.RECHARGE_BONUS));
      localStorage.setItem('recharge-bonus', '1');
    } else if (prevPage === 'recharge-bonus-page') {
      if (!localStorage.getItem('recharge-bonus')) {
        return;
      }
      if (!!announcementData?.length) {
        dispatch(setThirdModal(DATA_MODAL.ILUSTRAR));
      }
      dispatch(setIsPopup(false));
      if (userInfo?.accountCharge === 0 && userInfo?.firstRechargeShow === true) {
        localStorage.setItem('prev-modal', 'login-register');
        dispatch(setActiveModal(DATA_MODAL.FIRST_RECHARGE));
      } else {
        if (!!otherDialogAnnouncementsData?.length) {
          dispatch(setSecondModal(DATA_MODAL.OTHER_ANNOUNCEMENT));
        }
      }
      localStorage.removeItem('recharge-bonus');
    }
  }, [prevPage, announcementData, otherDialogAnnouncementsData]);

  const initLogin = () => {
    if (isAdjust && !userAdid) return;
    const directLogin = localStorage.getItem('firstLogin');
    if (initData?.directLogin && !directLogin) {
      return initializeGuardian();
    }
    setTimeout(() => {
      dispatch(setActiveModal(DATA_MODAL.LOGIN_MODAL));
    }, 1000);
  };

  const initializeGuardian = async (validate?: string) => {
    const NEGuardian = await require('@/scripts/YiDunProtector-Web-2.0.3');
    if (NEGuardian) {
      const otp = localStorage.getItem('otp');
      if (!!otp) return;
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
            ...(isAdjust ? { adjustId: userAdid } : {}),
            ...(isAdjust ? { isFromAdjust: true } : {}),
            ...(fcmToken ? { fcmToken } : {}),
            token: data?.token,
          }).then(async (res) => {
            if (res?.data?.code === 200) {
              dispatch(setUserInfo(res?.data?.data));
              dispatch(setActiveModal(DATA_MODAL.CLOSE));
              toast.success(res?.data?.msg ?? t.success);
              // dispatch(setPrevPage('pinduoduo'));
              dispatch(setPrevPage('loginRegister-page'));
              localStorage.setItem('firstLogin', '1'); // this is a random number
              // Pixel.trackCustom('LoginDevice', {});
              getAccountUserInfo();
            } else {
              toast.error(res?.data?.msg);
            }
            return res?.data?.data;
          });
        }
      });
    }
  };

  const fetchGameTypes = async () => {
    try {
      const res = await getGameTypes();
      const gamesTypeSelection = res?.data?.rspGameTypes;
      dispatch(setGamesTypeItems(gamesTypeSelection));
      if (!activeGamesType) {
        dispatch(setActiveGamesType(gamesTypeSelection[0]));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const callAnnouncement = async () => {
    if (!userInfo?.id) return;
    await announcement().then(({ code, data }) => {
      if (code === 200) {
        const filteredAnnouncement = data.filter((item) => item.homePrompt === 1);
        if (filteredAnnouncement?.length > 0) {
          dispatch(setAnnouncements(filteredAnnouncement));
        }
      }
    });
    await otherAnnouncement().then(({ code, data }) => {
      if (code === 200) {
        const buttonClickData = data.filter(
          (announcement) => announcement?.showType === ANNOUNCEMENT_SHOW_TYPE.BUTTON_CLICK,
        );
        const dialogData = data.filter((announcement) => announcement?.showType === ANNOUNCEMENT_SHOW_TYPE.DIALOG);
        if (!!buttonClickData?.length) {
          dispatch(setButtonClickAnnouncements(buttonClickData));
        }
        if (!!dialogData?.length) {
          dispatch(setOtherDialogAnnouncementsData(dialogData));
        }
      }
    });
  };

  return (
    <AnimatePresence key={'home'}>
      <motion.div
        key={'logo'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.homeWrapper}
      >
        <div className={styles.homeContent}>
          <Header />
          {gamesTypeItems?.map((item) => {
            return (
              activeGamesType?.id === item?.id && (
                <GameList
                  key={item?.id}
                  gameTypeId={item.type}
                  gameListId={item?.id}
                />
              )
            );
          })}
          <Footer />
        </div>
      </motion.div>
      <SideNotification />
    </AnimatePresence>
  );
};

export default Home;
