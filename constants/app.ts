import { TLanguage } from '@/services/types';
import { PickerLocale } from 'antd/es/date-picker/generatePicker';
import en_US from 'antd/es/date-picker/locale/en_US';
import id_ID from 'antd/es/date-picker/locale/id_ID';
import zh_CN from 'antd/es/date-picker/locale/zh_CN';
import { images } from '@/utils/resources';
import { DATA_LANG, DATA_MODAL, JUMP_TYPE } from './enums';
import { updatesTypes } from './types';

// TODO - move all `app scope | general` constants here to avoid duplication

const IN_EN_LANG: TLanguage[] = [
  {
    text: 'INDONESIA',
    locale: DATA_LANG.IND,
    code: 'id-ID',
    icon: images.login_img_indo,
    flag: 'https://flagcdn.com/id.svg',
  },
  {
    text: 'ENGLISH',
    locale: DATA_LANG.EN,
    code: 'en-US',
    icon: images.login_img_eng,
    flag: 'https://flagcdn.com/us.svg',
  },
];

const CN_LANG = {
  text: '中文（简体）',
  locale: DATA_LANG.CNS,
  code: 'zh-Hans-CN',
  icon: images.login_img_china,
  flag: 'https://flagcdn.com/cn.svg',
};

// const HI_LANG = {
//   text: '中文（简体）',
//   locale: DATA_LANG.HI,
//   code: 'hi-IN',
//   icon: images.login_img_china,
//   flag: 'https://flagcdn.com/in.svg',
// };

// export const LANGUAGES = process.env.SITE === '9908' ? IN_EN_LANG : [...IN_EN_LANG, CN_LANG, HI_LANG];
export const LANGUAGES = process.env.SITE === '9908' ? IN_EN_LANG : [...IN_EN_LANG, CN_LANG];
export const LOCALES = LANGUAGES.map((lang) => lang.locale);

export const MODAL_ANIMATION = {
  hidden: {
    y: '-100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
      delay: 0.3,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
      delay: 0.3,
    },
  },
};

export const MODAL_BG_ANIMATION = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { delay: 0.3 },
  },
};

export const MODAL_CONTENT_ANIMATION = {
  hidden: { y: '-100vh' },
  visible: {
    y: '0',
    transition: {
      y: {
        duration: 0.3,
        type: 'spring',
        damping: 25,
        stiffness: 500,
        delay: 0.3,
      },
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const DATE_PICKER_LOCALE: Record<DATA_LANG, PickerLocale> = {
  [DATA_LANG.EN]: en_US,
  [DATA_LANG.CNS]: zh_CN,
  [DATA_LANG.IND]: id_ID,
};

export const CONTENT_BY_JUMPTYPE: Record<JUMP_TYPE, string> = {
  [JUMP_TYPE.ACTIVITY]: DATA_MODAL.ACTIVITIES,
  [JUMP_TYPE.BIND_EMAIL]: DATA_MODAL.BIND_EMAIL,
  [JUMP_TYPE.BIND_PHONE]: DATA_MODAL.BIND_PHONE,
  [JUMP_TYPE.DAILY_BONUS]: DATA_MODAL.DAILY_BONUS,
  [JUMP_TYPE.EXTERNAL]: 'external',
  [JUMP_TYPE.INVITER]: 'referral-page',
  [JUMP_TYPE.MESSAGE]: DATA_MODAL.MAIL,
  [JUMP_TYPE.PINDUODUO]: 'referral-page',
  [JUMP_TYPE.RECHARGE]: 'recharge-page',
  [JUMP_TYPE.RESCUE_FUND]: DATA_MODAL.RESCUE_FUND,
  [JUMP_TYPE.VIP]: DATA_MODAL.VIP,
  [JUMP_TYPE.RECHARGE_BONUS]: DATA_MODAL.RECHARGE_BONUS,
};

export const DATE_PICKER_FORMAT = 'DD-MM-YYYY';

export const INTERNET_TIMEOUT = 10;
export const IDLE_TIMEOUT = 120000;
export const ACTIVITY_PAGES = ['/roulette', '/recharge-bonus', '/pinduoduo'];
export const DEFAULT_SUPPORT_LINK =
  'https://api.kfhapp.win/standalone.html?appId=6d8578de2cd64fcc86386d9599404edb&lang=enUS';

export const sampleUpdates: updatesTypes[] = [
  { update: '全新界面设计' },
  { update: '广告消息拦截' },
  { update: '修复部分bug' },
  { update: '更新如遇问题请联系在线客服' },
];
