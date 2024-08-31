import { REQUEST_METHOD, RewardLogsType } from '@/constants/enums';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  ActivityTypesData,
  TAnnouncementData,
  TAnnouncementTypes,
  TBalanceByPlatformResponseData,
  TBrowseInitData,
  TCheckUserRedPacketResponseData,
  TConfigBonusResponseData,
  TCountryCodeResponseData,
  TFundDetailsResponseData,
  TGameInfoGroupResponseData,
  TGetAccountInfoData,
  TGetEventBannerListData,
  TGetGameTypesData,
  TGetMessageOnSitesData,
  TGetReferralInfoData,
  TInviterRulesResponseData,
  TLoginEmailResponse,
  TNewLoginMethodsData,
  TPayChannelListResponseData,
  TPayTypeListResponseData,
  TReferralDetailsResponseData,
  TReferralRegisteredResponseData,
  TReferralReportResponseData,
  TRegistrationListResponseData,
  TRepeatMissionActivityListResponseData,
  TRescueBonusResponseData,
  TRootResponse,
  TRouletteConfig,
  TTradeTypes,
  TUsdtListData,
  TVipSetListResponseData,
} from './response-type';
import {
  MessageOnSitesType,
  TBindCard,
  TBindEmail,
  TBindPhone,
  TClaimMissionReward,
  TContinueWithOtp,
  TEscGame,
  TForgetPassSendVerificationCode,
  TFundDetailsPayload,
  TGameWithdrawal,
  TGetBalanceByPlatform,
  TGetEventDetails,
  TGetGameInfoGroup,
  TGetGameList,
  TGetRepeatMissionActivityList,
  TJoingame,
  TJumpActivity,
  TLoginDevice,
  TLoginEmail,
  TMemberBonusRewards,
  TMobileBindPhone,
  TMobileLogin,
  TOnlineRecharge,
  TPayChannelListPayload,
  TPushNotiSubscribe,
  TReadAllMessage,
  TReadMessage,
  TReceiveVipGift,
  TReferralDataPayload,
  TReferralRegisteredPayload,
  TReferralReportPayload,
  TRegister,
  TRegisterCode,
  TResetForgetLoginPassword,
  TResetPassword,
  TResetUserOtpSecret,
  TSendSMSVerifyCode,
  TSendWhatsAppVerifyCode,
  TUnreadMessages,
  TUsdtRechargePayload,
  TUserToken,
  TVerifyEmailCode,
  TVerifyPassword,
  TVerifyWhatsApp,
  TWithdrawBank,
} from './types';

const { Domain: ServerDomain, Agent: ServerAgent } = require('../server/' + process.env.SITE);

let userToken: string | null = '';
let userOtp: string | null = '';
let acceptLang: string | null;
// /pushNotification/subscribe
export const Domain = ServerDomain;
const Agent = ServerAgent;
export const gameapp = 'game99-game-app/';
export const platform = 'game99-platform-app/';
export const platformAdminWeb = 'game99-platform-admin-web/';
export const payapp = 'game99-pay-app/';
export const lotteryapp = 'game99-lottery-app/';
export const dev_version = '0';
const loginGoogleURLPrefix = 'oauth2/authorize/google?prompt=select_account&redirect_uri=';
export const loginGoogleUrlH5Prefix = Domain + platform + loginGoogleURLPrefix;
export const IP = async () =>
  await axiosInstance({ url: 'https://api.ipify.org?format=json', method: 'get', responseType: 'json' });
export const storeLang = (lang: string) => (acceptLang = lang === 'cn' ? 'cn' : lang);
export const clearToken = () => (userToken = '');
export const storeOtp = (otp: string) => {
  if (userOtp === '') {
    userOtp = otp;
  }
};
export const storeToken = (resToken: string) => {
  if (userToken === '') {
    userToken = resToken;
  }
};

