//Response Types
import { EVENT_ACTIVITY_ENUM, FUND_DETAIL_MONEY, JUMP_TYPE } from '@/constants/enums';
import { ActivityMissionList, RepeatMissionList, TRSPGameInfo } from './types';

export type TGamesType = {
  id: number;
  name: string;
  icon: string;
  type: number;
};

export type TUserInfo = {
  accountCharge: number;
  accountNow: number;
  bonusMoney: number;
  codeNow: number;
  codeTotal: number;
  codeWill: number;
  dob: string;
  email: string;
  firstRechargeShow: boolean;
  hasPassword: boolean;
  hasRescueBonus: boolean;
  hasUsername: boolean;
  hasWithdrawPass: boolean;
  headImg: string;
  headImgId: string;
  id: string;
  inviterCode: string;
  isGoogleQrCodeActive: boolean;
  isNewUser: boolean;
  nextLevelIntegral: number;
  nickName: string;
  phone: string;
  rechargeCount: number;
  registerType: number;
  status: number;
  testMoneyStatus: number;
  token: string;
  updateVip: boolean;
  username: string;
  vip: number;
};

export type TGamePlatform = {
  cardIcon: string;
  icon: string;
  id: number;
  name: string;
};

export type TGameItem = {
  icon: string;
  id: number;
  isFavorite: boolean;
  name: string;
  gameCategory?: string;
  kindId?: number;
  largeIcon?: boolean;
  lotteryId?: number;
  maintain?: boolean;
  platformId?: number;
  recommend?: boolean;
};

export type TVipGiftInfoItem = {
  level: number;
  levelBonus: number;
  weekBonus: number;
  monthBonus: number;
  bcode: number;
  rescueBonusRate: number;
};

export type TVipGiftInfo = {
  vipSetList: TVipGiftInfoItem[];
  levelBonusStatus: number;
  weekBonusStatus: number;
  monthBonusStatus: number;
};

export type TPlatformBalanceItem = {
  money: number;
  platformId: number;
  platformName: string;
  icon: string;
};

export type TMessageItem = {
  content: string;
  createTime: string;
  id: number;
  status: number;
  title: string;
  type: string;
};

export type TLojaList = {
  id: number;
  amount: number;
  bonus: number;
  type: number;
  image: string;
};

export type TWithdrawLimit = {
  id: number;
  vipLevel: number;
  dailyWithdrawLimitTimes: number;
  withdrawLimitAmount: number;
  exceedWithdrawalFee: number;
  status: number;
};

export type TEnergyItem = {
  id: string;
  memberId: string;
  progressCounter: number;
  completionCount: number;
  progressPercentage: number;
  groupProgressPercentage: number;
  missionTypeId: number;
  complete: true;
  status: string;
  icon: string;
  description: string;
  cantClaimReason: string;
  rewards: number;
  rewardActivity: number;
};

export type TRepeatMissionItem = {
  id: string;
  memberId: string;
  progressCounter: number;
  completionCount: number;
  progressPercentage: number;
  groupProgressPercentage: number;
  missionTypeId: number;
  complete: true;
  status: string;
  icon: string;
  description: string;
  cantClaimReason: string;
  rewards: number;
  rewardActivity: number;
  missionTrigger?: string;
};

export type TGetAccountNow = {
  balance: number;
  bonusMoney: number;
};

export type TGetRescueBonusItem = {
  vip: number;
  loss: number;
  rescueBonusRate: number;
  rescueBonus: number;
  date: string;
  collected: number;
};

export type TCountryCodes = {
  country: string;
  countryCode: string;
  icon: string;
  sms?: boolean;
  whatsApp?: boolean;
  sort?: number;
};

export type TPayTypeList = {
  createBy?: string;
  createTime?: string;
  deviceType?: string;
  effect?: boolean;
  iconUrl?: string;
  id?: number;
  name?: string;
  openLevelMax?: number;
  openLevelMin?: number;
  recommend?: boolean;
  sort?: number;
  tex1?: string;
  tex2?: string;
  tex3?: string;
  tex4?: string;
  tex5?: string;
  type?: number;
  updateBy?: string;
  updateTime?: string;
  rate?: number;
};

