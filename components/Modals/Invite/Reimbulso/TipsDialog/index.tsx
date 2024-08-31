import Image from 'next/image';
import React from 'react';
import classNames from 'classnames';
import { images } from '@/utils/resources';
import styles from './index.module.scss';

type tipsDialogProps = {
  showTip: boolean;
  tipContent: string;
  setShowTip: (isShowTip: boolean) => void;
};
const TipsDialog: React.FC<tipsDialogProps> = ({ showTip, tipContent, setShowTip }) => {
  return (
    <div className={classNames(styles.tipsDialog, { [styles.tipsDialog__show]: showTip })}>
      <div className={classNames(styles.tipsContentWrapper, { [styles.tipsContentWrapper__show]: showTip })}>
        <div className={styles.tipsContent}>
          <div
            className={styles.tipsCloseBtn}
            onClick={() => setShowTip(false)}
          >
            <Image
              src={images.close_btn}
              alt='close button'
              sizes='(max-width: 100vw) 100vw'
              quality={100}
              fill
            />
          </div>

          <div className={styles.contentText}>
            <p>{tipContent}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsDialog;
