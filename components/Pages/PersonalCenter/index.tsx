'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FUND_DETAIL_MONEY, LOCAL_FILTERS } from '@/constants/enums';
import { setAnnouncements, setOtherDialogAnnouncementsData, setPageLoad, setPrevPage } from '@/reducers/appData';
import { setActiveTab, setDateFilter, setProfileIdToSet } from '@/reducers/userData';
import { getTradeTypes } from '@/services/api';
import { TTradeTypes } from '@/services/response-type';
import { motion } from 'framer-motion';
import HeaderTitle from '@/components/Customs/HeaderTitle';
import { ImgWithFallback } from '@/components/Customs/ImgWithFallback';
import { useAppDispatch, useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import Content from './components/Content';
import DateDropdown from './components/DateDropdown';
import Sidebar from './components/Sidebar';
import TradeTypesDropdown from './components/TradeTypesDropdown';
import styles from './index.module.scss';

const PersonalCenter = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations().personalCenter;
  const { resetInternetStatus } = useWithDispatch();
  const { language } = useAppSelector((state) => state.appData);
  const activeTab = useAppSelector((state) => state.userData?.personalCenter?.activeTab);
  const [tradeTypes, setTradeTypes] = useState<TTradeTypes[]>([]);
  const [statusFilter, setStatusFilter] = useState<TTradeTypes['name']>(null);

  useEffect(() => {
    dispatch(setPrevPage('other-page'));
    resetInternetStatus();
    return () => {
      localStorage.removeItem(LOCAL_FILTERS.BETTING_RECORD_DATE);
      localStorage.removeItem(LOCAL_FILTERS.FUND_DETAILS_DATE);
      localStorage.removeItem(LOCAL_FILTERS.FUND_DETAILS_STATUS);
      localStorage.removeItem(LOCAL_FILTERS.BETTING_CATEGORY);
      dispatch(setProfileIdToSet(null));
      dispatch(setPageLoad(false));
    };
  }, []);

  useEffect(() => {
    setTradeTypes([]);
    getTradeTypes().then(({ code, data }) => {
      if (code === 200) {
        data
          .sort((a, b) => a.des.toUpperCase().localeCompare(b.des.toUpperCase()))
          .unshift({ des: t.all, name: null, type: null });
        setTradeTypes(data);
        setStatusFilter(data[0].name!);
      }
    });
  }, [language]);

  const DATE_ITEMS = useMemo(
    () => [
      { label: t.today, filter: 'today', key: 0 },
      { label: t.yesterday, filter: 'yesterday', key: 1 },
      { label: t.oneMonth, filter: 'month', key: 2 },
    ],
    [language],
  );

  const SIDEBAR_TABS = useMemo(
    () => [
      { id: 3, name: t.profile },
      { id: 0, name: t.bettingRecord },
      { id: 1, name: t.transactionRecord },
      { id: 2, name: t.gameBalance },
    ],
    [language],
  );

  const setFilterStatus = (filter: TTradeTypes['name']) => {
    setStatusFilter(filter);
  };

  const renderTitle = () => (
    <div
      className={styles.title}
      data-lang={language}
    >
      <HeaderTitle
        text={t.title}
        size={30}
        transform='uppercase'
      />
    </div>
  );

  const renderFilterBack = () => (
    <div className={styles.filterBack}>
      {activeTab === 1 && (
        <TradeTypesDropdown
          activeTab={activeTab}
          label={`${t.status}:`}
          items={tradeTypes}
          handleSelectFilter={setFilterStatus}
        />
      )}
      {![2, 3].includes(activeTab) && (
        <DateDropdown
          activeTab={activeTab}
          label={`${t.transaction_Time}:`}
          items={DATE_ITEMS}
          handleSelectFilter={(item) => dispatch(setDateFilter(item))}
        />
      )}
      <motion.div
        className={styles.back}
        onClick={() => {
          dispatch(setPageLoad(true));
          router.push('/');
          dispatch(setActiveTab(3));
          dispatch(setDateFilter('today'));

          // These two dispatches below ensures that announcements will never be
          // called after clicking the back button
          dispatch(setAnnouncements([]));
          dispatch(setOtherDialogAnnouncementsData([]));
        }}
        whileTap={{ scale: 0.9 }}
      >
        <ImgWithFallback
          sizes='(max-width: 100vw) 100vw'
          alt='logo'
          src={images.go_back ?? ''}
          fill
          quality={100}
          priority
        />
      </motion.div>
    </div>
  );

  const renderTitleFilter = () => (
    <div className={styles.titleFilter}>
      {renderTitle()}
      {renderFilterBack()}
    </div>
  );

  const renderContent = () => {
    if (activeTab === undefined) {
      router.push('/');
      return null;
    }
    return (
      <div className={styles.personalCenterContent}>
        {renderTitleFilter()}
        <div className={styles.content}>
          <Sidebar tabs={SIDEBAR_TABS} />
          <Content statusFilter={statusFilter as FUND_DETAIL_MONEY} />
        </div>
      </div>
    );
  };

  return <div className={styles.personalCenterWrapper}>{renderContent()}</div>;
};

export default PersonalCenter;
