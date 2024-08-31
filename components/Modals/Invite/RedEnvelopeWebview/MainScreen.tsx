import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { RewardLogsType } from '@/constants/enums';
import { CardListType, GameInviterData, LogItem } from '@/constants/types';
import { setPageLoad, setRedEnvelopeSequence } from '@/reducers/appData';
import { getInviterGame, getInviterGameRewardLogs, playInviterGame } from '@/services/api';
import classNames from 'classnames';
import { AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash-es';
import { useAppDispatch, useAppSelector } from '@/store';
import { randomInteger } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import ErrorModal from './components/ErrorModal';
import LeftSideContent from './components/LeftSideContent';
import PrizeModal from './components/PrizeModal';
import RightSideContent from './components/RightSideContent';
import RuleInvitationCode from './components/RuleInvitationCode';
import EnvelopePrizeSVGA from './components/SVGA';
import CoinDropFloatSVGA from './components/SVGA';
import WelcomeSVGA from './components/SVGA';
import ScanCode from './components/ScanCode';
import TableContainer from './components/TableContainer';
import styles from './index.module.scss';

type MainScreenProps = { webView?: boolean };

const MainScreen: FC<MainScreenProps> = ({ webView }) => {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { getAccountBalance } = useWithDispatch();
  const t = useTranslations().affiliate;
  const { redEnvelopeCurrentSeq } = useAppSelector((state) => state.appData);
  const [showWelcomeSVGA, setShowWelcomeSVGA] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [methodTab, setMethodTab] = useState(1);
  const [rewardLogs, setRewardLogs] = useState<Array<LogItem>>([]);
  const [lotteryLogs, setLotteryLogs] = useState<Array<LogItem>>([]);
  const [gameInviterData, setGameInviterData] = useState<GameInviterData | null>(null);
  const [currentPoints, setCurrentPoints] = useState(gameInviterData?.progressPoints);
  const [selectedSlotPoints, setSelectedSlotPoints] = useState('');
  const [showPrizeSVGA, setShowPrizeSVGA] = useState(false);
  const [showCoinDropFloatSVGA, setShowCoinDropFloatSVGA] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const cardList = gameInviterData?.cardList.sort((a: CardListType, b: CardListType) => +a.id - +b.id);
  const slotDuration = 5000;
  const isSpinning = gameInviterData?.playCount! > 0 && selectedSlot !== 0;
  const isWindow = params.get('isWindow');

  useEffect(() => {
    handleGetInviterData();
    return () => {
      dispatch(setPageLoad(false));
    };
  }, []);

  useEffect(() => {
    if (redEnvelopeCurrentSeq === 1) {
      const svgaPopup = setTimeout(() => {
        handleShowWelcomeSVGA();
        dispatch(setRedEnvelopeSequence(2));
      }, 0);

      return () => clearTimeout(svgaPopup);
    }
  }, [redEnvelopeCurrentSeq]);

  useEffect(() => {
    if (showPrizeModal) {
      const prizeModalTimeout = setTimeout(() => {
        setShowPrizeModal(false);
        setHasWon(false);
        handleGetInviterData();
        getAccountBalance();
      }, 7500);

      return () => clearTimeout(prizeModalTimeout);
    }
  }, [showPrizeModal]);

  const handleGetInviterGameRewardLogs = (logsType: RewardLogsType) => {
    getInviterGameRewardLogs(logsType).then((res) => {
      const sortedLogs = res.data?.data?.sort(
        (a: LogItem, b: LogItem) => +new Date(b?.logTime) - +new Date(a?.logTime),
      );

      if (logsType === RewardLogsType.ACCOUNT_TRANSFERRED) {
        setRewardLogs(sortedLogs);
      } else {
        setLotteryLogs(sortedLogs);
      }
    });
  };

  const handleGetInviterData = () => {
    getInviterGame()
      .then((res) => {
        setGameInviterData(res.data?.data);
        setCurrentPoints(res.data?.data?.progressPoints);
      })
      .catch((error) => {
        toast.error(t.apiError, {
          id: 'error',
        });
        console.error(error);
      })
      .finally(() => {
        handleGetInviterGameRewardLogs(RewardLogsType.ACCOUNT_TRANSFERRED);
        handleGetInviterGameRewardLogs(RewardLogsType.INCOME);
      });
  };

  const handleRandomSlotItem = () => {
    const numInterval = setInterval(() => {
      const randomNumber = randomInteger(1, 9);
      setSelectedSlot(randomNumber);
    }, 100);

    const randomSlotTimeout = setTimeout(() => {
      clearInterval(numInterval);
      clearTimeout(randomSlotTimeout);
      setIsClicked(false);
    }, slotDuration);
  };

  const handleScanCodeClick = () => {
    const inviterLink = gameInviterData?.inviterLink;
    if (isWindow) {
      const message = 'invite/qr';
      window.parent.postMessage(message, '*');
    } else if (window.jsBridge) {
      window.jsBridge.triggerFunction(JSON.stringify({ jumpType: 'SHARE' }));
    } else if (window.webkit) {
      window.webkit.messageHandlers.triggerFunction.postMessage(inviterLink);
      window.webkit.messageHandlers.dictionaryFunction.postMessage({
        inviterLink,
        backgroundImage: gameInviterData?.backgroundImage,
        baseUrl2: gameInviterData?.baseUrl2,
      });
    } else {
      console.error('The ‘jsBridge’ interface is not available.');
    }
  };

  const handleShowWelcomeSVGA = () => {
    setShowWelcomeSVGA(true);

    const showWelcomeTimeout = setTimeout(() => {
      setShowWelcomeSVGA(false);
      clearTimeout(showWelcomeTimeout);
    }, 4000);
  };

  const handleShowCoinDropFloatSVGA = () => {
    const showCoinDropTimeout = setTimeout(() => {
      setShowCoinDropFloatSVGA(false);
      setSelectedSlot(0);
      if (!hasWon) handleGetInviterData();

      if (hasWon) {
        setCurrentPoints(gameInviterData?.completionPoints);

        const showPrizeTimeout = setTimeout(() => {
          setShowPrizeModal(true);
          clearTimeout(showPrizeTimeout);
        }, 1000);
      }
      clearTimeout(showCoinDropTimeout);
    }, 3200);
  };

  const handleShowPrizeSVGA = () => {
    const showPrizeTimeout = setTimeout(() => {
      setShowPrizeSVGA(false);
      setShowCoinDropFloatSVGA(true);
      clearTimeout(showPrizeTimeout);
    }, 4000);
  };

  const handlePlayButton = debounce(() => {
    setIsClicked(true);
    const redirectToQR = () => {
      if (!webView) {
        dispatch(setPageLoad(true));
        router.push('invite/qr');
      } else {
        handleScanCodeClick();
      }
    };

    playInviterGame().then((res) => {
      setIsClicked(false);
      if (!!res.data.data?.errorMessage) {
        setShowErrorModal(true);
        setErrorMessage(res.data.data?.errorMessage);
      } else {
        if (gameInviterData?.playCount === 0) {
          redirectToQR();
        } else if (gameInviterData!?.playCount > 0) {
          handleRandomSlotItem();
          setSelectedSlotPoints(res.data.data?.earnedPoints);
          setHasWon(res.data?.data?.hasWon);

          const showPlayPrizeTimeout = setTimeout(() => {
            setShowPrizeSVGA(true);
            clearTimeout(showPlayPrizeTimeout);
          }, slotDuration + 1000);
        }
      }
    });
  }, 750);

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  };

  const renderLeftRightContent = () => {
    return (
      <>
        <LeftSideContent
          gameInviterData={gameInviterData}
          selectedSlot={selectedSlot}
          webView={webView}
          handleGetInviterData={handleGetInviterData}
          currentPoints={currentPoints}
          handlePlayButton={handlePlayButton}
          showSVGA={showWelcomeSVGA}
          isClicked={isClicked}
        />
        <RightSideContent
          selected={selectedSlot}
          gameInviterData={gameInviterData}
          cardList={cardList}
          webView={webView}
          setMethodTab={setMethodTab}
          isSpinning={isSpinning}
          handleScroll={handleScroll}
        />
      </>
    );
  };

  const renderTopContent = () => {
    return (
      <div className={styles.mainScreen__topContent}>
        {renderLeftRightContent()}
        <RuleInvitationCode
          onClick={() => {
            if (!isSpinning) {
              setMethodTab(3);
              handleScroll('rules');
            }
          }}
          webView={webView}
        />
        <ScanCode
          webView={webView}
          isSpinning={isSpinning}
          handleScanCodeClick={handleScanCodeClick}
        />
      </div>
    );
  };

  const renderMainScreen = () => (
    <>
      {showWelcomeSVGA && (
        <WelcomeSVGA
          showSVGA={showWelcomeSVGA}
          svga={images.svga_9}
          isSVGALoaded={() => handleShowWelcomeSVGA()}
          svgaText={t.welcomeToSpinToWin}
          webView={webView}
        />
      )}
      {showPrizeSVGA && (
        <EnvelopePrizeSVGA
          showSVGA={showPrizeSVGA}
          svga={images.svga_5}
          isSVGALoaded={() => handleShowPrizeSVGA()}
          svgaText={`${t.youGet} ${selectedSlotPoints || 0} ${t.points}!`}
          svgaTextDelay={2000}
          svgaTextExit={1800}
          webView={webView}
        />
      )}
      {showCoinDropFloatSVGA && (
        <CoinDropFloatSVGA
          showSVGA={showCoinDropFloatSVGA}
          svga={images.coin_drop_float}
          isSVGALoaded={() => handleShowCoinDropFloatSVGA()}
          webView={webView}
        />
      )}
      {showPrizeModal && (
        <PrizeModal
          showPrizeModal={showPrizeModal}
          points={gameInviterData?.completionPoints}
          webView={webView}
        />
      )}
      <AnimatePresence>
        {showErrorModal && (
          <ErrorModal
            showModal={showErrorModal}
            closeModal={() => setShowErrorModal(false)}
            webView={webView}
            errorMessage={errorMessage}
          />
        )}
      </AnimatePresence>
      <div
        className={classNames(
          styles.mainScreen,
          { [styles['mainScreen--disableScroll']]: isSpinning },
          { [styles['mainScreen--webView']]: webView },
        )}
      >
        {renderTopContent()}
        <TableContainer
          webView={webView}
          lotteryLogs={lotteryLogs}
          rewardLogs={rewardLogs}
          inviterGameRuleText={gameInviterData?.inviterGameRule}
          methodTab={methodTab}
          setMethodTab={setMethodTab}
        />
      </div>
    </>
  );

  return renderMainScreen();
};

export default MainScreen;
