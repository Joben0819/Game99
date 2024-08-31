import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { DATA_MODAL } from '@/constants/enums';
import { setPageLoad } from '@/reducers/appData';
import { receiveVipGift } from '@/services/api';
import { motion } from 'framer-motion';
import { debounce } from 'lodash-es';
import { Navigation } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import Button from '@/components/Customs/Button';
import CustomSwiper from '@/components/Customs/CustomSwiper';
import { useAppDispatch, useAppSelector } from '@/store';
import { staticImport } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import Bonus from '../Bonus';
import CS from '../CS';
import Rescue from '../Rescue';
import styles from './styles.module.scss';

const Content = () => {
  const router = useRouter();
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { getAccountUserInfo, getVipGiftInfoRequest } = useWithDispatch();
  const swiperRef = useRef<any>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [isClickable, setIsClickable] = useState<boolean>(true);
  const { vipGiftInfo } = useAppSelector((state) => state.appData);
  const swiper = swiperRef.current;

  useEffect(() => {
    return () => {
      dispatch(setPageLoad(false));
    };
  }, []);

  const handleClick = (direction: string) => {
    if (swiper) {
      if (direction === 'prev' && !swiper.isBeginning) {
        swiper.slidePrev();
        setIsClickable(true);
      } else if (direction === 'next' && !swiper.isEnd) {
        swiper.slideNext();
        setIsClickable(false);
      }
    }
  };

  const collectLevelBonus = debounce((type: number) => {
    receiveVipGift({ type: type })
      .then((res) => {
        if (res.data?.code === 200) {
          toast.success(res?.data?.msg ?? t.common.collected);
          getVipGiftInfoRequest();
        } else {
          toast.error(res?.data?.msg);
        }
      })
      .finally(() => {
        getAccountUserInfo();
      });
  }, 500);

  return (
    <div className={styles.contentContainer}>
      <CustomSwiper
        ref={swiperRef}
        modules={[Navigation]}
        className={styles.vipSwiper}
        spaceBetween={20}
        slidesPerView={'auto'}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
      >
        <SwiperSlide className={styles.slides}>
          <Rescue />
        </SwiperSlide>
        <SwiperSlide className={styles.slides}>
          <Bonus
            collectLevelBonus={collectLevelBonus}
            vipGiftInfoList={vipGiftInfo}
            type='upgrade'
          />
        </SwiperSlide>
        <SwiperSlide className={styles.slides}>
          <Bonus
            collectLevelBonus={collectLevelBonus}
            vipGiftInfoList={vipGiftInfo}
            type='weekly'
          />
        </SwiperSlide>
        <SwiperSlide className={styles.slides}>
          <Bonus
            collectLevelBonus={collectLevelBonus}
            vipGiftInfoList={vipGiftInfo}
            type='monthly'
          />
        </SwiperSlide>
        <SwiperSlide className={styles.slides}>
          <CS />
        </SwiperSlide>
      </CustomSwiper>
      <motion.button
        whileTap={{ scale: isClickable ? 1 : 0.9 }}
        ref={prevRef}
        className={styles.prevBtn}
        onClick={() => handleClick('prev')}
      >
        <Image
          sizes='20vw'
          alt='logo'
          src={staticImport.prev_btn}
          fill
          quality={100}
          placeholder='blur'
        />
      </motion.button>
      <motion.button
        whileTap={{ scale: isClickable ? 0.9 : 1 }}
        ref={nextRef}
        className={styles.nextBtn}
        onClick={() => handleClick('next')}
      >
        <Image
          sizes='20vw'
          alt='next'
          src={staticImport.next_btn}
          fill
          quality={100}
          placeholder='blur'
        />
      </motion.button>
      <Button
        width={2.7}
        className={styles.rechargeBtn}
        variant='orange'
        text={t.vip.topUp}
        onClick={() => {
          localStorage.setItem('recent-modal', DATA_MODAL.VIP);
          dispatch(setPageLoad(true));
          router.push('/recharge');
        }}
      />
    </div>
  );
};

export default Content;
