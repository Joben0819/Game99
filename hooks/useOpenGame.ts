import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { APK_EVENT } from '@/constants/enums';
import { setGameUrl, setPageLoad, setPrevPage } from '@/reducers/appData';
import { joinGame } from '@/services/api';
import { useAppDispatch } from '@/store';
import { triggerApkEvent } from '@/utils/helpers';
import { useTranslations } from './useTranslations';

const useOpenGame = () => {
  const { push } = useRouter();
  const t = useTranslations().game;
  const dispatch = useAppDispatch();

  const openGame = (gameId: string, after?: () => void) => {
    triggerApkEvent(APK_EVENT.ENTER_GAME);
    joinGame({ id: gameId })
      .then((res) => {
        dispatch(setPageLoad(true));
        if (res?.data?.code === 200 && res.data?.data) {
          dispatch(setGameUrl(res.data?.data?.gameUrl));
          const platformName = res?.data?.data?.gamePlatform.name;
          sessionStorage.setItem('on-game', 'true');
          dispatch(setPrevPage('game'));
          push(`/game/${gameId}/?platformName=${platformName}`);
        } else toast.error(t.gameError, { id: 'error' });
      })
      .catch((err) => console.error(err))
      .finally(() => {
        after?.();
        dispatch(setPageLoad(false));
      });
  };

  return { openGame };
};

export default useOpenGame;
