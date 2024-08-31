import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ACTIVITY_TYPE, APK_EVENT, DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { TEnergyItem } from '@/services/response-type';
import { useAppDispatch, useAppSelector } from '@/store';
import { triggerApkEvent } from '@/utils/helpers';
import useToggle from '@/hooks/useToggle';
import { useTranslations } from '@/hooks/useTranslations';
import { useGetRepeatMissionActivityListQuery } from '../../index.rtk';

type MissionType = {
  missions: TEnergyItem[];
  progressPercentage: number;
  progressCounter: number;
};

export const useActivity = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations().activity;

  const {
    data: missions,
    isLoading,
    refetch: refetchMission,
  } = useGetRepeatMissionActivityListQuery({
    missionRepeatType: 'DAILY',
  });
  const [showPopup, togglePopUp] = useToggle(false);
  const [amountReward, setAmountReward] = useState<number>(0);
  const [messageReward, setMessageReward] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>(ACTIVITY_TYPE.EVENTS);
  const [headerProps, setHeaderProps] = useState<MissionType>({
    missions: [],
    progressPercentage: 0,
    progressCounter: 0,
  });
  const { dialogCount } = useAppSelector((state) => state.appData);

  useEffect(() => {
    const isMission = localStorage.getItem('activityType');
    let timeout: any;
    if (isMission) {
      setTab(ACTIVITY_TYPE.MISSION);
      triggerApkEvent(APK_EVENT.ENTER_TASK);
      timeout = setTimeout(() => {
        localStorage.removeItem('activityType');
      }, 500);
    }

    setHeaderProps({
      missions: missions?.activityMissionList ?? [],
      progressPercentage: missions?.activityProgressPercentage ?? 0,
      progressCounter: missions?.activityProgressCounter ?? 0,
    });

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }, [missions]);

  const onShowPopUp = (amount: number, message: string) => {
    setAmountReward(amount);
    setMessageReward(message);
    togglePopUp();
  };

  const closeModal = () => {
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
    // dispatch(activitiesApi.util.resetApiState());

    if (localStorage.getItem('prev-modal') === DATA_MODAL.OTHER_ANNOUNCEMENT) {
      dispatch(setActiveModal(DATA_MODAL.OTHER_ANNOUNCEMENT));
    }

    localStorage.removeItem('banner-clicked');
    localStorage.removeItem('recent-modal');
    sessionStorage.removeItem('eventJumpType');
    if (localStorage.getItem('prev-modal') === DATA_MODAL.FIRST_RECHARGE) {
      localStorage.removeItem('prev-modal');
      dispatch(setActiveModal(DATA_MODAL.FIRST_RECHARGE));
      localStorage.setItem('prev-modal', 'login-register');
    }

    if (localStorage.getItem('prev-modal') === 'header-recharge') {
      dispatch(setActiveModal(DATA_MODAL.FIRST_RECHARGE));
    }

    if (localStorage.getItem('prev-modal') === 'first-recharge') {
      dispatch(setActiveModal(DATA_MODAL.FIRST_RECHARGE));
      localStorage.setItem('recent-modal', 'first_recharge');
      if (dialogCount === 0) {
        localStorage.setItem('prev-modal', 'login-register');
      }
    }
    localStorage.removeItem('activityTypes');
  };

  const setTab = (tab: string) => setActiveTab(tab);

  const isEvent = () => {
    return activeTab === ACTIVITY_TYPE.EVENTS;
  };

  const handlePopUpClose = () => {
    togglePopUp();
    toast.success(messageReward ?? t.successCollect);
  };

  return {
    missions,
    activeTab,
    isLoading,
    showPopup,
    headerProps,
    amountReward,
    setTab,
    isEvent,
    closeModal,
    onShowPopUp,
    refetchMission,
    handlePopUpClose,
  };
};