export type TBankList = {
  bankIcon: string;
  bankName: string;
  id: number;
  sort?: number | string;
  type: string;
};

export type TCodeFlow = {
  charge: number;
  createTime: string;
  cur: number;
  des: string;
  income: number;
  status: number;
};

export type TWithdrawRecord = {
  color: string | null;
  fee: number;
  money: number;
  name: string | null;
  orderNo: string;
  remark: string;
  requestTime: string;
  status: number;
};

export type TEventBanner = {
  id: number;
  eventBanner: string;
  typeId: number;
};

export type TBonusByType = {
  money: number;
  description: string;
  destination?: string;
  multiplier?: number;
  type: string;
};

export type TGameCategoryList = {
  des: string;
  name: string;
  platforms: any;
};

export type TTradeTypes = {
  des: string;
  name: keyof typeof FUND_DETAIL_MONEY | null;
  type: number | null;
};

export type TRegistrationData = {
  backgroundImage: string;
  baseUrl: string;
  baseUrl2: string;
  id: string;
  inviterCode: string;
  referralBonusToday: number;
  referralBonusTotal: number;
  todayRegistered: number;
  totalRegistered: number;
};

export type TReferralData = {
  inviterId: string;
  level: number;
  bonus: number;
  time: string;
  bet: number;
};

export type TRegisteredData = {
  headImg: string;
  recharged: boolean;
  inviterId: string;
  registerTime: string;
  vip: number;
};

export type TInviterRules = {
  headRule: string;
  tier1: string;
  tier2: string;
  tier3: string;
  tierN: string;
};

export type TAnnouncementTypes = {
  id?: number;
  title?: string;
  image?: string | null;
  content?: string | null;
  jumpType?: JUMP_TYPE | null;
  activityTypeId?: number | null;
  imageSize?: number;
  url?: string | null;
  showType?: string;
};

export type TReferralInfoTypes = {
  invites: number | null;
  commissionReceived: number | null;
};

export type TCheckUserRedPacketResponseData = {
  code: number;
  data: boolean;
  hasNext: boolean;
  msg: string;
};
export type TRootResponse<TResponse> = {
  code: number;
  msg: string;
  data: TResponse;
  total: any;
  hasNext: boolean;
  otherData: any;
};

export type TBrowseInitData = {
  latestVersion: string;
  latestFore: string;
  downUrl: string;
  hasNew: boolean;
  updateText: string;
  customerUrl: string;
  customerUrl2: any;
  webUrl: string;
  starPic: string;
  heCai6: HeCai6;
  dnsId: string;
  dnsKey: string;
  defaultUrl: string;
  defaultOss: string;
  defaultCustUrl: string;
  captchaId: string;
  actionSwitch: string;
  productId: string;
  firstRechargeUrl: any;
  showPromote: string;
  maintain: string;
  showJackpot: string;
  currency: string;
};

export type HeCai6 = {
  reds: string[];
  blue: string[];
  green: string[];
};
export type TGetReferralInfoData = {
  invites: number;
  commissionReceived: number;
};

export type TAnnouncementData = {
  id: number;
  title: string;
  content: string;
  homePrompt: number;
  displayTime: any;
};

export type TNewLoginMethodsData = {
  displayIcon: TNewLoginMethodsDisplayIcon;
  dataList: TNewLoginMethodsDataList[];
};

export type TNewLoginMethodsDisplayIcon = {
  money: number;
  description: string;
  type: string;
};

export type TNewLoginMethodsDataList = {
  money: number;
  description: string;
  type: string;
};

export type TGetGameTypesData = {
  rspGameTypes: TRspGameType[];
  rspGameInfos: any[];
};

