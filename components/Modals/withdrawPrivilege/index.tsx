import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import SnowContainer from '@/components/Customs/SnowContainer';
import { useAppDispatch } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import Levels from './components/levels';

const WithdrawalPrivilege = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations().serveTranslation;

  const handleClose = () => {
    dispatch(setActiveModal(DATA_MODAL.VIP));
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

export default WithdrawalPrivilege;
