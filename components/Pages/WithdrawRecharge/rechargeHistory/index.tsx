'use client';

import { useEffect, useState } from 'react';
import { TPayTypeList } from '@/services/response-type';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import LeftPanel from '../components/left-panel';
import RightPanel from '../components/right-panel';
import HistoryMainContent from './historyContent';

const RechargeHistory = () => {
  const { resetInternetStatus } = useWithDispatch();
  const t = useTranslations().recharge;
  const [activeMenu, setActiveMenu] = useState<number>(0);
  const [transactionName, setTransactionName] = useState<string>(t.onlineRecharge);
  const bankList: TPayTypeList[] = [
    {
      id: 0,
      name: t.onlineRecharge,
      iconUrl: '',
    },
    {
      id: 1,
      name: `USDT ${t.leftPanelTitle}`,
      iconUrl: '',
    },
  ];

  useEffect(() => {
    resetInternetStatus();
  }, []);

  const handleMenuClick = (id: number, name?: string) => {
    setActiveMenu(id);
    if (name) setTransactionName(name);
  };

  return (
    <div>
      <LeftPanel
        title={t.leftPanelTitle}
        menu={bankList}
        handleCLick={handleMenuClick}
        activeMenu={activeMenu}
      />
      <RightPanel isWithdrawPage>
        <HistoryMainContent transactionName={transactionName} />
      </RightPanel>
    </div>
  );
};

export default RechargeHistory;