export type TRspGameType = {
  id: number;
  name: string;
  icon: string;
  type: number;
};

export type TGetAccountInfoData = {
  token: any;
  id: string;
  username: any;
  email: string;
  nickName: string;
  vip: number;
  dob: any;
  headImg: string;
  accountNow: number;
  accountCharge: number;
  codeNow: number;
  codeWill: number;
  codeTotal: number;
  nextLevelIntegral: number;
  status: number;
  testMoneyStatus: number;
  inviterCode: string;
  registerType: number;
  phone: any;
  hasPassword: boolean;
  hasWithdrawPass: boolean;
  isGoogleQrCodeActive: boolean;
  isDeviceIdChanged: boolean;
  isNewUser: boolean;
  rechargeCount: number;
  firstRecharge: number;
  tiktokPixel: any;
  tiktokAuth: any;
  updateVip: boolean;
  firstRechargeShow: boolean;
  hasRescueBonus: boolean;
  bonusMoney: number;
  headImgId: string;
  fcmToken: string;
};

export type TGetEventBannerListData = {
  id: number;
  eventBanner: string;
  typeId: number;
};

export type TGetMessageOnSitesData = {
  id: number;
  title: string;
  content: string;
  type: string;
  createTime: string;
  status: number;
};

export type TFundDetailsResponseData = {
  createTime: string;
  des: string;
  pay: number;
  income: number;
  total: number;
  totalBefore: number;
  type: number;
};

export type TBalanceByPlatformResponseData = {
  money: number;
  platformId: number;
  platformName: string;
  icon: string;
};

export type TConfigBonusResponseData = {
  minAmount: number;
  bonus: number;
  activityTypeId: number;
};

export type TRescueBonusResponseData = {
  vip: number;
  loss: number;
  rescueBonusRate: number;
  rescueBonus: number;
  date: string;
  collected: number;
};

export type TCountryCodeResponseData = {
  country: string;
  countryCode: string;
  icon: string;
  sort: number;
  sms?: boolean;
  whatsApp?: boolean;
};

export type TGameInfoGroupResponseData = {
  id: number;
  name: string;
  icon: string;
  cardIcon: string;
  rspGameInfos: TRSPGameInfo[];
};

export type TRegistrationListResponseData = {
  id: string;
  inviterCode: string;
  todayRegistered: number;
  totalRegistered: number;
  referralBonusToday: number;
  referralBonusTotal: number;
  baseUrl: string;
  baseUrl2: string;
  backgroundImage: string;
};

export type TInviterRulesResponseData = {
  headRule: string;
  tier1: string;
  tier2: string;
  tier3: string;
  tierN: string;
};

export type TReferralDetailsResponseData = {
  inviterId: string;
  level: number;
  bonus: number;
  time: string;
  bet: number;
};

export type TReferralReportResponseData = {
  inviterId: string;
  level: number;
  bonus: number;
  time: string;
  bet: number;
};

export type TReferralRegisteredResponseData = {
  inviterId: string;
  registerTime: string;
  recharged: boolean;
  vip: number;
  headImg: string;
};

export type TPayTypeListResponseData = {
  id: number;
  name: string;
  iconUrl: string;
  sort: number;
  recommend: boolean;
  effect: boolean;
  type: number;
  rate: number;
  deviceType: string;
  openLevelMin: number;
  openLevelMax: number;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  tex1: any;
  tex2: any;
  tex3: any;
  tex4: any;
  tex5: any;
};

export type TPayChannelListResponseData = {
  id: number;
  name: string;
  rechargeMin: number;
  rechargeMax: number;
  quickAmount: string;
  openLevelMin: number;
  openLevelMax: number;
  remark: any;
};

export type TRepeatMissionActivityListResponseData = {
  activityNum: number;
  activityProgressCounter: number;
  activityProgressCompleteCount: number;
  activityProgressPercentage: number;
  repeatMissionList: RepeatMissionList[];
  activityMissionList: ActivityMissionList[];
};

