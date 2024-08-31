import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { DATA_MODAL, SCREEN_TYPE, SIDE_MENU } from '@/constants/enums';
import { setActiveModal, setPageLoad } from '@/reducers/appData';
import classNames from 'classnames';
import { useAppDispatch } from '@/store';
import { images } from '@/utils/resources';
import styles from './index.module.scss';
import AddBank from './pages/add-bank';
import BankList from './pages/bank-list';

type WalletManagementProps = {
  screenActive: number;
  handleRedirect: (id: number) => void;
};

const WalletManagement: FC<WalletManagementProps> = ({ screenActive, handleRedirect }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [activeScreen, setActiveScreen] = useState<number>(screenActive ?? SCREEN_TYPE.BANK_LIST);

  useEffect(() => {
    dispatch(setActiveModal(DATA_MODAL.CLOSE));

    return () => {
      sessionStorage.removeItem('memberCardId');
      sessionStorage.removeItem('withdrawAmount');
      dispatch(setPageLoad(false));
    };
  }, []);

  const onChangeScreen = (screen: number) => {
    if (activeScreen === screen) {
      dispatch(setPageLoad(true));
      router.push('/');
      return;
    }
    if (sessionStorage.getItem('withdraw-back')) handleRedirect?.(SIDE_MENU.FAST_WITHDRAW);
    else setActiveScreen(screen);
  };

  return (
    <>
      <div
        className={classNames(styles.backBtn, 'btn')}
        onClick={() => onChangeScreen(SCREEN_TYPE.BANK_LIST)}
      >
        <Image
          src={images.exit_modal}
          alt='back-btn'
          fill
          sizes='100%'
        />
      </div>
      <div className='pt-1'>
        {activeScreen === SCREEN_TYPE.BANK_LIST && <BankList onChangeScreen={onChangeScreen} />}
        {activeScreen === SCREEN_TYPE.ADD_BANK && <AddBank onChangeScreen={onChangeScreen} />}
      </div>
    </>
  );
};

export default WalletManagement;
