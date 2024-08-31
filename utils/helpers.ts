import { ChangeEvent, SetStateAction } from 'react';
import { APK_EVENT } from '@/constants/enums';
import { getMessageOnSites, loginGoogleUrlH5Prefix, updateFcmToken } from '@/services/api';
import { TMessageItem } from '@/services/types';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from './firebase';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import { recharge } from '@/translation/cn';

// LOCAL STORAGE CHECK
export const isLoggedIn = () => {
  if (typeof localStorage === 'undefined') return false;
  return !!localStorage.getItem('token');
};

export const hasEventJumpType = () => {
  return !!sessionStorage.getItem('eventJumpType');
};

export const isUpdatingAvatar = () => {
  return !!sessionStorage.getItem('update-avatar');
};

export const hasAnnounceJumpType = () => {
  return !!sessionStorage.getItem('announceJumpType');
};

// DEVICE CHECK
export const isIOS = () => {
  return (
    ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod', 'MacIntel'].includes(
      navigator.platform,
    ) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
};

export const isIOSSafari = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent) && /safari/.test(userAgent) && !/crios/.test(userAgent);
};

export const isIOSChrome = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent) && /crios/.test(userAgent);
};

export const isMobilePlatform = () => {
  return !window?.navigator.platform?.includes('Win32') && !window?.navigator.platform?.includes('Mac');
};

export const isiOSStandaloneMode = () => {
  return window.navigator.standalone ?? false;
};

export const isHuaweiBrowser = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return userAgent.includes('huaweibrowser');
};

export const isVivoBrowser = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return userAgent.includes('vivo');
};

export const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

export const isIPhone = () => {
  if (!window) return false;
  return navigator.userAgentData?.platform === 'iPhone';
};

// VALIDATION
export const isChineseCharacters = (text: string | undefined) => {
  const chineseRegex = /[\u4E00-\u9FFF]/;
  return text && chineseRegex.test(text);
};

export const emailValidator = (email: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const isAllowedKey = ({ key, isMetaKey }: { key: string; isMetaKey: boolean }) => {
  if (isMetaKey) return true;
  const allowedKeys = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'Backspace',
    'Meta',
    'Control',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
  ];
  return allowedKeys.includes(key);
};

export const isValidURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// FORMATTERS
export const moneyFormat = (money: number, abbreviate: boolean = false) => {
  const roundedNumber = Math.floor(money);

  const formatter = Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (abbreviate) {
    if (money >= 1_000_000) {
      return formatter.format(roundedNumber / 1_000_000) + 'M';
    } else if (money >= 1_000) {
      return formatter.format(roundedNumber / 1_000) + 'K';
    } else {
      return formatter.format(roundedNumber);
    }
  } else {
    return formatter.format(roundedNumber);
  }
};

export const dateFormatter = (date: Date) => {
  let year = date.getFullYear();
  let month = ('0' + (date.getMonth() + 1)).slice(-2);
  let day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

export const dateTimeFormatter = (date: string) => {
  return date?.split(' ')[0];
};

export const removeDuplicates = (messages: TMessageItem[]) => {
  const seenIds = new Set();
  return messages?.filter((message) => {
    if (!seenIds.has(message.id)) {
      seenIds.add(message.id);
      return true;
    }
    return false;
  });
};

// NUMBER HELPERS
export const setNumbersOnly = (e: ChangeEvent<HTMLInputElement>, setter: (value: SetStateAction<string>) => void) => {
  const value = e.target.value;
  if (/^[0-9]*$/.test(value)) {
    setter(value.trim());
  }
};

export const randomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const percentage = (percent: number, total: number) => {
  return ((percent / 100) * total).toFixed(2);
};

// STRING HELPERS
/**
 * @param str image source
 * @returns undefined if image is not ending with jpg or png else it returns image source
 */
export const filterImageSrc = (str: string) =>
  /\.(?:jpe?g|png|gif|jfif|bmp|tiff?|webp)$/i.test(str) ? str : undefined;

export const filterWebsiteUrl = (str: string) =>
  /^(https?:\/\/[\da-z.-]+\.[a-z.]{2,6}([/\w .-]*)*\/?)$/.test(str) ? str : undefined;

export const copyText = (id: string, toastCallback: (data: any) => void) => {
  const text = document.getElementById(id) as HTMLElement | HTMLInputElement;
  const input = document.createElement('input');

  if (text) {
    input.value = text.textContent ?? '';
    document.body.appendChild(input);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(input.value)
        .then(() => {
          toastCallback(1);
        })
        .catch(() => {
          toastCallback(2);
        });
    } else {
      input.select();
      const success = document.execCommand('copy');
      if (success) {
        toastCallback(1);
      } else {
        toastCallback(2);
      }
    }
    document.body.removeChild(input);
  }
};

export const getStatusTextColor = (status: number, useNewColors: boolean = true) => {
  // useNewColors for the new implementation, delete conditional if the old files will not be used anymore
  switch (status) {
    case 0: return useNewColors ? '#FFEA00' : '#F57B0B';
    case 1: case 3: return useNewColors ? '#24FF00' : '#00AD27';
    case 2: return '#FF0000';
    default: return '#FFF'
  }
}

