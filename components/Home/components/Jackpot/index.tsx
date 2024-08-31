import { memo, useEffect, useRef, useState } from 'react';
import { IDLE_TIMEOUT } from '@/constants/app';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveGamesType, setActiveModal, setInitialJackpotData, setJackpotClickedPid } from '@/reducers/appData';
import { TGamesType, TJackpotPrizeList } from '@/services/response-type';
import { useIdle } from '@uidotdev/usehooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { isLoggedIn } from '@/utils/helpers';
import useOpenGame from '@/hooks/useOpenGame';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';
import { useGetJackpotPrizeListQuery } from './jackpot.rtk';

const Jackpot = () => {
  const countdownTimer = 60;
  const t = useTranslations().home;
  const { openGame } = useOpenGame();
  const dispatch = useAppDispatch();
  const isIdle = useIdle(IDLE_TIMEOUT);
  const { gamesTypeItems, activeGamesType } = useAppSelector((state) => state.appData);
  const initialJackpotData = useAppSelector((state) => state.appData?.initialJackpotData) ?? [];
  const [jackpotData, setJackpotData] = useState<TJackpotPrizeList[]>([]);
  const [currentMoneyIndex, setCurrentMoneyIndex] = useState(0);
  const jackpotContainerRef = useRef<HTMLDivElement>(null);
  const jackpotPrizeItem = initialJackpotData[currentMoneyIndex];
  const init = useAppSelector((state) => state.appData.initData);

  const { data: jackpotList } = useGetJackpotPrizeListQuery(null, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    pollingInterval: 1000 * countdownTimer,
    refetchOnFocus: isIdle,
  });

  useEffect(() => {
    const handleJackpotListData = () => {
      if (!Array.isArray(jackpotList)) return;
      if (jackpotList.length < 1) return;
      setJackpotData(jackpotList.filter((a) => a.money != null || a.money != undefined));
    };
    handleJackpotListData();
  }, [jackpotList]);

  useEffect(() => {
    if (jackpotData.length > 0) {
      dispatch(setInitialJackpotData(jackpotData));
    }
    if (jackpotData.length < 1) return;
    const duration = countdownTimer / jackpotData.length;
    const moneyTimer = setInterval(() => {
      setCurrentMoneyIndex((prevIndex) => (prevIndex + 1) % jackpotData.length);
    }, duration * 1000);
    return () => clearInterval(moneyTimer);
  }, [jackpotData]);

  const activeJackpotNameIndex = initialJackpotData.findIndex(
    (item) => item.platformName === jackpotPrizeItem.platformName,
  );

  const addPlatform = () => {
    const platformId = localStorage.getItem('platformId');
    if (platformId) {
      const platformToScroll = document.getElementById(`platform_${platformId}`);
      localStorage.setItem('platformToScroll', String(platformToScroll?.outerHTML));
    }
  };

  const handleJackpotClick = () => {
    addPlatform();
    if (!isLoggedIn()) return dispatch(setActiveModal(DATA_MODAL.LOGIN_MODAL));
    if (initialJackpotData.length < 1) return;
    if (!jackpotPrizeItem.gameId && !jackpotPrizeItem.platformId) return;
    if (jackpotPrizeItem.gameId) {
      openGame(String(jackpotPrizeItem.gameId) || '');
      return;
    }
    if (!jackpotPrizeItem.gameId && jackpotPrizeItem.platformId && jackpotPrizeItem.id) {
      const gamesTypeItem: TGamesType | null =
        gamesTypeItems?.find((gamesType) => gamesType.id === jackpotPrizeItem.id) ?? activeGamesType;
      dispatch(setActiveGamesType(gamesTypeItem!));
      localStorage.setItem('platformId', String(jackpotPrizeItem.platformId));
      dispatch(setJackpotClickedPid(jackpotPrizeItem.platformId));
      return;
    }
  };

  if (init.showJackpot === '0') return null;

  return (
    <div
      className={styles.jackpotContainer}
      ref={jackpotContainerRef}
      onClick={handleJackpotClick}
    >
      <div className={styles.titleContainer}>
        <span>{t.jackpot}</span>
      </div>

      {initialJackpotData.length > 0 && (
        <div className={styles.jackpotPrizeContent}>
          <div className={styles.platformName}>
            <div data-index={activeJackpotNameIndex}>
              {initialJackpotData.map((item, idx) => (
                <span key={idx}>{item.platformName}</span>
              ))}
            </div>
          </div>

          <div className={styles.jackpotNumWrapper}>
            {String(jackpotPrizeItem.money)
              .replace('k', '')
              .split('')
              .map((value, idx) => {
                return value === ',' ? (
                  <span
                    key={idx}
                    className={styles.prize}
                  >
                    {value}
                  </span>
                ) : (
                  <div
                    className={styles.numItem}
                    key={idx}
                  >
                    <div
                      className={styles.numImg}
                      data-num={value}
                    />
                  </div>
                );
              })}
            <span className={styles.prize}>&nbsp;K</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Jackpot);
