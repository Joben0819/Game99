import { DATA_LANG, LOGIN_MODAL } from '@/constants/enums';
import {
  TAnnouncementData,
  TAnnouncementTypes,
  TBonusRecord,
  TBrowseInitData,
  TEventBanner,
  TGamePlatform,
  TGamesType,
  TJackpotPrizeList,
  TNewLoginMethodsData,
  TSideNotification,
  TVipGiftInfo,
} from '@/services/response-type';
import { TAppDataState, TMessageItem } from '@/services/types';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: TAppDataState = {
  initData: {},
  language: DATA_LANG.IND,
  addToHomeShown: false,
  slowInternet: false,
  isBackgroundMusicOn: true,
  isSoundEffectsOn: true,
  isPageLoading: false,
  isPopupOpen: false,

  activeModal: '',
  secondModal: '',
  thirdModal: '',
  fourthModal: '',
  isOpenModal: false,
  showLoginModal: LOGIN_MODAL.LOGIN,
  loginMethodList: { dataList: [], displayIcon: { money: 0, description: '', type: '' } },

  prevPage: '',
  eventBannerList: [],
  eventList: [],
  messages: [],
  readMsgID: [],
  currentMessage: { content: '{}', createTime: '', id: 0, status: 0, title: '', type: '' },
  activeInviteContent: '',
  redEnvelopeCurrentSeq: 1,

  activeGamesType: null,
  platformList: [],
  gamesTypeItems: [],
  gameUrl: '',

  otherAnnouncementCount: 0,
  buttonClickAnnouncements: [],
  dialogCount: 0,
  rescueDetails: [],
  vipGiftInfo: { vipSetList: [], levelBonusStatus: 0, monthBonusStatus: 0, weekBonusStatus: 0 },
  announcementData: [],
  otherDialogAnnouncementsData: [],
  sideNotification: { content: '{}', devices: '', notificationType: '', title: '' },
  jackpotClickedPid: 0,
  initialJackpotData: [],
  isSpinning: false,
};

const { isBackgroundMusicOn, isSoundEffectsOn, language, ...initStateWithException } = initialState;