const setCookie = (resUserId: string, resToken: string, expDays: number) => {
  var date = new Date();
  var token: TUserToken = { userId: resUserId, token: resToken };
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie = 'token=' + JSON.stringify(token) + ';' + expires + ';path=/';
};

const axiosInstance = axios.create({
  // withCredentials: true,
  // maxRedirects: 10,
});

export const api = async (param: string, params2: string, method: REQUEST_METHOD, data?: any): Promise<any> => {
  const url = Domain + param + params2;
  let content = '';
  let json = true;
  let addtlHeaders = {};
  if (data instanceof FormData) {
    content = 'multipart/form-data';
    json = false;
  } else {
    content = 'application/json;charset=UTF-8';
    json = true;
  }

  if (params2.includes('inviterGame/rewardLogs')) {
    const rewardLogsType = params2.split('?')[1].substring(5);
    addtlHeaders = { type: rewardLogsType };
    params2 = 'inviterGame/rewardLogs';
  }
  try {
    const globalHeaders = {
      'front-host': url,
      dev: dev_version,
      version: process.env.APP_VERSION,
      'Content-Type': content,
    };
    const axiosConfig: AxiosRequestConfig = {
      method: method,
      url: url,
      headers: {
        'front-host': globalHeaders['front-host'],
        dev: globalHeaders.dev.toString(),
        version: globalHeaders.version?.toString() ?? 2,
        'Content-Type': globalHeaders['Content-Type'],
        token: userToken || localStorage.getItem('token'),
        otp: userOtp || localStorage.getItem('otp'),
        agent: Agent,
        'Accept-Language': !!acceptLang?.length ? acceptLang : localStorage.getItem('lang'),
        ...addtlHeaders,
      },
      data: json === true ? JSON.stringify(data) : data,
      // withCredentials: true,
    };

    const response: AxiosResponse = await axiosInstance(axiosConfig);
    if (response.status !== 200) {
      throw new Error('Request failed');
    }
    const loginMethods = ['login', 'loginEmail', 'email/register', 'mobile/login', 'loginDevice', 'continueWithOtp'];
    if (loginMethods.includes(params2)) {
      if (response.data.code === 200) {
        var resToken = response.data.data.token;
        var resUserId = response.data.data.id;
        storeToken(resToken);
        setCookie(resUserId, resToken, 30);
        localStorage.setItem('token', resToken);
        sessionStorage.removeItem('Modal');
        storeToken(response.data.data.token);
      } else {
        return response;
      }
      return response;
    } else if (response.data.code === 401) {
      if (
        !(
          window.location.pathname.includes('pinduoduo') ||
          window.location.pathname.includes('recharge-bonus') ||
          window.location.pathname.includes('roulette')
        )
      ) {
        localStorage.removeItem('fcm-subscribed');
        localStorage.removeItem('token');
        localStorage.removeItem('isNewLoginMethodsUpdated');
        localStorage.removeItem('announcements-called');
        localStorage.removeItem('rechargeBonusData');
        userToken = '';
        window.location.href = '/?code=401';
      }
      return response;
    } else {
      return response;
    }
  } catch (error) {
    return null;
  }
};

// Below are the APIs that the game99 platform is currently using
// TODO: Add response types for apis

// SSE
export const connectToSSE = () => api('', 'game99-sse/subscribe', REQUEST_METHOD.POST);
// PLATFORM
export const announcement = async () =>
  (await api(platform, 'announcement', REQUEST_METHOD.POST)).data as TRootResponse<TAnnouncementData[]>;
export const bindEmail = (data: TBindEmail) => api(platform, 'bindEmail', REQUEST_METHOD.POST, data);
export const bindMobilePhone = (data: TMobileBindPhone) => api(platform, 'mobile/bindPhone', REQUEST_METHOD.POST, data);
export const bindPhone = async (data: TBindPhone) => await api(platform, 'bindPhone', REQUEST_METHOD.POST, data);
export const browseInit = async () =>
  (await api(platform, 'init', REQUEST_METHOD.POST)).data as TRootResponse<TBrowseInitData>;
