'use client';

import { notFound, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DATA_LANG } from '@/constants/enums';
import { setLanguage } from '@/reducers/appData';
import { storeLang, storeToken } from '@/services/api';
import classNames from 'classnames';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import MainScreen from '@/components/Modals/Invite/RedEnvelopeWebview/MainScreen';
import { useAppSelector } from '@/store';
import { deleteParams } from '@/utils/helpers';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import styles from './page.module.scss';

const RedEnvelope = () => {
  const dispatch = useDispatch();
  const locale = useAppSelector((s) => s.appData.language);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const channelCode = searchParams.get('channelCode');
  const { getAccountUserInfo, resetInternetStatus } = useWithDispatch();
  const { redEnvelopeCurrentSeq } = useAppSelector((state) => state.appData);
  const [showContent, setShowContent] = useState(false);
  const isSmallWebView = window.innerWidth < 450;

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
    resetInternetStatus();
  }, []);

  useEffect(() => {
    if (!token) return notFound();
    storeToken(token);
    localStorage.setItem('token', token);
    storeLang(locale);
    localStorage.setItem('lang', locale);

    const timeout = setTimeout(() => {
      getAccountUserInfo();
      if (!!localStorage.getItem('token')) {
        setShowContent(true);
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchParams, token, locale, redEnvelopeCurrentSeq]);

  return (
    <div
      className={classNames(styles.pinduoduoContainer__redEnvelope, {
        [styles.isSmallWebViewOverride]: isSmallWebView,
      })}
    >
      {showContent ? <MainScreen webView={true} /> : <LoadingIcon />}
    </div>
  );
};

export default RedEnvelope;
