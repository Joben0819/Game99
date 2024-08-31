import {
  APK_EVENT,
  DATA_LANG,
  DATA_MODAL,
  EVENT_ACTIVITY_ENUM,
  FUND_DETAIL_MONEY,
  JUMP_TYPE,
  LOGIN_MODAL,
  MissionRepeatType,
} from '@/constants/enums';
import {
  TAnnouncementData,
  TAnnouncementTypes,
  TBonusRecord,
  TEnergyItem,
  TEventBanner,
  TGamePlatform,
  TGamesType,
  TGetAccountNow,
  TJackpotPrizeList,
  TLojaList,
  TNewLoginMethodsData,
  TReferralInfoTypes,
  TRegistrationData,
  TSideNotification,
  TUserInfo,
  TVipGiftInfo,
} from './response-type';

export type TLanguage = {
  text: string;
  locale: DATA_LANG;
  code: string;
  icon: string;
  flag: string;
};

export type TMenu = {
  text: string;
  icon: string;
  modal?: DATA_MODAL;
  link?: string;
  apkEvent?: APK_EVENT;
};

export type TLoginEmail = {
  email: string;
  passwd: string;
  token: string;
  validate?: string;
};

export type TJoingame = {
  id: string;
};

export type TRegister = {
  email: string;
  passwd: string;
  confirmPasswd: string;
  code: number | string;
  deviceId?: string;
  inviterCode?: string;
  channelCode?: string;
  token?: string;
  adjustId?: string;
  isFromAdjust?: boolean;
};

export type TGetGameInfoGroup = {
  id: number;
  pageSize?: number;
  pageNum?: number;
};

export type TSendSMSVerifyCode = {
  phone: string;
  validate?: string;
};

export type TGetGameList = {
  id?: number;
  memberId?: string;
  category?: number;
  typeId?: number;
  platformId?: number;
  pageSize?: number;
  pageNum?: number;
  name?: string;
};

export type TGetBalanceByPlatform = {
  memberId: string;
  typeId?: number;
};

export type TUpdateFavorite = {
  memberId: string;
  gameId?: number;
};

export type MessageOnSitesType = {
  type: 'NEWS' | 'NOTIFICATION' | 'ROLLING_PANEL';
};

export type TReadMessageOnSites = {
  type: string;
  id: string;
};

export type TOnlineRecharge = {
  channelId: number;
  money: number | string;
  realIp?: string | null;
  rechargeType?: string;
  rechargeActivityType?: string;
};

export type TContinueWithOtp = {
  inviterCode?: string;
  channelCode?: string;
  deviceId?: string;
  ip?: string;
  phoneModel?: string;
  token?: string;
};

export type TReceiveVipGift = {
  type: number;
};

export type TReadMessage = {
  id: number | null;
  type: string;
};

export type TReadAllMessage = {
  type: string;
};

export type TUnreadMessages = {
  type: string;
};

export type TBindCard = {
  realName: string;
  bankAccount?: string;
  bankAddress?: string;
  bankId?: number;
  type?: string;
  account?: string;
  cpfAccount?: string;
};

export type TWithdrawBank = {
  memberCardId: number;
  withdrawMoney: number;
  withdrawalPass: string;
};

export type TGameWithdrawal = {
  id: number;
};

export type TVerifyPassword = {
  password: string;
};

export type TEscGame = {
  id: number;
};

export type TBindPhone = {
  mobile: string;
  passwd: string;
};

export type TResetUserOtpSecret = {
  password: string;
};

export type TResetPassword = {
  oldPasswd: string;
  newPasswd: string;
};

export type TClaimMissionReward = {
  id: string;
  deviceId?: string;
  ip: string;
};

export type TGetEventDetails = {
  activityInfoId: string;
};

export type TGetRepeatMissionActivityList = {
  missionRepeatType: keyof typeof MissionRepeatType;
};

