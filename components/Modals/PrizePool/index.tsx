import Image from 'next/image';
import { memo, useState } from 'react';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import classNames from 'classnames';
import CSVGA from '@/components/Customs/CSVGA';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { useAppDispatch, useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import Pool from './components/pool';
import styles from './index.module.scss';
import { useGetJackpotPrizeListQuery } from './index.rtk';

const PrizePool = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const t = useTranslations().prizePool;
  const { data: poolList = [], isLoading } = useGetJackpotPrizeListQuery();
  const [isLoadedBG, seIsLoadedBG] = useState<boolean>(false);

  const isSVGAloaded = (isLoaded: boolean) => {
    seIsLoadedBG(isLoaded);
  };

  return (
    <div className={styles.prizePoolWrapper}>
      {!isLoadedBG && (
        <div className={styles.modal}>
          <LoadingIcon />
        </div>
      )}

      <div className={classNames(styles.modal, isLoadedBG ? 'fadeIn' : 'hidden')}>
        <CLoseBtn />
        <div className={classNames(styles.poolContainer, 'fadeIn')}>
          <div
            data-lang={locale}
            className={styles.headerTitle}
          >
            <Image
              src={t.modalTitle}
              alt='header'
              fill
              sizes='100%'
            />
          </div>
          <Image
            src={images.prize_pool_bg}
            fill
            sizes='100%'
            alt='bg-prize'
          />
          <div className={styles.poolList}>
            <Pool
              list={poolList ?? []}
              isLoading={isLoading}
            />
          </div>
          <div className={styles.girlContainer}>
            <CSVGA
              src={images.svga_pp_coins}
              isSVGALoaded={() => isSVGAloaded(true)}
            />
          </div>
          <div className={styles.cassinoImage}>
            <Image
              src={images.casino_img}
              alt='casino-image'
              fill
              sizes='100%'
            />
          </div>
          <div className={styles.fallingStarImage}>
            <Image
              src={images.falling_star}
              alt='fall-image'
              fill
              sizes='100%'
            />
          </div>
          <div className={styles.startsImage}>
            <Image
              src={images.starts_img}
              alt='stars-image'
              fill
              sizes='100%'
            />
          </div>
          <div className={styles.starImage}>
            <Image
              src={images.star_img}
              alt='star-image'
              fill
              sizes='100%'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CLoseBtn = memo(() => {
  const dispatch = useAppDispatch();

  return (
    <div
      className={styles.closeBtn}
      onClick={() => dispatch(setActiveModal(DATA_MODAL.CLOSE))}
    >
      <Image
        src={images.prize_pool_close_btn}
        className='btn'
        alt='close-btn'
        fill
        sizes='100%'
      />
    </div>
  );
});
CLoseBtn.displayName = 'CLoseBtn';

export default PrizePool;
