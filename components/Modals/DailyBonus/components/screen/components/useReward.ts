import { useEffect, useRef, useState } from 'react';
import { DAILY_BONUS_POPUP_CODE, DAILY_BONUS_STATUS } from '@/constants/enums';
import { useAppSelector } from '@/store';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import { useCollectDailyBonusMutation, useGetMemberBonusRewardsQuery } from '../../../index.rtk';
import { DisplayRewardProps } from './display-rewards';

export const useReward = ({ activeVip, setShowPopup }: DisplayRewardProps) => {
  const { getAccountBalance } = useWithDispatch();
  const swiperRef = useRef<any>(null);
  const [claimableDay, setClaimableDay] = useState<number>(0);
  const { id: userId, vip: userVipLvl } = useAppSelector((state) => state.userData.userInfo);
  const [collectDailyBonus, { isLoading: isCollecting }] = useCollectDailyBonusMutation();
  const { data: rewards = [], isFetching: isLoading } = useGetMemberBonusRewardsQuery({
    vipLevel: activeVip,
    memberId: userId,
  });
  const DAY_FOUR = 4;

  useEffect(() => {
    if (!!rewards.length) {
      const claimable = rewards.find((item) => item.status.code === DAILY_BONUS_STATUS.CLAIMABLE);
      setClaimableDay(claimable?.day ?? 0);
    }
  }, [rewards]);

  useEffect(() => {
    setTimeout(() => {
      if (claimableDay > DAY_FOUR) swiperSlideTo(claimableDay);
      else swiperRef?.current?.slideTo(0);
    }, 500);
  }, [claimableDay, rewards]);

  const handleCollect = async () => {
    const result: any = await collectDailyBonus({
      customKey: claimableDay,
      memberId: userId,
    });

    if (
      result?.data?.code === DAILY_BONUS_POPUP_CODE.DISPLAY_RECHARGE ||
      result?.data?.code === DAILY_BONUS_POPUP_CODE.NO_RECHARGE
    )
      setShowPopup({
        status: result?.data?.code,
        msg: result?.data?.msg,
      });

    if (result?.data?.code === 200) {
      getAccountBalance();
    }
  };

  const swiperSlideTo = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current?.slideTo(index);
    }
  };

  return { isLoading, isCollecting, claimableDay, userVipLvl, rewards, swiperRef, handleCollect };
};