export const checkUserRedPacket = async () =>
  (await api(platform, 'inviterGame/isAvailable', REQUEST_METHOD.POST)).data as TCheckUserRedPacketResponseData;
export const claimDepoBonus = async () =>
  (await api(platform, '/rechargeRewards/claimBonus', REQUEST_METHOD.POST)).data as TRootResponse<string>;

export const claimMissionReward = (data: TClaimMissionReward) =>
  api(platform, 'claimMissionReward', REQUEST_METHOD.POST, data);
export const collectRescueBonus = () => api(platform, 'collectRescueBonus', REQUEST_METHOD.POST);
export const collectTestMoney = () => api(platform, 'collectTestMoney', REQUEST_METHOD.POST);
export const continueWithOtp = (data: TContinueWithOtp) => api(platform, 'continueWithOtp', REQUEST_METHOD.POST, data);
export const deleteMessage = (data: { type: string; id: number }) =>
  api(platform, 'deleteMessage', REQUEST_METHOD.POST, data);
export const deleteMultipleMessages = (data: { ids: number[] }) =>
  api(platform, 'deleteMultipleMessages', REQUEST_METHOD.POST, data);
export const forgotPassword = (data: TForgetPassSendVerificationCode) =>
  api(platform, 'forgetPassMailVerificationCode', REQUEST_METHOD.POST, data);
export const getAccountInfo = async () =>
  (await api(platform, 'getAccountInfo', REQUEST_METHOD.POST)).data as TRootResponse<TGetAccountInfoData>;
export const getActivityInfos = (data: {}) => api(platform, 'getActivityInfos', REQUEST_METHOD.POST, data);
export const getActivityTypes = async () =>
  (await api(platform, 'getActivityTypes', REQUEST_METHOD.POST)).data as TRootResponse<ActivityTypesData[]>;
// export const getActivityTypes = async () => {
//   const data = (await api(platform, 'getActivityTypes', REQUEST_METHOD.POST)).data as TRootResponse<
//     ActivityTypesData[]
//   >;
//   const uniqueData = [...new Map(data?.data?.map((item) => [item['activityTypeEnum'], item])).values()];
//   return {
//     ...data,
//     data: uniqueData,
//   };
// };
export const getAvailableCommission = () => api(platform, 'getAvailableCommission', REQUEST_METHOD.POST);
export const getBonusByTypes = (data: any) => api(platform, 'bonusSettings/findByTypes', REQUEST_METHOD.POST, data);
export const getCodeFlowList = () => api(platform, 'getCodeFlowList', REQUEST_METHOD.POST, {});
export const getConfig = async () =>
  (await api(platform, 'rechargeRewards/loginBonus/config', REQUEST_METHOD.GET)).data as TRootResponse<TRouletteConfig>;
export const getCountryCodes = async () =>
  (await api(platform, 'countryCodes', REQUEST_METHOD.POST)).data as TRootResponse<TCountryCodeResponseData[]>;
export const getDepoBonus = () => api(platform, '/rechargeRewards/getDepositBonus', REQUEST_METHOD.POST);
export const getEventBannerList = async () =>
  (await api(platform, 'getEventBannerList', REQUEST_METHOD.POST)).data as TRootResponse<TGetEventBannerListData[]>;
export const getEventDetails = (data: TGetEventDetails) =>
  api(platform, 'memberActivityReward/getRewards', REQUEST_METHOD.POST, data);
export const getFundDetails = async (data: TFundDetailsPayload) =>
  (await api(platform, 'getFundDetails', REQUEST_METHOD.POST, data)).data as TRootResponse<TFundDetailsResponseData[]>;
export const getInviterGame = () => api(platform, 'inviterGame', REQUEST_METHOD.POST);
export const getInviterGameRewardLogs = (type: RewardLogsType) =>
  api(platform, `inviterGame/rewardLogs?type=${type}`, REQUEST_METHOD.POST);