export type RepeatMissionList = {
  id: string;
  memberId: string;
  progressCounter: number;
  completionCount: number;
  progressPercentage: number;
  groupProgressPercentage: any;
  missionTrigger: string;
  missionTriggerTranslated: any;
  missionTypeId: number;
  complete: boolean;
  status: string;
  icon: string;
  description: string;
  cantClaimReason: any;
  rewards: number;
  rewardActivity: number;
  sort: number;
};

export type ActivityMissionList = {
  id: string;
  memberId: string;
  progressCounter: number;
  completionCount: number;
  progressPercentage: number;
  groupProgressPercentage: number;
  missionTrigger: any;
  missionTriggerTranslated: any;
  missionTypeId: number;
  complete: boolean;
  status: string;
  icon: string;
  description: string;
  cantClaimReason: any;
  rewards: number;
  rewardActivity: number;
  sort: number;
};

export type TRegisterCode = {
  email: string;
  validate?: string;
};

export type TForgetPassSendVerificationCode = {
  email: string;
  validate?: string;
};

export type TVerifyEmailCode = {
  email: string;
  code: string;
};

export type TResetForgetLoginPassword = {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
};

export type TMobileLogin = {
  mobile: string;
  code: string;
  token: string;
  channelCode?: string;
  adjustId?: string;
  isFromAdjust?: boolean;
};

export type TEvents = {
  id: number;
  type: number;
  icon: string;
  title: string;
  typeId: number;
  url: string;
  content: string;
  eventJumpStatus: boolean;
  eventJumpType: JUMP_TYPE;
  activityTypeEnum: EVENT_ACTIVITY_ENUM;
};

export type TMemberBonusRewards = {
  vipBonusInfoId?: number;
  vipLevel: number;
  customKey?: string;
  memberId?: string;
  customKeys?: string[];
};

export type TCollectBonusBonus = {
  vipBonusInfoId?: number;
  customKey: number;
  memberId: string;
};

export type TMemberBonusRewardsConfig = {
  day: number;
  rewardIcon: string;
  rewardType: string;
  rewardAmount: {
    max: string | null;
    min: string | null;
  };
  topUpRequirement: string | null;
  codingRequirement: string | null;
  status: {
    code: number;
    icon: string;
  };
};

export type TMessageItem = {
  content: string;
  createTime: string;
  id: number;
  status: number | null;
  title: string;
  type: string;
};

export type TJackpotPrize = {
  money: number;
  platformId: number;
  platformName: string;
  icon: string;
};

export type TLoginDevice = {
  username?: string;
  mobile?: string;
  code?: string;
  passwd?: string;
  email?: string;
  inviterCode?: string;
  channelCode?: string;
  deviceId?: string;
  ip?: string;
  phoneModel?: string;
  validate?: string;
  token?: string;
  accessToken?: string;
  adjustId?: string;
  isFromAdjust?: boolean;
};

export type TMissionActivities = {
  activityMissionList: TEnergyItem[];
  activityProgressCompleteCount: number;
  activityProgressCounter: number;
  activityProgressPercentage: number;
  repeatMissionList: TEnergyItem[];
};

export type TMobileBindPhone = {
  mobile: string;
  code: string;
};

export type TBindEmail = {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
};

export type TJumpActivity = {
  activityId: string;
  memberId: string;
};

export type TReferralDataPayload = { incomeSourceType: string; pageNum: number; pageSize: number; startDate: string };

export type TReferralReportPayload = { pageNum: number; pageSize: number; startDate: string; endDate: string };

export type TFindByTypeItem = {
  money: number;
  description: string;
  destination: string;
  multiplier: number;
  count: number;
  effectiveTime: string;
  inviterCode: string;
  device: number;
  type: string;
  displayIcon: boolean;
};

export type TUserToken = {
  userId: string;
  token: string;
};

export type TFundDetailsPayload = {
  enumReqTime: 'today' | 'yesterday' | 'month';
  enumMoney?: keyof typeof FUND_DETAIL_MONEY;
  pageNum?: number;
  pageSize?: number;
};

