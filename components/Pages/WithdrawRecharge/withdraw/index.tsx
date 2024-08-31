'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { DATA_MODAL, LOCAL_FILTERS, SCREEN_TYPE, SIDE_MENU } from '@/constants/enums';
import { setActiveModal, setFourthModal, setPrevPage, setSecondModal, setThirdModal } from '@/reducers/appData';
import { setPageLoad } from '@/reducers/appData';
import { TPayTypeList } from '@/services/response-type';
import classNames from 'classnames';
import { useRouter } from 'next-nprogress-bar';
import { useAppDispatch } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import LeftPanel from '../components/left-panel';
import RightPanel from '../components/right-panel';
import { BettingRecords, CodeDetails, FastWithdraw, Records, WalletManagement } from './dynamic-imports';
import styles from './index.module.scss';

const Withdraw = () => {
  const router = useRouter();
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { resetInternetStatus } = useWithDispatch();
  const [activeMenu, setActiveMenu] = useState<number>(1);
  const [fwScreen, setFwScreen] = useState<number>(1);
  const SIDE_MENU_WITHDRAW: TPayTypeList[] = [
    { id: 1, name: t.withdraw.fastWithdraw },
    { id: 2, name: t.withdraw.codeDetails },
    { id: 3, name: t.withdraw.walletManagement },
    { id: 4, name: t.withdraw.withdrawRecords },
    { id: 5, name: t.personalCenter.bettingRecord },
  ];

  useEffect(() => {
    resetInternetStatus();
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
    dispatch(setSecondModal(DATA_MODAL.CLOSE));
    dispatch(setThirdModal(DATA_MODAL.CLOSE));
    dispatch(setFourthModal(DATA_MODAL.CLOSE));
    dispatch(setPrevPage('other-page'));

    return () => {
      localStorage.removeItem(LOCAL_FILTERS.FUND_DETAILS_DATE);
      dispatch(setPageLoad(false));
    };
  }, []);

  const handleMenuClick = (id: number, name?: string, screen?: number) => {
    setActiveMenu(id);
    if (screen) {
      setFwScreen(+screen);
      sessionStorage.setItem('withdraw-back', SCREEN_TYPE.ADD_BANK.toString());
    } else {
      setFwScreen(SCREEN_TYPE.BANK_LIST);
      sessionStorage.removeItem('withdraw-back');
    }
  };

  return (
    <div>
      <LeftPanel
        handleCLick={handleMenuClick}
        activeMenu={activeMenu}
        title={t.withdraw.leftPanelTitle}
        menu={SIDE_MENU_WITHDRAW}
      />
      <RightPanel isWithdrawPage>
        {activeMenu !== SIDE_MENU.WALLET_MANAGEMENT && (
          <div
            className={classNames(styles.backBtn, 'btn')}
            onClick={() => {
              dispatch(setPageLoad(true));
              router.push('/');
            }}
          >
            <Image
              src={images.go_back}
              alt='back-btn'
              fill
              sizes='100%'
            />
          </div>
        )}
        {activeMenu === SIDE_MENU.FAST_WITHDRAW && <FastWithdraw handleRedirect={handleMenuClick} />}
        {activeMenu === SIDE_MENU.CODE_DETAILS && <CodeDetails />}
        {activeMenu === SIDE_MENU.WALLET_MANAGEMENT && (
          <WalletManagement
            screenActive={fwScreen}
            handleRedirect={handleMenuClick}
          />
        )}
        {activeMenu === SIDE_MENU.WITHDRAW_RECORDS && <Records />}
        {activeMenu === SIDE_MENU.BETTING_RECORDS && <BettingRecords />}
      </RightPanel>
    </div>
  );
};

export default Withdraw;
