import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { CONTENT_BY_JUMPTYPE } from '@/constants/app';
import { APK_EVENT, DATA_MODAL, JUMP_TYPE } from '@/constants/enums';
import { setActiveModal, setPrevPage, setActiveInviteContent, setPageLoad } from '@/reducers/appData';
import { getJumpActivity } from '@/services/api';
import { motion } from 'framer-motion';
import { Autoplay, Pagination } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import CustomSwiper from '@/components/Customs/CustomSwiper';
import { ImgWithFallback } from '@/components/Customs/ImgWithFallback';
import { useAppSelector } from '@/store';
import { filterImageSrc, isLoggedIn, triggerApkEvent } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import styles from './index.module.scss';

const HomeBanner = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { getEventsBanner } = useWithDispatch();
  const { userInfo } = useAppSelector((state) => state.userData);
  const { eventBannerList } = useAppSelector((state) => state.appData);
  const t = useTranslations().affiliate;

  useEffect(() => {
    getEventsBanner();
    return () => {
      dispatch(setPageLoad(false));
    };
  }, []);

  const chooseRandomItems = useCallback(() => {
    if (eventBannerList?.length <= 5) {
      return eventBannerList.slice();
    }
    const chosenItems = [];
    const shuffledArray = eventBannerList?.slice().sort(() => Math.random() - 0.5);

    if (!eventBannerList) {
      for (let i = 0; i < 5; i++) {
        chosenItems.push(shuffledArray && shuffledArray[i]);
      }
      return chosenItems;
    } else {
      return eventBannerList;
    }
  }, [eventBannerList]);

  const memoizedItems = useMemo(() => chooseRandomItems(), [eventBannerList]);

  const handleRedirect = (url: string, recent: string, isRedirecting: boolean, activeContent?: string) => {
    localStorage.setItem('recent-modal', recent);
    dispatch(setPageLoad(isRedirecting));
    router.push(url);

    if (activeContent) dispatch(setActiveInviteContent(activeContent));
  };

  const handleEventClick = (id: number, typeId: number) => {
    triggerApkEvent(APK_EVENT.BANNER_CLICK);
    getJumpActivity({
      activityId: String(id),
      memberId: userInfo.id,
    })
      .then((res) => {
        if (res?.data.code === 200) {
          if (res?.data?.data?.jumpStatus) {
            localStorage.setItem('from-banner', '1');
            const jumpType = res?.data?.data?.internalJumpType as JUMP_TYPE;
            const active = CONTENT_BY_JUMPTYPE[jumpType];
            if (active === 'recharge-page') {
              dispatch(setPageLoad(true));
              router.push('/recharge');
            } else if (active === 'referral-page') {
              if (jumpType === JUMP_TYPE.PINDUODUO) handleRedirect('/invite', DATA_MODAL.CLOSE, true, t.redEnvelope);
              else handleRedirect('/invite', DATA_MODAL.CLOSE, true, t.invitationRules);
              localStorage.setItem('eventJumpType', jumpType);
              dispatch(setPrevPage('other-page'));
              dispatch(setPageLoad(true));
              dispatch(setActiveModal(DATA_MODAL.CLOSE));
            } else {
              dispatch(setActiveModal(active));
            }
          } else {
            localStorage.setItem('banner-clicked', String(typeId));
            dispatch(setActiveModal(DATA_MODAL.ACTIVITIES));
          }
        }
      })
      .catch((e) => console.error(e));
  };

  return !!eventBannerList?.length ? (
    <motion.div
      initial={{ x: '100vw' }}
      animate={{
        x: 0,
        transition: {
          type: 'spring',
          duration: 0.8,
          bounce: 0.2,
        },
      }}
      className={styles.homeBannerWrapper}
    >
      {memoizedItems?.length > 0 && (
        <CustomSwiper
          modules={[Autoplay, Pagination]}
          className={styles.mainBanner}
          loop={true}
          slidesPerView={1}
          centeredSlides={true}
          autoplay={{
            delay: 4000,
          }}
          spaceBetween={'1rem'}
        >
          {/* @ts-ignore */}
          {memoizedItems?.map((item) => {
            return (
              <SwiperSlide
                key={item?.id}
                onClick={() => {
                  if (isLoggedIn()) {
                    handleEventClick(item?.id, item?.typeId);
                  } else {
                    dispatch(setActiveModal(DATA_MODAL.LOGIN_MODAL));
                  }
                }}
              >
                <div className={styles.bannerImg}>
                  <ImgWithFallback
                    sizes='50vw'
                    alt='Banner'
                    src={filterImageSrc(item?.eventBanner) ?? images.default_banner}
                    fill
                    quality={100}
                    loadingPlaceholder={images.default_banner}
                    priority
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </CustomSwiper>
      )}
    </motion.div>
  ) : null;
};

export default HomeBanner;