export type TVipSetListResponseData = {
  vipSetList: TVipSetList[];
  levelBonusStatus: number;
  weekBonusStatus: number;
  monthBonusStatus: number;
};
export type TVipSetList = {
  level: number;
  levelBonus: number;
  weekBonus: number;
  monthBonus: number;
  bcode: number;
  rescueBonusRate: number;
};

export type ActivityTypesData = {
  activityList: ActivityList[];
  activityTypeEnum?: EVENT_ACTIVITY_ENUM.RECHARGE | EVENT_ACTIVITY_ENUM.REGULAR | EVENT_ACTIVITY_ENUM.SPIN;
  id: number;
  name: string;
  url?: string;
  isUrl: boolean;
};

export type ActivityList = {
  id: number;
  icon: string;
  eventBanner: string;
  title: string;
  startEffect?: string;
  endEffect: any;
  content: string;
  eventConfig: EventConfig;
  effect: boolean;
  type: number;
  url: string;
  isDisplayHome: boolean;
  typeId: number;
  scheduleType: number;
  createTime: string;
  jumpStatus: boolean;
  internalJumpType: JUMP_TYPE | null;
  eventJumpStatus: boolean;
  eventJumpType?: string;
};

export type EventConfig = {
  tableData: TableData[];
  resetCycle: string;
  bonusMethod: string;
  depositMethod: any[];
  activityCondition: string;
  limitedRechargeSwitch: boolean;
};

export type TableData = {
  bonusAmount: BonusAmount;
  rewardLimit: any;
  depositAmount: any;
  activityDescription: any;
};

export type BonusAmount = {
  max: any;
  min: any;
};

export type TRouletteConfig = {
  minMoney: number;
  maxMoney: number;
  claimable: boolean;
  validUntil: number;
  termsConditions?: string;
};

export type TUsdtListData = {
  chainName: string;
  channelName: string;
  discountBill: number;
  discountBillStr: string;
  exchangeRate: string;
  id: string;
  rechargeAddress: string;
};

export type TRescueBonus = {
  vip: number;
  loss: number;
  rescueBonusRate: number;
  rescueBonus: number;
  date: string;
  collected: number;
};

export type TLoginEmailResponse = {
  token: string;
  id: string;
  username: any;
  email: string;
  nickName: string;
  vip: number;
  dob: any;
  headImg: string;
  accountNow: number;
  accountCharge: number;
  codeNow: number;
  codeWill: number;
  codeTotal: number;
  nextLevelIntegral: number;
  status: number;
  testMoneyStatus: number;
  inviterCode: string;
  registerType: number;
  phone: any;
  hasPassword: boolean;
  hasWithdrawPass: boolean;
  isGoogleQrCodeActive: boolean;
  isDeviceIdChanged: any;
  isNewUser: boolean;
  rechargeCount: number;
  firstRecharge: number;
  tiktokPixel: any;
  tiktokAuth: any;
  updateVip: any;
  firstRechargeShow: boolean;
  hasRescueBonus: boolean;
  bonusMoney: number;
  headImgId: string;
};

export type TDepositBonus = {
  rechargeAmount: number;
  bonus: number;
  bonusGoal: number;
  betAmount: number;
  accumulatedBets: number;
  returnPercentage: number;
  claimable: boolean;
  depositStep: number;
  validUntil: any;
  termsConditions: string;
};

export type TJackpotPrizeList = {
  money: string;
  platformId: number;
  platformName: string;
  gameId: number;
  icon: string;
  id: number;
};

export type TSideNotification = {
  content: string;
  devices: string;
  notificationType: string;
  title: string;
};

export type TWebviewList = {
  baseUrl?: string;
  name?: string;
  type?: string;
  id?: number;
};

export type TBonusRecord = {
  vip: number;
  loss: number;
  rescueBonusRate: number;
  rescueBonus: number;
  date: string;
  collected: number;
};

export type TListIncomeType = {
  name: string;
  translatedName: string;
};