// GENERAL
export const isProduction = process.env.NODE_ENV === 'production';

export const startIdleTimer = (timeout: number, onIdle: () => void): (() => void) => {
  let idleTimeout: NodeJS.Timeout;

  const resetIdleTimeout = (): void => {
    if (idleTimeout) {
      clearTimeout(idleTimeout);
    }
    idleTimeout = setTimeout(onIdle, timeout);
  };
  resetIdleTimeout();

  const handleUserActivity = (): void => {
    resetIdleTimeout();
  };

  window.addEventListener('mousemove', handleUserActivity);
  window.addEventListener('keypress', handleUserActivity);
  window.addEventListener('touchstart', handleUserActivity);

  return (): void => {
    if (idleTimeout) {
      clearTimeout(idleTimeout);
    }
    window.removeEventListener('mousemove', handleUserActivity);
    window.removeEventListener('keypress', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);
  };
};

export const isElementFullyVisible = (element: HTMLElement, parent?: HTMLDivElement) => {
  const item = element.getBoundingClientRect();
  const container = parent?.getBoundingClientRect();
  const topBounds = container?.top || 0;
  const leftBounds = container?.left || 0;
  const bottomBounds = container?.bottom || window.innerHeight;
  const rightBounds = container?.right || window.innerWidth;

  return (
    item.top >= topBounds &&
    item.left >= leftBounds &&
    item.bottom <= (bottomBounds || document.documentElement.clientHeight) &&
    item.right <= (rightBounds || document.documentElement.clientWidth)
  );
};

export const toRem = (px: number): string => {
  return `${px / 52}rem`;
};

export const triggerApkEvent = (event: APK_EVENT, options?: ('includeIOS' | 'useAsJumpType' | 'skipStringify')[]) => {
  const message = options?.includes('useAsJumpType') ? { jumpType: event } : { event };
  const triggerMessage = options?.includes('skipStringify') ? message : JSON.stringify(message);

  if (window?.jsBridge) {
    return window.jsBridge.triggerFunction(triggerMessage);
  } else if (options?.includes('includeIOS') && window?.webkit) {
    return window.webkit.messageHandlers.triggerFunction?.postMessage(message);
  } else {
    !isProduction && console.log('No ‘jsBridge’ or ‘webkit’ interface is available for:', message);
  }
};

// FETCH AND URL HELPERS

// DO NOT DELETE YET
// export const getMailMessages = async () => {
//   const messageTypes = ['NEWS', 'NOTIFICATION'] as const;
//   const data = await Promise.all(
//     messageTypes.map(async (type) => {
//       const result = await getMessageOnSites({ type });
//       const filteredMessages = result.data.filter((msg) => msg.status !== 2 && msg.type === type);
//       const uniqueMessages = removeDuplicates(filteredMessages);
//       const messagesWithType = uniqueMessages?.map((msg) => ({ ...msg, type }));
//       return messagesWithType || [];
//     }),
//   );
//   return data.flat().sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
// };

export const getMailMessages = async () => {
  const result = await getMessageOnSites();
  const filteredMessages = result.data.filter((msg) => msg.status !== 2);
  const uniqueMessages = removeDuplicates(filteredMessages);
  const messagesWithType = uniqueMessages?.map((msg) => ({ ...msg }));
  return (
    messagesWithType.flat().sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()) || []
  );
};

export const getGoogleLoginLink = () => {
  const params = new URLSearchParams(window.location.search);
  const path = window.location.pathname;

  return `${loginGoogleUrlH5Prefix}${window.location.origin}${path}?${params}`;
};

export const deleteParams = (paramKey: string) => {
  const params = new URLSearchParams(window.location.search);
  const path = window.location.pathname;
  params.delete(paramKey);
  const newUrl = `${path}?${params}`;

  return window.history.replaceState(null, '', newUrl);
};

export function pxToRem(px: number) {
  // Get the root font size from the html element
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  // Convert px to rem
  const rem = px / rootFontSize;
  return rem;
}

const { VAPID_KEY } = require('@/server/' + process.env.SITE);

export const getFcmTokenOnLogin = () => {
  const fcmTokenFromStorage = localStorage.getItem('fcm-token');
  if (fcmTokenFromStorage) return;
  return setTimeout(() => {
    const messaging = getMessaging(firebaseApp);
    getToken(messaging, {
      vapidKey: VAPID_KEY,
    }).then((token) => {
      localStorage.setItem('fcm-token', token);
      updateFcmToken({ fcmToken: token });
    }).catch(() => {
      console.warn('Notifications permission denied.')
    });
  }, 7500);
};

type RechargeType = typeof recharge;
export const handleCopy = (dataToCopy: string, translatedToastMessage: RechargeType) => {
  if (isAndroid()) {
    copyText('textToCopy', (toastId: number) => {
      toastId === 1 ? toast.success(translatedToastMessage.copySuccess, { id: 'copy_success' }) : toast.error(translatedToastMessage.copyUnsuccessful, { id: 'copy_error' });
    });
  } else {
    copy(dataToCopy);
    toast.success(translatedToastMessage.copySuccess, { id: 'copy_success' });
  }
};
