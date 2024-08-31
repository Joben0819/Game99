import Image from 'next/image';
import { FC, memo, useEffect } from 'react';
import { TJackpotPrize } from '@/services/types';
import classNames from 'classnames';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { POETSEN_ONE } from '@/public/fonts/PoetsenOne';
import { moneyFormat } from '@/utils/helpers';
import styles from './index.module.scss';

type PoolProps = {
  isLoading: boolean;
  list: TJackpotPrize[];
};

const Pool: FC<PoolProps> = ({ isLoading, list }) => {
  useEffect(() => {
    const disablePinchZoom = (e: any) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', disablePinchZoom, { passive: false });
    return () => {
      document.removeEventListener('touchmove', disablePinchZoom);
    };
  }, []);

  return (
    <div className={styles.poolWrapper}>
      {isLoading ? (
        <LoadingIcon />
      ) : (
        <div className={classNames(styles.poolContainer, { [styles['poolContainer--oneColumn']]: list?.length < 4 })}>
          {list?.map((platform, index) => (
            <div key={index}>
              <div className={styles.platformIcon}>
                <div className={styles.icon}>
                  {platform.icon && (
                    <Image
                      src={platform.icon}
                      alt={platform.platformName}
                      fill
                      sizes='100%'
                    />
                  )}
                </div>
              </div>

              <div className={classNames(styles.platformMoney, POETSEN_ONE.className)}>
                <div className={classNames({ '!w-full': list.length > 4 })}>
                  <span>{moneyFormat(platform.money) ?? '0.00'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(Pool);