export type TRSPGameInfo = {
  id: number;
  name: string;
  icon: string;
  maintain: boolean;
  recommend: boolean;
  largeIcon: boolean;
  gameCategory: string;
};

export type TReferralRegisteredPayload = {
  pageNum?: number;
  pageSize?: number;
};

export type TPayChannelListPayload = {
  typeId: number;
};

export interface TWinnerList {
  memberId: string;
  amount: number;
  name: string;
}

export type TGameDataList = {
  gameId: string;
  allBet: string;
  cellScore: string;
  createTime: string;
  profit: number;
  status: number;
  agent: string;
  platformId: number;
};

export type TUsdtRechargePayload = {
  id: number;
  transactionId: string;
  rechargeNumber: number;
};

export type TMemberCard = {
  realName: string;
  cpfAccount: string;
  id: number;
  account: string;
  type: string;
  bankName?: string;
  bankId?: number;
  bankIcon?: string;
};
export type TRspWithdrawInfo = {
  canWithdrawMoney: number;
  accountNow: number;
  needBeat: number;
};

export type TBankMemberCard = {
  bankName: string;
  bankIcon: string;
  id: number;
  sort: number;
  account?: string;
};

export type TPaymentDataState = {
  activeBankMemberCard: TBankMemberCard;
  bankMemberCard: TBankMemberCard[];
  depositData: TLojaList;
  rspWithdrawInfo: TRspWithdrawInfo;
};

export type TUserDataState = {
  userInfo: TUserInfo;
  userAdid: string;
  userBalance: TGetAccountNow | null;
  loginEmail: string;
  profileIdToSet: number | null;
  registrationData: TRegistrationData | null;
  personalCenter: { dateFilter: 'today' | 'yesterday' | 'month'; activeTab: number };
  referralInfo: TReferralInfoTypes;
};

export type TAppDataState = {
  initData: any;
  language: DATA_LANG;
  addToHomeShown: boolean;
  slowInternet: boolean;
  isBackgroundMusicOn: boolean;
  isSoundEffectsOn: boolean;
  isPageLoading: boolean;
  isPopupOpen: boolean;
  secondModal: string;
  thirdModal: string;
  fourthModal: string;
  isOpenModal: boolean;
  showLoginModal: LOGIN_MODAL;
  loginMethodList: TNewLoginMethodsData;
  prevPage: string;
  eventBannerList: TEventBanner[];
  eventList: any[];
  messages: TMessageItem[];
  readMsgID: string[];
  currentMessage: TMessageItem;
  activeModal: string;
  activeInviteContent: string;
  redEnvelopeCurrentSeq: number;
  activeGamesType: TGamesType | null;
  platformList: TGamePlatform[];
  gamesTypeItems: TGamesType[] | null;
  gameUrl: string;
  otherAnnouncementCount: number;
  buttonClickAnnouncements: TAnnouncementTypes[] | null;
  dialogCount: number;
  rescueDetails: TBonusRecord[];
  vipGiftInfo: TVipGiftInfo | null;
  announcementData: TAnnouncementData[] | null;
  otherDialogAnnouncementsData: TAnnouncementTypes[] | null;
  sideNotification: TSideNotification;
  jackpotClickedPid: number;
  initialJackpotData: TJackpotPrizeList[];
  isSpinning: boolean;
};

export type TVerifyWhatsApp = {
  number: string;
  inputCode: string;
};

export type TSendWhatsAppVerifyCode = {
  number: string;
  validate?: string;
};

export type ADD_UTILITIES = { addUtilities: (utilities: any) => void };

export type TPushNotiSubscribe = {
  fcmToken: string;
};

export type TDailyBonusShowPopUp = {
  status: number;
  msg: string;
};

export type TAvatar = {
  icon: string;
  id: number;
  title: string;
};

export type ConfigRechargeType = {
  id: number;
  name: string;
  icon_url: string;
};

export type ConfigRechargeProps = {
  rechargeMoney: number;
  awardMoney: number;
  title: string;
  activityType: string;
  payTypeList: ConfigRechargeType[];
};
