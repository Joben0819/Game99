import { useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import { setActiveGamesType } from '@/reducers/appData';
import { TGamesType } from '@/services/response-type';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { FreeMode } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import CustomSwiper from '@/components/Customs/CustomSwiper';
import { ImgWithFallback } from '@/components/Customs/ImgWithFallback';
import { useAppSelector } from '@/store';
import { isHuaweiBrowser } from '@/utils/helpers';
import { images } from '@/utils/resources';
import styles from './index.module.scss';

const TabBar = () => {
  const locale = useAppSelector((s) => s.appData.language);
  const dispatch = useDispatch();
  const swiperRef = useRef<any>(null);
  const { gamesTypeItems, activeGamesType } = useAppSelector((state) => state.appData);

  useEffect(() => {
    if (!localStorage.getItem('curr-tab')?.length) {
      gamesTypeItems && dispatch(setActiveGamesType(activeGamesType ?? gamesTypeItems[0]));
    } else {
      setTimeout(() => {
        localStorage.removeItem('curr-tab');
      }, 2000);
    }
  }, []);

  const handleTabClick = (gamesTypeItem: TGamesType) => {
    dispatch(setActiveGamesType(gamesTypeItem));
    localStorage.removeItem('platformId');
  };

  const overflowList = () => {
    return (
      <div className={styles.tabsOverflow}>
        {gamesTypeItems?.length! > 0 &&
          gamesTypeItems?.map((gamesTypeItem) => {
            return (
              <motion.div
                key={gamesTypeItem?.id}
                whileTap={{ scale: 0.9 }}
                className={classNames(styles.tabItem, {
                  [styles.activeItem]: gamesTypeItem?.id === activeGamesType?.id,
                })}
                onClick={() => handleTabClick(gamesTypeItem)}
              >
                <div className={styles.tabIconImg}>
                  <ImgWithFallback
                    sizes='30vw'
                    alt='Game Type'
                    src={gamesTypeItem?.icon ?? images.mt}
                    fill
                    loadingPlaceholder={images.mt}
                    quality={100}
                  />
                </div>
                <span
                  data-lang={locale}
                  data-textafter={gamesTypeItem?.name}
                >
                  {gamesTypeItem?.name}
                </span>
              </motion.div>
            );
          })}
      </div>
    );
  };

  const swiperList = () => {
    return (
      <CustomSwiper
        ref={swiperRef}
        modules={[FreeMode]}
        className={styles.tabsSwiper}
        slidesPerView={'auto'}
        freeMode={true}
      >
        {gamesTypeItems?.length! > 0 &&
          gamesTypeItems?.map((gamesTypeItem) => {
            return (
              <SwiperSlide
                key={gamesTypeItem?.id}
                className={styles.slide}
                onClick={() => handleTabClick(gamesTypeItem)}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={classNames(styles.tabItem, {
                    [styles.activeItem]: gamesTypeItem?.id === activeGamesType?.id,
                  })}
                >
                  <div className={styles.tabIconImg}>
                    <ImgWithFallback
                      sizes='30vw'
                      alt='Game Type'
                      src={gamesTypeItem?.icon ?? images.mt}
                      fill
                      quality={100}
                      loadingPlaceholder={images.mt}
                    />
                  </div>
                  <span
                    data-lang={locale}
                    data-textafter={gamesTypeItem?.name}
                  >
                    {gamesTypeItem?.name}
                  </span>
                </motion.div>
              </SwiperSlide>
            );
          })}
      </CustomSwiper>
    );
  };

  return (
    <div className={classNames([styles.tabsList], { [styles.noData]: gamesTypeItems?.length! <= 0 })}>
      {!isMobile && swiperList()}
      {isMobile && isHuaweiBrowser() && (
        <>
          {screen?.orientation?.type.includes('landscape') && overflowList()}
          {screen?.orientation?.type.includes('portrait') && swiperList()}
        </>
      )}
      {isMobile && !isHuaweiBrowser() && overflowList()}
    </div>
  );
};

export default TabBar;