export const getInviterRules = async () =>
  (await api(platform, 'getInviterRules', REQUEST_METHOD.POST)).data as TRootResponse<TInviterRulesResponseData>;
export const getJumpActivity = (data: TJumpActivity) => api(platform, 'getJumpActivity', REQUEST_METHOD.POST, data);
export const getMemberBonusRewards = (data: TMemberBonusRewards) =>
  api(platform, 'memberVipBonusReward/getRewards', REQUEST_METHOD.POST, data);
export const getMessageOnSites = async (data?: MessageOnSitesType) =>
  (await api(platform, 'getMessageOnSites', REQUEST_METHOD.POST, data)).data as TRootResponse<TGetMessageOnSitesData[]>;
export const getProfilePictureList = () => api(platform, 'getProfilePictureList', REQUEST_METHOD.POST);
export const getReferralData = async (data: TReferralDataPayload) =>
  (await api(platform, 'getReferralDetails', REQUEST_METHOD.POST, data)).data as TRootResponse<
    TReferralDetailsResponseData[]
  >;
export const getReferralInfo = async () =>
  (await api(platform, '/getReferralInfo', REQUEST_METHOD.POST)).data as TRootResponse<TGetReferralInfoData>;
export const getReferralRegistered = async (data: TReferralRegisteredPayload) =>
  (await api(platform, 'getReferralRegistered', REQUEST_METHOD.POST, data)).data as TRootResponse<
    TReferralRegisteredResponseData[]
  >;
export const getReferralReport = async (data: TReferralReportPayload) =>
  (await api(platform, 'getReferralReport', REQUEST_METHOD.POST, data)).data as TRootResponse<
    TReferralReportResponseData[]
  >;
export const getRegistrationData = async () =>
  (await api(platform, 'getRegistration', REQUEST_METHOD.POST)).data as TRootResponse<TRegistrationListResponseData>;
export const getRepeatMissionActivityList = async (data: TGetRepeatMissionActivityList) =>
  (await api(platform, 'getRepeatMissionActivityList', REQUEST_METHOD.POST, data))
    .data as TRootResponse<TRepeatMissionActivityListResponseData>;
export const getRescueBonus = async () =>
  (await api(platform, 'getRescueBonus', REQUEST_METHOD.POST)).data as TRootResponse<TRescueBonusResponseData[]>;
export const getTradeTypes = async () =>
  (await api(platform, 'getTradeTypes', REQUEST_METHOD.POST)).data as TRootResponse<TTradeTypes[]>;
export const getVipGiftInfo = async () =>
  (await api(platform, 'getVipGiftInfo', REQUEST_METHOD.POST)).data as TRootResponse<TVipSetListResponseData>;
export const getWinnerList = (data: {}) => api(platform, 'inviterGame/winners', REQUEST_METHOD.POST, data);
export const loginDevice = (data: TLoginDevice) => api(platform, 'loginDevice', REQUEST_METHOD.POST, data);
export const loginEmail = async (data: TLoginEmail) =>
  (await api(platform, 'loginEmail', REQUEST_METHOD.POST, data)).data as TRootResponse<TLoginEmailResponse>;
export const loginMethods = () => api(platform, 'loginMethods', REQUEST_METHOD.POST);
export const logout = () => api(platform, 'logout', REQUEST_METHOD.POST);
export const maintain = (data: {}) => api(platform, 'announcementMaintain', REQUEST_METHOD.POST, data);
export const mobileLogin = (data: TMobileLogin) => api(platform, 'mobile/login', REQUEST_METHOD.POST, data);
export const mRegister = (data: TRegister) => api(platform, 'email/register', REQUEST_METHOD.POST, data);
export const newLoginMethods = async () =>
  (await api(platform, 'newLoginMethods', REQUEST_METHOD.POST)).data as TRootResponse<TNewLoginMethodsData>;
