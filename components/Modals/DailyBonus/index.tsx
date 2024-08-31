import { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { AnimatePresence } from 'framer-motion';
import CloseButton from '@/components/Customs/CloseButton';
import { images } from '@/utils/resources';
import PopUp from './components/pop-up';
import BonusScreen from './components/screen';
import SideMenu from './components/side-menu';
import { useDailyBonus } from './useDailyBonus';
import styles from './index.module.scss';

const DailyBonus = () => {
  const { activeVip, showPopUp, setShowPopUp, handleClose, handleVipChange } = useDailyBonus();
  const [isBgLoaded, setIsBgLoaded] = useState(false); 

  return (
    <div className={styles.dailyBonusWrapper}>
      <div className={styles.modal}>
        <CloseButton
          onClick={handleClose}
          className={classNames({ [styles.btnDisabled]: !!showPopUp.msg })}
        />
        <Image
          src={images.dailyBonus_bg}
          alt=""
          sizes="100%"
          fill
          priority
          onLoad={() => setIsBgLoaded(true)}
        />
        {isBgLoaded && (
          <div className={styles.container}>
            <SideMenu onChangeVip={handleVipChange} />
            <BonusScreen
              activeVip={activeVip}
              setShowPopup={setShowPopUp}
            />
            <AnimatePresence>
              {showPopUp.msg && (
                <PopUp
                  {...showPopUp}
                  setShowPopup={setShowPopUp}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyBonus;
