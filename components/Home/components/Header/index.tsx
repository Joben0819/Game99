import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import toast from 'react-hot-toast';
import { CONTENT_BY_JUMPTYPE, IDLE_TIMEOUT } from '@/constants/app';
import { APK_EVENT, BIND_BONUS, BIND_MODAL, DATA_MODAL, JUMP_TYPE } from '@/constants/enums';
import { setActiveGamesType, setActiveInviteContent, setActiveModal, setPrevPage, setMessages, setPageLoad } from '@/reducers/appData';
import { TAnnouncementTypes } from '@/services/response-type';
import { useIdle } from '@uidotdev/usehooks';
import { FreeMode } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import CustomSwiper from '@/components/Customs/CustomSwiper';
import HeaderItemHolder from '@/components/Customs/HeaderItemHolder';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  getGoogleLoginLink,
  getMailMessages,
  isHuaweiBrowser,
  isLoggedIn,
  isValidURL,
  triggerApkEvent,
} from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import Jackpot from '../Jackpot';
import TabBar from '../TabBar';
import UserBalanceInfo from '../UserBalanceInfo';
import styles from './index.module.scss';

const Header = () => {
  const router = useRouter();
  const path = usePathname();
  const t = useTranslations();
  const isIdle = useIdle(IDLE_TIMEOUT);
  const dispatch = useAppDispatch();
  const { getNewLoginMethods } = useWithDispatch();
  const {
    activeGamesType,
    gamesTypeItems,
    language,
    activeModal,
    initData,
    loginMethodList,
    buttonClickAnnouncements,
  } = useAppSelector((state) => state.appData);
  const bonusData = loginMethodList.displayIcon;
  const { getRescueBonusDetails } = useWithDispatch();
  const { userInfo } = useAppSelector((state) => state.userData);
  const { firstRechargeShow, accountCharge, phone, email } = userInfo;
  const swiperRef = useRef<any>(null);
  const isPhoneAuthRequired = loginMethodList.dataList.some((list) => list.type === 'BIND_PHONE_BONUS');
  const isEmailAuthRequired = loginMethodList.dataList.some(
    (list) =>
      list.type === 'BIND_GOOGLE_EMAIL_BONUS' || list.type === 'BIND_EMAIL_BONUS' || list.type === 'BIND_GOOGLE_BONUS',
  );

  useEffect(() => {
    return () => {
      dispatch(setPageLoad(false));
    };
  }, []);

  useEffect(() => {
    if (!activeGamesType && gamesTypeItems) {
      dispatch(setActiveGamesType(gamesTypeItems[0]));
    }
  }, [activeGamesType]);

  useEffect(() => {
    if (!!userInfo?.id && isLoggedIn()) {
      getMsg();
      const timeOut = setTimeout(() => {
        if (!localStorage.getItem('isNewLoginMethodsUpdated')) {
          getNewLoginMethods();
          localStorage.setItem('isNewLoginMethodsUpdated', '1');
        }
      }, 100);
      return () => clearTimeout(timeOut);
    }
  }, [userInfo.id, language]);

  useEffect(() => {
    if (activeModal === DATA_MODAL.CLOSE && path === '/') {
      const fetchMessages = () => {
        if (userInfo?.id && isLoggedIn()) {
          getMsg();
        }
      };
      const timer = setInterval(fetchMessages, 60000);
      const cleanup = () => clearInterval(timer);
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          cleanup();
        } else if (isIdle) {
          cleanup();
        } else {
          const shortIdleTimer = setTimeout(cleanup, 30000);
          return () => clearTimeout(shortIdleTimer);
        }
      };
      window.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        cleanup();
        window.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [activeModal, path, userInfo?.id, isIdle]);

  // useEffect(() => {
  //   const scrollableRight = document.querySelector('#scrollableRight');
  //   scrollableRight?.scrollTo({
  //     left: scrollableRight.scrollWidth - scrollableRight.clientWidth,
  //     behavior: 'smooth',
  //   });
  // }, []);

  const isAuthRequired = () => {
    if (!isLoggedIn()) return false;

    const isFullyAuthenticated = !!phone && !!email;

    if (isPhoneAuthRequired && !isEmailAuthRequired) return !phone;
    if (!isPhoneAuthRequired && isEmailAuthRequired) return !email;
    if (!isPhoneAuthRequired && !isEmailAuthRequired) return false;
    return !isFullyAuthenticated;
  };

  const memoizedTopMenu = useMemo(
    () => [
      {
        text: t.home.firstRecharge,
        icon: images.icon_first_recharge,
        modal: DATA_MODAL.FIRST_RECHARGE,
        display: isLoggedIn() && firstRechargeShow && accountCharge === 0,
      },
      {
        text: t.home.rescueFund,
        icon: images.icon_rescue_fund,
        modal: DATA_MODAL.RESCUE_FUND,
        display: true,
      },
      {
        text: t.home.authenticate,
        icon: images.icon_bind_phone,
        modal: DATA_MODAL.BIND_PHONE,
        display: isAuthRequired(),
      },
      {
        text: t.home.download,
        icon: images.icon_download,
        modal: 'download',
        display: true,
      },
    ],
    [firstRechargeShow, accountCharge, loginMethodList, language],
  );

  const handleClick = (modal: string) => {
    if (!isLoggedIn() && modal !== DATA_MODAL.SUPPORT) {
      dispatch(setActiveModal(DATA_MODAL.LOGIN_MODAL));
    } else {
      if (modal === DATA_MODAL.BIND_PHONE) {
        sessionStorage.setItem('Authenticacao', 'true');
        if (bonusData?.type === BIND_BONUS.GOOGLE) {
          window.location.href = getGoogleLoginLink();
          return;
        }
        dispatch(setActiveModal(BIND_MODAL[bonusData?.type as keyof typeof BIND_MODAL]));
      } else if (modal === DATA_MODAL.DOWNLOAD_TIP) {
        if (initData?.webUrl) {
          if (
            (userInfo?.phone == null || userInfo?.phone === '') &&
            (userInfo?.email == null || userInfo?.email === '')
          ) {
            dispatch(setActiveModal(DATA_MODAL.DOWNLOAD_TIP));
          } else {
            let url = initData.webUrl;
            if (userInfo?.inviterCode) {
              url += initData.webUrl.includes('?channelCode=')
                ? userInfo.inviterCode
                : `?channelCode=${userInfo.inviterCode}`;
            }
            window.open(url, '_blank');
          }
        } else {
          toast.error(t.toasts.noUrl);
        }
      } else if (modal === DATA_MODAL.FIRST_RECHARGE) {
        // Adjust.trackEvent({ eventToken: GAME99_EVENT.FIRST_RECHARGE_CLICK });
        triggerApkEvent(APK_EVENT.FIRST_RECHARGE_CLICK);
        dispatch(setActiveModal(DATA_MODAL.FIRST_RECHARGE));
        localStorage.setItem('prev-modal', 'header-recharge');
      } else if (modal === DATA_MODAL.RESCUE_FUND) {
        getRescueBonusDetails();
        triggerApkEvent(APK_EVENT.ENTER_CASHBACK);
        dispatch(setActiveModal(DATA_MODAL.RESCUE_FUND));
      } else {
        dispatch(setActiveModal(modal));
      }
    }
  };

  const getMsg = async () => {
    const msg = await getMailMessages();
    dispatch(setMessages(msg));
  };

  const handleRedirect = (url: string, recent: string, isRedirecting: boolean, activeContent?: string) => {
    localStorage.setItem('recent-modal', recent);
    dispatch(setPageLoad(isRedirecting));
    router.push(url);

    if (activeContent) dispatch(setActiveInviteContent(activeContent));
  };

  const handleAnnouncementBtnClick = (announcement: TAnnouncementTypes) => {
    if (!announcement) return;
    if (announcement?.activityTypeId) {
      localStorage.setItem('banner-clicked', String(announcement?.activityTypeId));
      dispatch(setActiveModal(DATA_MODAL.ACTIVITIES));
      return;
    }
    if (announcement?.jumpType) {
      const jumpType = announcement?.jumpType;
      const pushUrl = announcement?.url;
      const active = CONTENT_BY_JUMPTYPE[jumpType];
      if (active === 'external') {
        if (pushUrl && isValidURL(pushUrl)) window.open(pushUrl, '_blank');
        else toast.error(t.toasts.invalidUrl);
      } else if (active === 'recharge-page') {
        dispatch(setPageLoad(true));
        router.push('/recharge');
      } else if (active === 'referral-page') {
        if (jumpType === JUMP_TYPE.PINDUODUO)
          handleRedirect('/invite', DATA_MODAL.CLOSE, true, t.affiliate.redEnvelope);
        else handleRedirect('/invite', DATA_MODAL.ACTIVITIES, true, t.affiliate.invitationRules);
        dispatch(setPrevPage('other-page'));
        dispatch(setPageLoad(true));
        dispatch(setActiveModal(DATA_MODAL.CLOSE));
      } else {
        dispatch(setActiveModal(active));
      }
      return;
    }
    // localStorage.setItem('header-announce-btn-clicked', announcement?.id.toString());
    // dispatch(setActiveModal(DATA_MODAL.OTHER_ANNOUNCEMENT));
  };

  const swiperRightList = () => {
    return (
      <CustomSwiper
        ref={swiperRef}
        modules={[FreeMode]}
        className={styles.rightSwiper}
        slidesPerView={'auto'}
        freeMode={true}
      >
        {buttonClickAnnouncements?.map((item) => {
          return (
            <SwiperSlide
              key={item?.title}
              className={styles.slide}
            >
              <HeaderItemHolder
                handleAnnouncementBtnClick={handleAnnouncementBtnClick}
                announcement={true}
                item={item}
              />
            </SwiperSlide>
          );
        })}

        {memoizedTopMenu?.map((item) => {
          if (item.display) {
            return (
              <SwiperSlide
                key={item?.text}
                className={styles.slide}
              >
                <HeaderItemHolder
                  handleAnnouncementBtnClick={() => handleClick(item?.modal)}
                  item={item}
                />
              </SwiperSlide>
            );
          }
        })}
      </CustomSwiper>
    );
  };

  const overflowRightList = () => {
    return (
      <div
        className={styles.rightOverflow}
        id='scrollableRight'
      >
        {buttonClickAnnouncements?.map((item, idx) => {
          if (!item?.image) return;
          return (
            <HeaderItemHolder
              key={idx}
              handleAnnouncementBtnClick={handleAnnouncementBtnClick}
              announcement={true}
              item={item}
            />
          );
        })}
        {memoizedTopMenu?.map((item, idx) => {
          if (item.display) {
            return (
              <HeaderItemHolder
                key={idx}
                handleAnnouncementBtnClick={() => handleClick(item?.modal)}
                item={item}
              />
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className={styles.headerWrapper}>
      <UserBalanceInfo />
      <div className={styles.buttonIconGroup}>
        <div className={styles.left}>{initData?.showJackpot === '1' && <Jackpot />}</div>
        {!isMobile && swiperRightList()}
        {isMobile && isHuaweiBrowser() && (
          <>
            {screen?.orientation?.type.includes('landscape') && overflowRightList()}
            {screen?.orientation?.type.includes('portrait') && swiperRightList()}
          </>
        )}
        {isMobile && !isHuaweiBrowser() && overflowRightList()}
      </div>
      <div className={styles.tabs}>
        <TabBar />
      </div>
    </div>
  );
};

export default Header;
