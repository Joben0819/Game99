'use client';

import { notFound, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DATA_LANG } from '@/constants/enums';
import { setLanguage } from '@/reducers/appData';
import { storeLang, storeToken } from '@/services/api';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import RechargeAndCodeBonus from '@/components/Modals/Atividade/components/RechargeAndCodeBonus';
import { useAppSelector } from '@/store';
import { deleteParams } from '@/utils/helpers';

const RechargeBonusComponent = () => {
  const dispatch = useDispatch();
  const locale = useAppSelector((s) => s.appData.language);
  const searchParams = useSearchParams();
  const [showContent, setShowContent] = useState(false);
  const token = searchParams.get('token');
  const channelCode = searchParams.get('channelCode');

  useEffect(() => {
    const lang = searchParams.get('lang');
    const isValidLang = Object.values(DATA_LANG).includes(lang as DATA_LANG);
    if (lang && isValidLang) {
      dispatch(setLanguage(lang as DATA_LANG));
    }
  }, [searchParams]);

  useEffect(() => {
    if (channelCode) {
      deleteParams('channelCode');
    }
  }, []);

  useEffect(() => {
    if (!token) return notFound();
    storeToken(token);
    localStorage.setItem('token', token);
    storeLang(locale);
    localStorage.setItem('lang', locale);

    const timeout = setTimeout(() => {
      // getAccountUserInfo();
      if (!!localStorage.getItem('token')) {
        setShowContent(true);
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchParams, token, locale]);

  return (
    <div className={`size-full relative`}>{showContent ? <RechargeAndCodeBonus isWebView /> : <LoadingIcon />}</div>
  );
};

export default RechargeBonusComponent;
