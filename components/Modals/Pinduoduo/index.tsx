import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { DATA_MODAL } from '@/constants/enums';
import { GameInviterData } from '@/constants/types';
import { setFourthModal, setPrevPage } from '@/reducers/appData';
import { getInviterGame, playInviterGame, referralWebViewList } from '@/services/api';
import { TWebviewList } from '@/services/response-type';
import { debounce } from 'lodash-es';
import { useTranslations } from '@/hooks/useTranslations';
import PinduoduoRoulette from '../Invite/RedEnvelope/components/Pinduoduo/PinduoduoRoulette';

const Pinduoduo = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const t = useTranslations().affiliate;
  const [showWon, setShowWon] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [gameInviterData, setGameInviterData] = useState<GameInviterData | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPinduoduo, setShowPinduoduo] = useState<boolean>(false);

  useEffect(() => {
    checkPinduoduo();
    handleGetInviterData();
  }, []);

  const checkPinduoduo = async () => {
    try {
      const { data } = await referralWebViewList();
      const res = data?.data?.some((item: TWebviewList) => item.type === 'PINDUODUO');
      if (!res) {
        handleClose();
      }
      setShowPinduoduo(res);
    } catch (error) {
      console.error(error);
    }
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
      .finally(() => {});
  };

  const handlePlayButton = debounce(async () => {
    if (isSpinning) return;

    try {
      if (gameInviterData?.playCount === 0) {
        router.push('invite');
        return;
      }

      setIsSpinning(true);
      setIsLoading(true);
      const { data } = await playInviterGame();

      if (!!data.data?.errorMessage) {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);

        setTimeout(() => {
          setShowErrorModal(true);
          setErrorMessage(data.data?.errorMessage);
          setIsSpinning(false);
        }, 3200);
        return;
      }

      if (data.code !== 200) {
        setTimeout(() => {
          toast.error(data?.msg);
          setIsSpinning(false);
          setIsLoading(false);
        }, 2000);
        return;
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 2300);

      setTimeout(() => {
        handleGetInviterData();
        setEarnedPoints(data.data?.earnedPoints || 0);
        setShowWon(true);
      }, 3500);

      setTimeout(() => {
        setIsSpinning(false);
        setShowWon(false);
        router.push('invite');
      }, 7000);
    } catch (error: any) {
      console.error(error);
      setIsSpinning(false);
      setIsLoading(false);
    }
  }, 200);

  const handleClose = () => {
    if (isSpinning) return;

    dispatch(setFourthModal(DATA_MODAL.CLOSE));
    dispatch(setPrevPage('pinduoduo-page'));
    localStorage.removeItem('redEnvelope');
  };

  return !!showPinduoduo ? (
    <PinduoduoRoulette
      showWon={showWon}
      isLoading={isLoading}
      earnedPoints={earnedPoints}
      handlePlayButton={handlePlayButton}
      isSpinning={isSpinning}
      gameInviterData={gameInviterData}
      handleClose={handleClose}
      showErrorModal={showErrorModal}
      setShowErrorModal={setShowErrorModal}
      errorMessage={errorMessage}
      isModal={true}
    />
  ) : null;
};

export default Pinduoduo;
