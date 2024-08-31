import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DATA_MODAL, RewardLogsType } from '@/constants/enums';
import { GameInviterData, LogItem } from '@/constants/types';
import { setFourthModal, setPageLoad, setPrevPage, setRedEnvelopeSequence } from '@/reducers/appData';
import { getInviterGame, getInviterGameRewardLogs } from '@/services/api';
import { AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import ErrorModal from './components/ErrorModal';
import Header from './components/Header';
import InviterGameRules from './components/InviterGameRules';
import LotteryLogs from './components/LotteryLogs';
import Pinduoduo from './components/Pinduoduo';
import PrizeModal from './components/PrizeModal';
import RewardLogs from './components/RewardLogs';
import styles from './index.module.scss';

type MainScreenProps = { webView?: boolean };

const MainScreen: FC<MainScreenProps> = ({ webView }) => {
  const dispatch = useAppDispatch();
  const { getAccountBalance } = useWithDispatch();
  const t = useTranslations().affiliate;
  const { redEnvelopeCurrentSeq } = useAppSelector((state) => state.appData);
  const [showWelcomeSVGA, setShowWelcomeSVGA] = useState(false);
  const [rewardLogs, setRewardLogs] = useState<Array<LogItem>>([]);
  const [lotteryLogs, setLotteryLogs] = useState<Array<LogItem>>([]);
  const [gameInviterData, setGameInviterData] = useState<GameInviterData | null>(null);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeHeader, setActiveHeader] = useState<'pinduoduo' | 'lottery' | 'rewards' | 'inviter'>('pinduoduo');

  const ContentData = {
    pinduoduo: () => (
      <Pinduoduo
        setShowErrorModal={setShowErrorModal}
        setErrorMessage={setErrorMessage}
        showWelcomeSVGA={showWelcomeSVGA}
        gameInviterData={gameInviterData}
        setGameInviterData={setGameInviterData}
        setShowPrizeModal={setShowPrizeModal}
        handleGetInviterData={handleGetInviterData}
      />
    ),
    lottery: () => (
      <div className={styles.hasPadding}>
        <LotteryLogs
          webView={webView}
          data={lotteryLogs}
        />
      </div>
    ),
    rewards: () => (
      <div className={styles.hasPadding}>
        <RewardLogs
          webView={webView}
          data={rewardLogs}
        />
      </div>
    ),
    inviter: () => (
      <div className={styles.hasPadding}>
        <InviterGameRules
          webView={webView}
          inviterGameRuleText={gameInviterData?.inviterGameRule!}
        />
      </div>
    ),
  };

  useEffect(() => {
    handleGetInviterData();

    if (localStorage.getItem('redEnvelope')) {
      dispatch(setPrevPage('pinduoduo-page'));
      setTimeout(() => {
        dispatch(setFourthModal(DATA_MODAL.CLOSE));
      }, 3000);
    }
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

  const handleShowWelcomeSVGA = () => {
    setShowWelcomeSVGA(true);

    const showWelcomeTimeout = setTimeout(() => {
      setShowWelcomeSVGA(false);
      clearTimeout(showWelcomeTimeout);
    }, 4000);
  };

  const renderContent = () => {
    const ContentToRender = ContentData[activeHeader];

    return (
      <div className={styles.wrapper}>
        <Header
          activeHeader={activeHeader}
          setActiveHeader={setActiveHeader}
        />
        {ContentToRender()} {/* used direct function invocation to avoid flickering  */}
      </div>
    );
  };

  const renderMainScreen = () => (
    <>
      {/* {showWelcomeSVGA && (
        <WelcomeSVGA
          showSVGA={showWelcomeSVGA}
          svga={images.svga_9}
          isSVGALoaded={() => handleShowWelcomeSVGA()}
          svgaText={t.welcomeToSpinToWin}
          webView={webView}
        />
      )} */}

      <AnimatePresence>{showPrizeModal && <PrizeModal points={gameInviterData?.completionPoints} />}</AnimatePresence>

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
      <div className={styles.mainScreen}>{renderContent()}</div>
    </>
  );

  return renderMainScreen();
};

export default MainScreen;
