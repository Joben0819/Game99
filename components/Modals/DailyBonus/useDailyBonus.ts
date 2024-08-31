import { useCallback, useState } from 'react';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal, setSecondModal } from '@/reducers/appData';
import { TDailyBonusShowPopUp } from '@/services/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { hasAnnounceJumpType, hasEventJumpType } from '@/utils/helpers';

export const useDailyBonus = () => {
  const dispatch = useAppDispatch();
  const userVipLvl = useAppSelector((state) => state.userData.userInfo.vip);
  const [activeVip, setActiveVip] = useState<number>(userVipLvl ?? 1);
  const [showPopUp, setShowPopUp] = useState<TDailyBonusShowPopUp>({
    status: 0,
    msg: '',
  });

  const handleClose = useCallback(() => {
    if (hasEventJumpType()) {
      dispatch(setActiveModal(DATA_MODAL.ACTIVITIES));
    } else if (hasAnnounceJumpType()) {
      dispatch(setActiveModal(DATA_MODAL.CLOSE));
      dispatch(setSecondModal(DATA_MODAL.OTHER_ANNOUNCEMENT));
      sessionStorage.removeItem('announceJumpType');
    } else {
      dispatch(setActiveModal(DATA_MODAL.CLOSE));
    }
  }, []);

  const handleVipChange = useCallback((vip: number) => {
    setActiveVip(vip);
  }, []);

  return { activeVip, showPopUp, setShowPopUp, handleClose, handleVipChange };
};
