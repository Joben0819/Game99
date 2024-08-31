import { ComponentType, FC } from 'react';
import { DATA_MODAL } from '@/constants/enums';
import LoginModal from '../LoginModal';
import Settings from '../Settings';
import {
  Activities,
  AddToHome,
  Announcement,
  BetRecords,
  Cellular,
  ChangeAvatar,
  DailyBonus,
  DownloadTip,
  FirstRecharge,
  FundoModal,
  Ilustrar,
  LoginRegister,
  Mail,
  NextLevel,
  OtherAnnouncement,
  PaymentPage,
  Pinduoduo,
  PointsTransferFailed,
  ProfileForm,
  RechargeBonus,
  RechargeRecord,
  RescueFund,
  SupportComponent,
  Vip,
  WithdrawRecords,
  WithdrawalPassword,
} from './dynamic-import';

const modals: Record<string, ComponentType<{}>> = {
  [DATA_MODAL.ACTIVITIES]: Activities,
  [DATA_MODAL.BIND_PHONE]: ProfileForm,
  [DATA_MODAL.BIND_EMAIL]: ProfileForm,
  [DATA_MODAL.BIND_GOOGLE_EMAIL_BONUS]: ProfileForm,
  [DATA_MODAL.FIRST_RECHARGE]: FirstRecharge,
  [DATA_MODAL.VIP]: Vip,
  [DATA_MODAL.DAILY_BONUS]: DailyBonus,
  [DATA_MODAL.MAIL]: Mail,
  [DATA_MODAL.RESCUE_FUND]: RescueFund,
  [DATA_MODAL.FUNDO_MODAL]: FundoModal,
  [DATA_MODAL.ILUSTRAR]: Ilustrar,
  [DATA_MODAL.NEXT_LEVEL]: NextLevel,
  [DATA_MODAL.ANNOUNCE]: Announcement,
  [DATA_MODAL.ADD_TO_HOME]: AddToHome,
  [DATA_MODAL.WITHDRAWPASS]: WithdrawalPassword,
  [DATA_MODAL.RECHARGE_RECORDS]: RechargeRecord,
  [DATA_MODAL.WITHDRAW_RECORDS]: WithdrawRecords,
  [DATA_MODAL.BET_RECORDS]: BetRecords,
  [DATA_MODAL.CHANGE_AVATAR]: ChangeAvatar,
  [DATA_MODAL.DOWNLOAD_TIP]: DownloadTip,
  [DATA_MODAL.LOGIN]: LoginRegister,
  [DATA_MODAL.LOGIN_MODAL]: LoginModal,
  [DATA_MODAL.PHONE]: Cellular,
  [DATA_MODAL.SUPPORT]: SupportComponent,
  [DATA_MODAL.SETTINGS]: Settings,
  [DATA_MODAL.OTHER_ANNOUNCEMENT]: OtherAnnouncement,
  [DATA_MODAL.PAYMENT]: PaymentPage,
  [DATA_MODAL.POINTS_TRANSFER_FAILED]: PointsTransferFailed,
  [DATA_MODAL.PINDUODUO]: Pinduoduo,
  [DATA_MODAL.RECHARGE_BONUS]: RechargeBonus,
};

type ModalProps = {
  modalType: string;
};

const Modal: FC<ModalProps> = ({ modalType }) => {
  const ModalComponent = modals[modalType];
  return <ModalComponent />;
};

export default Modal;
