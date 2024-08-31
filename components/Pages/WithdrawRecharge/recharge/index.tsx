'use client';

import { useEffect, useState } from 'react';
import { DATA_MODAL } from '@/constants/enums';
import {
  setActiveModal,
  setFourthModal,
  setPageLoad,
  setPrevPage,
  setSecondModal,
  setThirdModal,
} from '@/reducers/appData';
import { payTypeList } from '@/services/api';
import { TPayTypeList } from '@/services/response-type';
import { useAppDispatch, useAppSelector } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import LeftPanel from '../components/left-panel';
import RightPanel from '../components/right-panel';
import PaymentNavigation from './navigation';
import PaymentPage from './payment';

export type USDTData = {
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
  tex1: string | null;
  tex2: string | null;
  tex3: string | null;
  tex4: string | null;
  tex5: string | null;
};

const Recharge = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations().recharge;
  const { resetInternetStatus } = useWithDispatch();
  const { activeModal } = useAppSelector((state) => state.appData);
  const [bankList, setBankList] = useState<TPayTypeList[]>([]);
  const [activeMenu, setActiveMenu] = useState<number>(0);
  const [bankName, setBankName] = useState<string>('');
  const [isRechargeRecord, setIsRechargeRecord] = useState<boolean>(false);
  const [showRecord, setShowRecord] = useState<boolean>(false);
  const [usdtData, setUsdtData] = useState<USDTData | null>(null);

  useEffect(() => {
    resetInternetStatus();
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
    dispatch(setSecondModal(DATA_MODAL.CLOSE));
    dispatch(setThirdModal(DATA_MODAL.CLOSE));
    dispatch(setFourthModal(DATA_MODAL.CLOSE));

    dispatch(setPrevPage('recharge-page'));

    payTypeList().then(({ code, data }) => {
      if (code !== 200) return;
      if (data.length < 1) return;
      setBankList(data);
      setActiveMenu(data[0].id);
      setBankName(data[0].name);
      const usdt = data?.filter((item) => item?.name === 'USDT' && data);
      /** @ts-expect-error */
      setUsdtData(...usdt);
    });
    return () => {
      dispatch(setPageLoad(false));
    };
  }, []);

  useEffect(() => {
    if (activeModal === DATA_MODAL.RECHARGE_RECORDS) {
      setShowRecord(true);
    } else {
      setShowRecord(false);
    }
  }, [activeModal]);

  const handleMenuClick = (id: number, name?: string) => {
    setActiveMenu(id);
    if (name) setBankName(name);
    setIsRechargeRecord(false);
  };

  const setActivePage = () => {
    dispatch(setActiveModal(DATA_MODAL.RECHARGE_RECORDS));
  };

  const handleBack = () => {
    setIsRechargeRecord(false);
  };

  return (
    <div style={showRecord ? { display: 'none' } : {}}>
      <LeftPanel
        title={t.leftPanelTitle}
        menu={bankList}
        handleCLick={handleMenuClick}
        activeMenu={activeMenu}
      />
      <RightPanel>
        <PaymentNavigation
          setActivePage={setActivePage}
          isRechargeRecord={isRechargeRecord}
          handleBack={handleBack}
        />
        <PaymentPage
          activeMenu={activeMenu}
          bankName={bankName}
          usdtData={usdtData!}
        />
      </RightPanel>
    </div>
  );
};

export default Recharge;
