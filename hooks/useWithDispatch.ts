import { useRouter } from 'next/navigation';
import { ANNOUNCEMENT_SHOW_TYPE } from '@/constants/enums';
import {
  resetAppDataWithExceptions,
  setButtonClickAnnouncements,
  setEventBannerList, // setIsPopup,
  setLoginMethodList,
  setPageLoad,
  setRescueDetails,
  setSlowInternet,
  setVipGiftInfo,
} from '@/reducers/appData';
import { resetPaymentData } from '@/reducers/paymentData';
import { initialState, resetUserDataState, setUserBalance, setUserInfo } from '@/reducers/userData';
import {
  clearToken,
  getAccountInfo,
  getAccountNow,
  getEventBannerList,
  getRescueBonus,
  getVipGiftInfo,
  logout,
  newLoginMethods,
  otherAnnouncement,
  updateFcmToken,
} from '@/services/api';
import { TGetAccountNow } from '@/services/response-type';
import { getMessaging, getToken } from 'firebase/messaging';
import { jackpotPrizeListApi } from '@/components/Home/components/Jackpot/jackpot.rtk';
import { depositBonusApi } from '@/components/Modals/Atividade/components/RechargeAndCodeBonus/rechargeBonus.rtk';
import { rouletteApi } from '@/components/Modals/Atividade/components/coinRoulette/roulette.rtk';
import { activitiesApi } from '@/components/Modals/Atividade/index.rtk';
import { dailyBonusApi } from '@/components/Modals/DailyBonus/index.rtk';
import { prizePoolApi } from '@/components/Modals/PrizePool/index.rtk';
import { useAppDispatch, useAppSelector } from '@/store';
import firebaseApp from '@/utils/firebase';

const { VAPID_KEY } = require('@/server/' + process.env.SITE);

export const useWithDispatch = () => {
  const { push } = useRouter();
  const dispatch = useAppDispatch();

  const getEventsBanner = async () => {
    await getEventBannerList().then(({ code, data }) => {
      if (code === 200) {
        const eventBannerList = data.filter((event) => !!event.eventBanner);
        dispatch(setEventBannerList(eventBannerList));
      }
    });
  };

  const getNewLoginMethods = async () => {
    await newLoginMethods().then(({ code, data }) => {
      if (code === 200) {
        dispatch(setLoginMethodList(data));
      }
    });
  };

  const getAccountUserInfo = async () => {
    await getAccountInfo().then(({ code, data }) => {
      const { accountNow, bonusMoney, fcmToken } = data;
      if (code === 200) {
        const balance: TGetAccountNow = {
          balance: accountNow,
          bonusMoney,
        };
        dispatch(setUserBalance(balance));
        dispatch(setUserInfo(data));

        const fcmTokenFromStorage = localStorage.getItem('fcm-token');
        if (fcmTokenFromStorage && (!fcmToken || fcmToken !== fcmTokenFromStorage)) {
          updateFcmToken({ fcmToken: fcmTokenFromStorage });
        }
        if (!fcmTokenFromStorage) {
          const messaging = getMessaging(firebaseApp);
          getToken(messaging, {
            vapidKey: VAPID_KEY,
          }).then((token) => {
            localStorage.setItem('fcm-token', token);
            updateFcmToken({ fcmToken: token });
          }).catch(() => {
            console.warn('Notifications permission denied.')
          });
        }
      } else if (code === 401) {
        localStorage.removeItem('token');
        dispatch(resetUserDataState());
        dispatch(resetAppDataWithExceptions());
        sessionStorage.removeItem('data');
      }
    });
  };

  const userInfo = useAppSelector((s) => s.userData.userInfo);
  const getAccountBalance = async () => {
    await getAccountNow().then((res) => {
      if (res.data.code === 200) {
        dispatch(setUserBalance(res.data.data));
        dispatch(setUserInfo({ ...userInfo, bonusMoney: res.data.data?.bonusMoney }));
      }
    });
  };

  const logoutUser = async () => {
    await logout().then((res: any) => {
      if (res?.data?.code === 200) {
        var newDate = new Date();
        newDate.setSeconds(newDate.getSeconds() + 1);
        dispatch(setUserInfo(initialState.userInfo));
        dispatch(setUserBalance(initialState.userBalance));
        localStorage.removeItem('token');
        localStorage.removeItem('platformId');
        clearToken();
        localStorage.removeItem('otp');
        sessionStorage.removeItem('data');
        dispatch(prizePoolApi.util.resetApiState());
        dispatch(dailyBonusApi.util.resetApiState());
        dispatch(activitiesApi.util.resetApiState());
        dispatch(rouletteApi.util.resetApiState());
        dispatch(depositBonusApi.util.resetApiState());
        dispatch(jackpotPrizeListApi.util.resetApiState());
        dispatch(resetPaymentData());
        dispatch(resetAppDataWithExceptions());
        localStorage.removeItem('announceClicked');
        localStorage.removeItem('isSplashScreenLoaded');
        localStorage.removeItem('fcm-subscribed');
        localStorage.removeItem('isNewLoginMethodsUpdated');
        localStorage.removeItem('announcements-called');
        localStorage.removeItem('rechargeBonusData');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        push('/');
      }
    });
  };

  const resetInternetStatus = () => {
    dispatch(setPageLoad(false));
    dispatch(setSlowInternet(false));
  };

  const getBtnClickAnnouncements = () => {
    otherAnnouncement().then(({ code, data }) => {
      if (code === 200) {
        const buttonClickData = data.filter(
          (announcement) => announcement?.showType === ANNOUNCEMENT_SHOW_TYPE.BUTTON_CLICK,
        );
        dispatch(setButtonClickAnnouncements(buttonClickData));
      }
    });
  };

  const getVipGiftInfoRequest = async () => {
    await getVipGiftInfo().then(({ code, data }) => {
      if (code === 200) {
        dispatch(setVipGiftInfo(data));
      }
    });
  };

  const getRescueBonusDetails = async () => {
    await getRescueBonus().then(({ code, data }) => {
      if (code !== 200) return;
      if (data?.length < 1) return;
      dispatch(setRescueDetails(data));
    });
  };

  return {
    getEventsBanner,
    getNewLoginMethods,
    getAccountUserInfo,
    logoutUser,
    resetInternetStatus,
    getBtnClickAnnouncements,
    getVipGiftInfoRequest,
    getAccountBalance,
    getRescueBonusDetails,
  };
};
