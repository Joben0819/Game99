import Image from 'next/image';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { DATA_MODAL } from '@/constants/enums';
import { setFourthModal } from '@/reducers/appData';
import { ImgWithFallback } from '@/components/Customs/ImgWithFallback';
import { isIOSChrome, isIOSSafari } from '@/utils/helpers';
import { staticImport } from '@/utils/resources';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const AddToHome = () => {
  const t = useTranslations().addToHome;

  return (
    <div className={styles.withdrawWrapper}>
      <div className={styles.modal}>
        <div className={styles.bubbleContainer}>
          <div
            className={classNames(styles.messageBubble, {
              [styles.messageBubbleIosSafari]: isIOSSafari(),
              [styles.messageBubbleIosChrome]: isIOSChrome(),
            })}
          >
            <div className={styles.photoContainer}>
              <ImgWithFallback
                sizes='(max-width: 100vw) 100vw'
                alt='add to home screen'
                src={`/variant/${process.env.SITE}/icon512_rounded.png` ?? staticImport.game_item_placeholder}
                fill
                quality={100}
                priority
              />
            </div>
            <div className={styles.msgContainer}>
              <p>
                <span> {t.toAddThis}</span>
              </p>
              <p>
                <div className={styles.addToHomeIcon}>
                  <ImgWithFallback
                    sizes='(max-width: 100vw) 100vw'
                    alt='add to home screen'
                    src={images.add_to_home ?? staticImport.game_item_placeholder}
                    fill
                    quality={100}
                    priority
                  />
                </div>
                <span> {t.then} </span>
                <b> {t.addToHome}</b>
              </p>
            </div>
            <div className={styles.invertedTriangle}></div> <CloseBtn />
          </div>
        </div>
      </div>
    </div>
  );
};

const CloseBtn = memo(() => {
  const dispatch = useDispatch();
  const handleCloseBtnModalForWithdraw = () => {
    dispatch(setFourthModal(DATA_MODAL.CLOSE));
  };

  return (
    <div
      className={styles.closeBtn}
      onClick={handleCloseBtnModalForWithdraw}
    >
      <Image
        src={images.x_button}
        width={20}
        height={20}
        alt='sample'
      />
    </div>
  );
});
CloseBtn.displayName = 'CloseBtn';

export default AddToHome;