export const otherAnnouncement = async () =>
  (await api(platform, 'other/announcement', REQUEST_METHOD.POST)).data as TRootResponse<TAnnouncementTypes[]>;
export const playInviterGame = () => api(platform, 'inviterGame/play', REQUEST_METHOD.POST);
export const readAllMessageOnSites = async (data: TReadAllMessage) =>
  await api(platform, 'readAllMessageOnSites', REQUEST_METHOD.POST, data);
export const readMessageOnSites = async (data: TReadMessage) =>
  await api(platform, 'readMessageOnSites', REQUEST_METHOD.POST, data);
export const receivedVipCount = () => api(platform, 'receivedVipCount', REQUEST_METHOD.POST);
export const receiveVipGift = (data: TReceiveVipGift) => api(platform, 'receiveVipGift', REQUEST_METHOD.POST, data);
export const referralWebViewList = () => api(platform, 'inviterGame/referralWebViewList', REQUEST_METHOD.POST);
export const registerCode = (data: TRegisterCode) =>
  api(platform, 'sendEmailVerificationCode', REQUEST_METHOD.POST, data);
export const resetForgetLoginPassword = (data: TResetForgetLoginPassword) =>
  api(platform, 'mobile/resetForgetLoginPassword', REQUEST_METHOD.POST, data);
export const resetPassword = (data: TResetPassword) => api(platform, 'resetPasswd', REQUEST_METHOD.POST, data);
export const resetUserOtpSecret = async (data: TResetUserOtpSecret) =>
  await api(platform, 'resetUserOtpSecret', REQUEST_METHOD.POST, data);
export const sendSmsVerifyCode = (data: TSendSMSVerifyCode) =>
  api(platform, 'sendSmsVerifyCode', REQUEST_METHOD.POST, data);
export const setPasswordApi = (data: { password: string; confirmPassword: string }) =>
  api(platform, 'setPassword', REQUEST_METHOD.POST, data);
export const spin = async () =>
  (await api(platform, '/rechargeRewards/loginBonus/spin', REQUEST_METHOD.POST)).data as TRootResponse<number>;
export const unreadMessageOnSites = async (data: TUnreadMessages) =>
  await api(platform, 'unreadMessageOnSiteCount', REQUEST_METHOD.POST, data);
export const updateProfilePicture = (id: number) => api(platform, 'updateProfilePicture', REQUEST_METHOD.POST, { id });
export const verifyEmailCode = (data: TVerifyEmailCode) => api(platform, 'verifyEmailCode', REQUEST_METHOD.POST, data);
export const verifyPassword = (data: TVerifyPassword) => api(platform, 'verifyPassword', REQUEST_METHOD.POST, data);
export const sendWhatsAppVerificationCode = (data: TSendWhatsAppVerifyCode) =>
  api(platform, 'sendWhatsAppVerificationCode', REQUEST_METHOD.POST, data);
export const verifyWhatsAppCode = (data: TVerifyWhatsApp) =>
  api(platform, 'verifyWhatsAppCode', REQUEST_METHOD.POST, data);
export const listIncomeType = () => api(platform, 'listIncomeSourceTypeEnum', REQUEST_METHOD.POST);
export const pushNotiSubscribe = (data: TPushNotiSubscribe) =>
  api(platform, 'pushNotification/subscribe', REQUEST_METHOD.POST, data);
export const getAccountNow = () => api(platform, 'getAccountNow', REQUEST_METHOD.POST);
export const bindWithOtp = () => api(platform, 'bindWithOtp', REQUEST_METHOD.POST, { ip: localStorage.getItem('ip') });
export const updateFcmToken = async ({ fcmToken }: { fcmToken: string }) =>
  (await api(platform, 'pushNotification/updateFcmToken', REQUEST_METHOD.POST, {
    fcmToken,
  })) as TRootResponse<null>;

// PAYAPP
export const configBonus = async () =>
  (await api(payapp, 'configBonus', REQUEST_METHOD.POST)).data as TRootResponse<TConfigBonusResponseData[]>;
