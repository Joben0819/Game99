import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import SnowContainer from '@/components/Customs/SnowContainer';
import { useAppDispatch } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import Levels from './components/levels';

const NextLevel = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations().rescueFund;

  const handleClose = () => {
    dispatch(setActiveModal(DATA_MODAL.RESCUE_FUND));
  };

  return (
    <SnowContainer
      title={t.title}
      onClose={handleClose}
    >
      <Levels />
    </SnowContainer>
  );
};

export default NextLevel;