const appDataSlice = createSlice({
  name: 'appData',
  initialState,
  reducers: {
    resetAppDataState: () => initialState,
    resetAppDataWithExceptions: (state) => ({
      ...state,
      isBackgroundMusicOn: state.isBackgroundMusicOn,
      isSoundEffectsOn: state.isSoundEffectsOn,
      language: state.language,
      ...initStateWithException,
    }),

    setInitData: (state, { payload: initData }: PayloadAction<TBrowseInitData>) => ({ ...state, initData }),
    setLanguage: (state, { payload: language }: PayloadAction<DATA_LANG>) => ({ ...state, language }),
    setAddToHomeShown: (state, { payload: addToHomeShown }: PayloadAction<boolean>) => ({ ...state, addToHomeShown }),
    setSlowInternet: (state, { payload: slowInternet }: PayloadAction<boolean>) => ({ ...state, slowInternet }),
    setBackGroundMusic: (state, { payload: isBackgroundMusicOn }: PayloadAction<boolean>) => ({
      ...state,
      isBackgroundMusicOn,
    }),
    setSoundEffects: (state, { payload: isSoundEffectsOn }: PayloadAction<boolean>) => ({ ...state, isSoundEffectsOn }),
    setPageLoad: (state, { payload: isPageLoading }: PayloadAction<boolean>) => ({ ...state, isPageLoading }),
    setIsPopup: (state, { payload: isPopupOpen }: PayloadAction<boolean>) => ({ ...state, isPopupOpen }),

    setActiveModal: (state, { payload: activeModal }: PayloadAction<string>) => ({ ...state, activeModal }),
    setSecondModal: (state, { payload: secondModal }: PayloadAction<string>) => ({ ...state, secondModal }),
    setThirdModal: (state, { payload: thirdModal }: PayloadAction<string>) => ({ ...state, thirdModal }),
    setFourthModal: (state, { payload: fourthModal }: PayloadAction<string>) => ({ ...state, fourthModal }),
    setOpenModal: (state, { payload: isOpenModal }: PayloadAction<boolean>) => ({ ...state, isOpenModal }),
    setShowLoginModal: (state, { payload: showLoginModal }: PayloadAction<LOGIN_MODAL>) => ({
      ...state,
      showLoginModal,
    }),
    setLoginMethodList: (state, { payload: loginMethodList }: PayloadAction<TNewLoginMethodsData>) => ({
      ...state,
      loginMethodList,
    }),

    setPrevPage: (state, { payload: prevPage }: PayloadAction<string>) => ({ ...state, prevPage }),
    setEventBannerList: (state, { payload: eventBannerList }: PayloadAction<TEventBanner[]>) => ({
      ...state,
      eventBannerList,
    }),
    setEventList: (state, { payload: eventList }: PayloadAction<[]>) => ({ ...state, eventList }), // Not in use
    setMessages: (state, { payload: messages }: PayloadAction<TMessageItem[]>) => ({ ...state, messages }),
    setReadMsgID: (state, { payload: readMsgID }: PayloadAction<string[]>) => ({ ...state, readMsgID }),
    setCurrentMessage: (state, { payload: currentMessage }: PayloadAction<TMessageItem>) => ({
      ...state,
      currentMessage,
    }),
    setActiveInviteContent: (state, { payload: activeInviteContent }: PayloadAction<string>) => ({
      ...state,
      activeInviteContent,
    }),
    setRedEnvelopeSequence: (state, { payload: redEnvelopeCurrentSeq }: PayloadAction<number>) => ({
      ...state,
      redEnvelopeCurrentSeq,
    }),

    setActiveGamesType: (state, { payload: activeGamesType }: PayloadAction<TGamesType>) => ({
      ...state,
      activeGamesType,
    }),
    setPlatformList: (state, { payload: platformList }: PayloadAction<TGamePlatform[]>) => ({ ...state, platformList }),
    setGamesTypeItems: (state, { payload: gamesTypeItems }: PayloadAction<TGamesType[]>) => ({
      ...state,
      gamesTypeItems,
    }),
    setGameUrl: (state, { payload: gameUrl }: PayloadAction<string>) => ({ ...state, gameUrl }),
    setOtherAnnouncementCount: (state, action: PayloadAction<number>) => ({
      ...state,
      otherAnnouncementCount: action.payload,
    }),
    setButtonClickAnnouncements: (state, action: PayloadAction<TAnnouncementTypes[]>) => ({
      ...state,
      buttonClickAnnouncements: action.payload,
    }),
    setDialogCount: (state, action: PayloadAction<TAnnouncementTypes[]>) => {
      const dialogAnnouncements = action.payload.filter((announcement) => announcement.showType === 'DIALOG');

      return {
        ...state,
        dialogCount: dialogAnnouncements.length,
      };
    },
    setRescueDetails: (state, action: PayloadAction<TBonusRecord[]>) => ({
      ...state,
      rescueDetails: action.payload,
    }),
    setVipGiftInfo: (state, action: PayloadAction<TVipGiftInfo>) => ({
      ...state,
      vipGiftInfo: action.payload,
    }),
    setAnnouncements: (state, action: PayloadAction<TAnnouncementData[]>) => {
      return {
        ...state,
        announcementData: action.payload,
      };
    },
    setOtherDialogAnnouncementsData: (state, action: PayloadAction<TAnnouncementTypes[]>) => {
      return {
        ...state,
        otherDialogAnnouncementsData: action.payload,
      };
    },
    setSideNotification: (state, action: PayloadAction<TSideNotification>) => {
      return {
        ...state,
        sideNotification: action.payload,
      };
    },
    resetSideNotification: (state) => {
      return {
        ...state,
        sideNotification: { content: '{}', devices: '', notificationType: '', title: '' },
      };
    },
    setJackpotClickedPid: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        jackpotClickedPid: action.payload,
      };
    },
    setInitialJackpotData: (state, action: PayloadAction<TJackpotPrizeList[]>) => ({
      ...state,
      initialJackpotData: action.payload,
    }),
    setIsSpinning: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isSpinning: action.payload,
    }),
  },
});

export const {
  resetAppDataState,
  resetAppDataWithExceptions,
  setInitData,
  setLanguage,
  setAddToHomeShown,
  setSlowInternet,
  setBackGroundMusic,
  setSoundEffects,
  setPageLoad,
  setActiveModal,
  setSecondModal,
  setThirdModal,
  setFourthModal,
  setOpenModal,
  setShowLoginModal,
  setLoginMethodList,
  setPrevPage,
  setEventBannerList,
  setEventList,
  setMessages,
  setReadMsgID,
  setCurrentMessage,
  setActiveInviteContent,
  setRedEnvelopeSequence,
  setActiveGamesType,
  setPlatformList,
  setGamesTypeItems,
  setGameUrl,
  setOtherAnnouncementCount,
  setDialogCount,
  setIsPopup,
  setButtonClickAnnouncements,
  setVipGiftInfo,
  setAnnouncements,
  setOtherDialogAnnouncementsData,
  setSideNotification,
  resetSideNotification,
  setJackpotClickedPid,
  setInitialJackpotData,
  setRescueDetails,
  setIsSpinning,
} = appDataSlice.actions;

export default appDataSlice.reducer;