export const getBindCardList = () => api(payapp, 'getBindCardList', REQUEST_METHOD.POST);
export const lojaList = () => api(payapp, 'loja/list', REQUEST_METHOD.POST);
export const onlineRecharge = (data: TOnlineRecharge) => api(payapp, 'onlineRecharge', REQUEST_METHOD.POST, data);
export const payChannelList = async (data: TPayChannelListPayload) =>
  (await api(payapp, 'payChannelList', REQUEST_METHOD.POST, data)).data as TRootResponse<TPayChannelListResponseData[]>;
export const payTypeList = async () =>
  (await api(payapp, 'payTypeList', REQUEST_METHOD.POST)).data as TRootResponse<TPayTypeListResponseData[]>;
export const setBankBindCard = (data: TBindCard) => api(payapp, 'bank/setBindCard', REQUEST_METHOD.POST, data);
export const setBindCard = (data: TBindCard) => api(payapp, 'setBindCard', REQUEST_METHOD.POST, data);
export const verifyWithdrawalPassword = async (data: { withdrawPass: string }) =>
  await api(payapp, 'verifyWithdrawPass', REQUEST_METHOD.POST, data);
export const withdrawBank = async (data: TWithdrawBank) => await api(payapp, 'withdraw', REQUEST_METHOD.POST, data);
export const withdrawLimit = () => api(payapp, 'withdrawLimit', REQUEST_METHOD.POST);
export const withdrawPassSet = (data: { boxPass: string }) => api(payapp, 'withdrawPassSet', REQUEST_METHOD.POST, data);
export const withdrawRechargeDetail = (data: any) => api(payapp, 'withdrawRechargeDetail', REQUEST_METHOD.POST, data);
export const getRechargeUsdtList = async () =>
  (await api(payapp, 'rechargeUsdtList', REQUEST_METHOD.POST)).data as TRootResponse<TUsdtListData[]>;
export const postUsdtRecharge = async (payload: TUsdtRechargePayload) =>
  (await api(payapp, 'usdtRecharge', REQUEST_METHOD.POST, payload)).data as TRootResponse<null>;
export const bankList = () => api(payapp, 'bankList', REQUEST_METHOD.POST);
export const getConfigRechargeBonus = () => api(payapp, 'configRechargeBonus', REQUEST_METHOD.POST);

// GAMEAPP
export const escGame = (data: TEscGame) => api(gameapp, 'escGame', REQUEST_METHOD.POST, data);
export const gameWithdrawal = (data: TGameWithdrawal) => api(gameapp, 'gameWithdrawal', REQUEST_METHOD.POST, data);
export const getBalanceByPlatform = async (data: TGetBalanceByPlatform) =>
  (await api(gameapp, 'getBalanceByPlatform', REQUEST_METHOD.POST, data)).data as TRootResponse<
    TBalanceByPlatformResponseData[]
  >;
export const getGameCategoryList = () => api(gameapp, 'getGameCategoryList', REQUEST_METHOD.POST);
export const getGameDataList = (data: any) => api(gameapp, 'getGameDataList', REQUEST_METHOD.POST, data);
export const getGameInfoGroup = async (data: TGetGameInfoGroup) =>
  (await api(gameapp, 'getGameInfoGroup', REQUEST_METHOD.POST, data)).data as TRootResponse<
    TGameInfoGroupResponseData[]
  >;
export const getGameList = (data: TGetGameList) => api(gameapp, 'getGameInfos', REQUEST_METHOD.POST, data);
export const getGameTypes = async () =>
  (await api(gameapp, 'getGameTypes', REQUEST_METHOD.POST)).data as TRootResponse<TGetGameTypesData>;
export const getJackpotPrizeList = () => api(gameapp, 'getJackpotPrizeList', REQUEST_METHOD.POST);
export const joinGame = (data: TJoingame) => api(gameapp, 'joinGame', REQUEST_METHOD.POST, data);
