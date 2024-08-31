'use client';

import { FC, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { isIOS, isMobile, osVersion } from 'react-device-detect';
import { setJackpotClickedPid } from '@/reducers/appData';
import { getGameInfoGroup, getGameList } from '@/services/api';
import { TGameItem, TGamePlatform } from '@/services/response-type';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { debounce } from 'lodash-es';
import { FreeMode } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import CustomSwiper from '@/components/Customs/CustomSwiper';
import { ImgWithFallback } from '@/components/Customs/ImgWithFallback';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { useAppDispatch, useAppSelector } from '@/store';
import { isHuaweiBrowser, isMobilePlatform, isiOSStandaloneMode } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import GameItem from '../GameItem';
import GamePlatform from '../GamePlatform';
import HomeBanner from '../HomeBanner';
import styles from './index.module.scss';

type GameListProps = {
  gameListId: number;
  gameTypeId: number;
};

const GameList: FC<GameListProps> = ({ gameListId, gameTypeId }) => {
  const t = useTranslations().home;
  const dispatch = useAppDispatch();
  const platID = localStorage.getItem('platformId') ?? 0;
  const locale = useAppSelector((s) => s.appData.language);
  const gameListParentMobileRef = useRef<HTMLDivElement>(null);
  const { eventList, jackpotClickedPid } = useAppSelector((state) => state.appData);
  const [allGameList, setAllGameList] = useState<TGameItem[]>([]);
  const [topList, setTopList] = useState<TGameItem[]>([]);
  const [bottomList, setBottomList] = useState<TGameItem[]>([]);
  const [platformList, setPlatformList] = useState<TGamePlatform[]>([]);
  const swiperRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [isEnteringGame, setIsEnteringGame] = useState<boolean>(false);
  const [showPlatformGames, setShowPlatformGames] = useState<boolean>(gameTypeId !== 3);
  const [platformId, setPlatformId] = useState<number>(+platID);
  const [gameListParentMobileHeight, setGameListParentMobileHeight] = useState<number>(0);
  const gameListWrapperHeight = gameListParentMobileHeight ?
    { height: gameListParentMobileHeight + 'px', fontSize: gameListParentMobileHeight / 2 + 'px'} : {}
  const [spinDeg, setSpinDeg] = useState<number>(0);
  const iosVersion = /(iPhone|iPad) OS ([1-9]*)/g.exec(window.navigator.userAgent)?.[2] || 0;

  useEffect(() => {
    if (platformId) {
      setShowPlatformGames(true);
    }
  }, [platformId]);

  useLayoutEffect(() => {
    setGameListHeight();
    let debounceId: any;

    function handleDebouncedResize() {
      if (debounceId) {
        clearTimeout(debounceId);
      }
      debounceId = setTimeout(
        () => {
          setGameListHeight();
        },
        osVersion === '15.7.9' && isiOSStandaloneMode() ? 500 : 700,
      );
    }
    window.addEventListener('resize', handleDebouncedResize);
    window.addEventListener('orientationchange', handleDebouncedResize);
    window.addEventListener('visibilitychange', handleDebouncedResize);

    return () => {
      window.removeEventListener('resize', handleDebouncedResize);
      window.removeEventListener('orientationchange', handleDebouncedResize);
      window.removeEventListener('visibilitychange', handleDebouncedResize);
    };
  }, [topList]);

  useEffect(() => {
    getGameListRequestFn();
    setHasNext(true);
  }, [gameListId, showPlatformGames, locale, platformId]);

  useEffect(() => {
    const element = gameListParentMobileRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => {
        element.removeEventListener('scroll', handleScroll);
      };
    }
  }, [gameListId, locale, topList]);

  useEffect(() => {
    if (jackpotClickedPid) {
      handlePlatformClick(jackpotClickedPid);
      setTimeout(() => {
        dispatch(setJackpotClickedPid(0));
      }, 1000);
    }
  }, [jackpotClickedPid]);

  useEffect(() => {
    return () => {
      localStorage.removeItem('platformId');
      localStorage.removeItem('platformToScroll');
    };
  }, []);

  const getGameListRequestFn = () => {
    if (showPlatformGames) {
      getGameList({ ...(platformId ? { pid: platformId } : {}), id: gameListId, pageNum: page, pageSize: 40 })
        .then((res: any) => {
          setHasNext(res.data?.hasNext);
          if (!!res.data?.data?.length) {
            const list = res.data?.data;
            setAllGameList(list);

            if (gameTypeId === 1) {
              setTopList(list?.slice(2, list?.length).filter((item: TGameItem, idx: number) => idx % 2 === 0));
              const bottomListTemp = list.slice(2).filter((item: TGameItem, idx: number) => idx % 2 !== 0);
              bottomListTemp.unshift(list[0], list[1]);
              setBottomList(bottomListTemp);
            } else {
              setTopList(list?.filter((item: TGameItem, idx: number) => idx % 2 === 0));
              setBottomList(list?.filter((item: TGameItem, idx: number) => idx % 2 !== 0));
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      getGameInfoGroup({ id: gameListId })
        .then(({ data }) => {
          if (data.length > 0) {
            setPlatformList(data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const fetchAndUpdateGameList = async () => {
    try {
      const res = await getGameList({ id: gameListId, pageNum: page + 1, pageSize: 40 });
      if (!!res.data?.data?.length) {
        setHasNext(res.data?.hasNext);
        const list = res.data?.data;
        setTopList((prev) => [...prev, ...list?.filter((item: TGameItem, idx: number) => idx % 2 === 0)]);
        setBottomList((prev) => [...prev, ...list?.filter((item: TGameItem, idx: number) => idx % 2 !== 0)]);
      }
    } finally {
      setPage((prev) => prev + 1);
      setIsLoading(false);
    }
  };

  const enteringGame = (loading: boolean) => {
    setIsEnteringGame(loading);
  };

  const handleScroll = () => {
    const element = gameListParentMobileRef.current;

    if (element) {
      const scrollTop = element.scrollLeft;
      const scrollHeight = element.scrollWidth;
      const clientHeight = element.clientWidth;

      if (scrollTop + clientHeight === scrollHeight) {
        if (hasNext) {
          handleNextPage();
        }
      }
    }
  };

  const setTopRowWidth = () => {
    if (isMobile) {
      const gameItemEl = document.getElementsByClassName('gameItem')[0];
      const gamePlatformEl = document.getElementsByClassName('gamePlatform')[0];
      const topRowEl = document.getElementById('topRowList');
      if ((gameItemEl || gamePlatformEl) && topRowEl) {
        const gameItemWidth = showPlatformGames ? gameItemEl?.scrollWidth : gamePlatformEl?.scrollWidth;
        const gapValue = getComputedStyle(topRowEl)?.getPropertyValue('gap');
        const match = gapValue.match(/(\d+(?:\.\d+)?)px\s(\d+(?:\.\d+)?)px/);
        const rowGap = match ? parseFloat(match[1]) : 0;
        const gapWidth = Number(gapValue.slice(0, -2));
        const combinedWidth = Number(gameItemWidth + (isIOS && isMobilePlatform() ? rowGap : gapWidth));

        if (showPlatformGames) {
          if (gameTypeId === 1) {
            topRowEl.style.width = String(combinedWidth * (topList?.length + 2)) + 'px';
          } else {
            topRowEl.style.width = String(combinedWidth * topList?.length) + 'px';
          }
        } else {
          topRowEl.style.width = String(combinedWidth * platformList?.length) + 'px';
        }
      }
    }
  };

  const handleNextPage = async () => {
    if (!isMobile) {
      if (swiperRef.current && swiperRef.current?.isEnd) {
        fetchAndUpdateGameList();
      }
    } else {
      if (gameListParentMobileRef.current) {
        if (showPlatformGames) {
          fetchAndUpdateGameList();
        } else {
          const { code, data } = await getGameInfoGroup({ id: gameListId });
          if (code !== 200 || data.length < 1) return;
          setPlatformList(data);
        }
      }
    }
  };

  const setGameListHeight = () => {
    gameListParentMobileRef.current && setGameListParentMobileHeight(gameListParentMobileRef.current?.offsetHeight);
    setTopRowWidth();
  };

  const scrollToLastSelectedPlatform = () => {
    const platformToScroll = localStorage.getItem('platformToScroll');
    if (platformToScroll) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = platformToScroll;
      const platformNode = tempDiv.firstChild;
      setTimeout(() => {
        if (allGameList && platformNode instanceof HTMLElement) {
          const existingNode = document.querySelector(`#platform_${platformId}`);
          if (existingNode) {
            existingNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
            localStorage.removeItem('platformToScroll');
          }
        }
      }, 500);
    }
  };

  const handlePlatformClick = (pid: number) => {
    const platformToScroll = document.getElementById(`platform_${pid}`);
    localStorage.setItem('platformToScroll', String(platformToScroll?.outerHTML));
    setPlatformId(pid);
    setShowPlatformGames(true);
    localStorage.setItem('platformId', pid.toString());
  };

  const handleBackLobbyClick = () => {
    scrollToLastSelectedPlatform();
    setShowPlatformGames(false);
    localStorage.removeItem('platformId');
    localStorage.removeItem('platformToScroll');
  };

  const memoizedHomeBanner = useMemo(() => <HomeBanner />, [eventList]);

  const overflowContent = () => {
    return (
      <>
        {showPlatformGames && gameTypeId === 3 && (
          <motion.div
            whileTap={{ scale: 0.9 }}
            className={styles.backToLobby}
            onClick={handleBackLobbyClick}
          >
            <ImgWithFallback
              sizes='(max-width: 100vw) 100vw'
              alt='logo'
              src={images.back_v2}
              fill
              quality={100}
              priority
            />
            <span data-lang={locale}>{t.back}</span>
          </motion.div>
        )}
        <div
          key={String(showPlatformGames)}
          className={styles.gameListParentMobile}
          ref={gameListParentMobileRef}
        >
          <div
            onLoad={() => setGameListHeight()}
            className={styles.gameListWrapper}
            id='gameListWrapper'
            style={gameListWrapperHeight}
          >
            <div
              className={classNames(styles.topRow, { [styles.platformOverride]: gameTypeId === 3 && !showPlatformGames })}
              id='topRowList'
            >
              {gameTypeId === 1 && memoizedHomeBanner}
              {showPlatformGames &&
                topList?.length > 0 &&
                topList?.map((gameItem, idx) => {
                  return (
                    <GameItem
                      setTopRowWidth={setTopRowWidth}
                      gameListId={gameListId}
                      isEnteringGame={enteringGame}
                      idx={idx}
                      key={gameItem?.icon + gameItem?.id}
                      gameItem={gameItem}
                    />
                  );
                })}
              {!showPlatformGames &&
                platformList?.length > 0 &&
                platformList?.map((gamePlatform, idx) => {
                  return (
                    <GamePlatform
                      handlePlatformClick={handlePlatformClick}
                      setTopRowWidth={setTopRowWidth}
                      gameListId={gameListId}
                      idx={idx}
                      key={gamePlatform?.icon + gamePlatform?.id}
                      gamePlatform={gamePlatform}
                    />
                  );
                })}
            </div>
            {showPlatformGames && (
              <div className={styles.bottomRow}>
                {bottomList?.length > 0 &&
                  bottomList?.map((gameItem, idx) => {
                    return (
                      <GameItem
                        gameListId={gameListId}
                        isEnteringGame={enteringGame}
                        idx={idx}
                        key={gameItem?.icon + gameItem?.id}
                        gameItem={gameItem}
                      />
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const swiperContent = () => {
    return (
      <>
        {showPlatformGames && gameTypeId === 3 && (
          <motion.div
            whileTap={{ scale: 0.9 }}
            className={styles.backToLobby}
            onClick={handleBackLobbyClick}
          >
            <ImgWithFallback
              sizes='(max-width: 100vw) 100vw'
              alt='logo'
              src={images.back_v2}
              fill
              quality={100}
              priority
            />
            <span data-lang={locale}>{t.back}</span>
          </motion.div>
        )}
        <div
          key={String(showPlatformGames)}
          className={styles.gameListParent}
          ref={gameListParentMobileRef}
        >
          <CustomSwiper
            ref={swiperRef}
            modules={[FreeMode]}
            className={styles.gameListSwiper}
            slidesPerView={'auto'}
            freeMode={true}
            loop={false}
            onReachEnd={() => {
              hasNext && handleNextPage();
            }}
            onLoad={() => setGameListHeight()}
            style={gameListWrapperHeight}
          >
            <SwiperSlide className={styles.slide}>
              <div
                className={classNames(styles.gameListWrapper, styles.gameListWrapperHuaweiBrowser)}
                onLoad={() => setGameListHeight()}
              >
                <div
                  id='topRowList'
                  className={classNames(styles.topRow, {
                    [styles['topRow--h100']]: gameTypeId !== 1,
                    [styles.platformOverride]: gameTypeId === 3 && !showPlatformGames
                  })}
                >
                  {gameTypeId === 1 && memoizedHomeBanner}
                  {showPlatformGames &&
                    topList?.length > 0 &&
                    topList?.map((gameItem, idx) => {
                      return (
                        <GameItem
                          gameListId={gameListId}
                          isEnteringGame={enteringGame}
                          idx={idx}
                          key={gameItem?.icon + gameItem?.id + idx}
                          gameItem={gameItem}
                        />
                      );
                    })}
                  {!showPlatformGames &&
                    platformList?.length > 0 &&
                    platformList?.map((gamePlatform, idx) => {
                      return (
                        <GamePlatform
                          handlePlatformClick={handlePlatformClick}
                          gameListId={gameListId}
                          idx={idx}
                          key={gamePlatform?.icon + gamePlatform?.id}
                          gamePlatform={gamePlatform}
                        />
                      );
                    })}
                </div>
                {showPlatformGames && (
                  <div className={styles.bottomRow}>
                    {bottomList?.length > 0 &&
                      bottomList?.map((gameItem, idx) => {
                        return (
                          <GameItem
                            gameListId={gameListId}
                            isEnteringGame={enteringGame}
                            idx={idx}
                            key={gameItem?.icon + gameItem?.id + idx}
                            gameItem={gameItem}
                          />
                        );
                      })}
                  </div>
                )}
              </div>
            </SwiperSlide>
          </CustomSwiper>
        </div>
      </>
    );
  };

  return (
    <>
      {isEnteringGame && (
        <div className={styles.gameLoader}>
          <LoadingIcon />
        </div>
      )}

      <AnimatePresence key={'gameList'}>
        {isLoading ? (
          <div className={styles.loadingWrapper}>
            <LoadingIcon />
          </div>
        ) : !!allGameList.length || !!platformList.length ? (
          <>
            {!isMobile && swiperContent()}

            {isMobile && isHuaweiBrowser() && (
              <>
                {screen?.orientation?.type.includes('landscape') && overflowContent()}
                {screen?.orientation?.type.includes('portrait') && swiperContent()}
              </>
            )}
            {isMobile && !isHuaweiBrowser() && +iosVersion > 16 && (
              <>
                {screen?.orientation?.type.includes('landscape') && overflowContent()}
                {screen?.orientation?.type.includes('portrait') && overflowContent()}
              </>
            )}
            {isMobile && !isHuaweiBrowser() && +iosVersion <= 16 && <>{overflowContent()}</>}
          </>
        ) : (
          <div className={styles.errorContainer}>
            <div className={styles.errorContainer__content}>
              <motion.div
                className={styles.btnContainer}
                onClick={debounce(() => {
                  setSpinDeg((prev) => prev + 360);
                  getGameListRequestFn();
                }, 200)}
                animate={{ rotate: spinDeg }}
                transition={{ duration: 0.1, ease: 'backOut' }}
              >
                <ImgWithFallback
                  src={images.refresh_btn}
                  alt='refresh'
                  fill
                  sizes='30vw'
                />
              </motion.div>
              <span>{t.refreshPage}</span>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GameList;
