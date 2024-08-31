import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { INTERNET_TIMEOUT } from '@/constants/app';
import { setSlowInternet } from '@/reducers/appData';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { useAppSelector } from '@/store';
import styles from './index.module.scss';

export const ComponentLoader = () => {
  const { isPageLoading } = useAppSelector((state) => state.appData);
  const [countdown, setCountdown] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSlowInternet(false));
    };
  }, []);

  useEffect(() => {
    const countdownTimer = isPageLoading
      ? setInterval(() => setCountdown((prevCountdown) => prevCountdown + 1), 1000)
      : undefined;
    if (isPageLoading) {
      if (countdown >= INTERNET_TIMEOUT) {
        dispatch(setSlowInternet(true));
      } else {
        dispatch(setSlowInternet(false));
      }
    } else {
      setCountdown(0);
    }
    return () => {
      dispatch(setSlowInternet(false));
      clearInterval(countdownTimer);
    };
  }, [isPageLoading, countdown, dispatch]);

  return (
    <div className={styles.loaderWrapper}>
      <LoadingIcon />
    </div>
  );
};

const LoginRegister = dynamic(() => import('../LoginRegister/index'), {
  loading: () => <ComponentLoader />,
});

const Activities = dynamic(() => import('../Atividade/index'), {
  loading: () => <ComponentLoader />,
});

const Profile = dynamic(() => import('../profile/index'), {
  loading: () => <ComponentLoader />,
});
const ProfileForm = dynamic(() => import('../profile/components/profile-form'), {
  loading: () => <ComponentLoader />,
});

const FirstRecharge = dynamic(() => import('../PrimeiraCompra/index'), {
  loading: () => <ComponentLoader />,
});

const Vip = dynamic(() => import('../Vip/index'), {
  loading: () => <ComponentLoader />,
});

const DailyBonus = dynamic(() => import('../DailyBonus/index'), {
  loading: () => <ComponentLoader />,
});

const Mail = dynamic(() => import('../mail'), {
  loading: () => <ComponentLoader />,
});

const RescueFund = dynamic(() => import('../RescueFund/index'), {
  loading: () => <ComponentLoader />,
});

const Ilustrar = dynamic(() => import('../Ilustrar/index'), {
  loading: () => <ComponentLoader />,
});

const NextLevel = dynamic(() => import('../nextLevel/index'), {
  loading: () => <ComponentLoader />,
});

const SupportComponent = dynamic(() => import('../Support/index'), {
  loading: () => <ComponentLoader />,
});

const Cellular = dynamic(() => import('../LoginRegister/Cellular/index'), {
  loading: () => <ComponentLoader />,
});

const Announcement = dynamic(() => import('../Announcement'), {
  loading: () => <ComponentLoader />,
});

const AddToHome = dynamic(() => import('../AddToHome'), {
  loading: () => <ComponentLoader />,
});

const InvitePage = dynamic(() => import('../Invite'), {
  loading: () => <ComponentLoader />,
});

const PaymentPage = dynamic(() => import('../PurchasePayment'), {
  loading: () => <ComponentLoader />,
});

const WithdrawalPassword = dynamic(
  () => import('../../Pages/WithdrawRecharge/withdraw/components/withdrawal-password'),
  {
    loading: () => <ComponentLoader />,
  },
);

const RechargeRecord = dynamic(() => import('../../Modals/Recharge/records'), {
  loading: () => <ComponentLoader />,
});

const WithdrawRecords = dynamic(() => import('../../Modals/WithdrawV2/records'), {
  loading: () => <ComponentLoader />,
});

const BetRecords = dynamic(() => import('../../Modals/WithdrawV2/bets'), {
  loading: () => <ComponentLoader />,
});

const ChangeAvatar = dynamic(() => import('../../Modals/profile/change-avatar'), {
  loading: () => <ComponentLoader />,
});

const DownloadTip = dynamic(() => import('../DownloadTip/index'), {
  loading: () => <ComponentLoader />,
});

const OtherAnnouncement = dynamic(() => import('../OtherAnnouncement/index'), {
  loading: () => <ComponentLoader />,
});

const FundoModal = dynamic(() => import('../fundoModal/index'), {
  loading: () => <ComponentLoader />,
});

const PointsTransferFailed = dynamic(() => import('../PointsTransferFailed/index'), {
  loading: () => <ComponentLoader />,
});

const Pinduoduo = dynamic(() => import('../Pinduoduo'), {
  loading: () => <ComponentLoader />,
});

const RechargeBonus = dynamic(() => import('../RechargeBonus'), {
  loading: () => <ComponentLoader />,
});

export {
  Activities,
  AddToHome,
  Announcement,
  BetRecords,
  Cellular,
  ChangeAvatar,
  DailyBonus,
  DownloadTip,
  FirstRecharge,
  Ilustrar,
  InvitePage,
  LoginRegister,
  Mail,
  NextLevel,
  OtherAnnouncement,
  PaymentPage,
  Profile,
  ProfileForm,
  RechargeRecord,
  RescueFund,
  SupportComponent,
  Vip,
  WithdrawRecords,
  WithdrawalPassword,
  FundoModal,
  PointsTransferFailed,
  Pinduoduo,
  RechargeBonus,
};
