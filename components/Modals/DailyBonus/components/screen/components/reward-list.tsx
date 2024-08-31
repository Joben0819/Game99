import { FC } from 'react';
import { setIsPopup } from '@/reducers/appData';
import classNames from 'classnames';
import { SwiperSlide } from 'swiper/react';
import Button from '@/components/Customs/Button';
import CustomSwiper from '@/components/Customs/CustomSwiper';
import Loader from '@/components/Customs/Loader';
import { useAppDispatch } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import { DisplayRewardProps } from './display-rewards';
import Reward from './reward';
import { useReward } from './useReward';
import styles from './styles.module.scss';

const RewardList: FC<DisplayRewardProps> = ({ activeVip, setShowPopup }) => {
  const { isLoading, isCollecting, claimableDay, userVipLvl, rewards, swiperRef, handleCollect } = useReward({
    activeVip,
    setShowPopup,
  });
  const t = useTranslations().dailyBonus;
  const isLvlDisabled = userVipLvl < activeVip;
  const dispatch = useAppDispatch();

  return (
    <>
      {(isLoading || isCollecting) && <Loader radius='10' />}
      <CustomSwiper
        ref={swiperRef}
        className={styles.rewardSwiper}
        spaceBetween={6}
        slidesPerView={'auto'}
      >
        {rewards.map((reward) => (
          <SwiperSlide
            key={reward.day}
            className={styles.rewardSwiper__slide}
          >
            <Reward
              {...reward}
              isLvlDisabled={isLvlDisabled}
            />
          </SwiperSlide>
        ))}
      </CustomSwiper>
      <Button
        variant='orange'
        onClick={() => {
          handleCollect();
          if (isLvlDisabled) {
            dispatch(setIsPopup(true));
          }
        }}
        disabled={!claimableDay}
        text={t.collect}
        className={classNames(styles.collectBtn, { grayscale: !claimableDay })}
      />
    </>
  );
};

export default RewardList;
