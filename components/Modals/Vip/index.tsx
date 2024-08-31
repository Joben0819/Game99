'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal, setSecondModal } from '@/reducers/appData';
import { TVipGiftInfoItem } from '@/services/response-type';
import { Progress } from 'antd';
import classNames from 'classnames';
import CloseButton from '@/components/Customs/CloseButton';
import HeaderTitle from '@/components/Customs/HeaderTitle';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { useAppDispatch, useAppSelector } from '@/store';
import { hasAnnounceJumpType, hasEventJumpType, moneyFormat } from '@/utils/helpers';
import { images, staticImport } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import Content from './components/Content';
import styles from './index.module.scss';

const strokeColor = {
  '0%': 'linear-gradient(180deg, #8AF6FE 0%, #DAFFFD 6%, #53DCFF 48.5%, #2DCDFA 57.5%, #32C5FB 100%)',
  '100%': 'linear-gradient(180deg, #8AF6FE 0%, #DAFFFD 6%, #53DCFF 48.5%, #2DCDFA 57.5%, #32C5FB 100%)',
};

const Vip = () => {
  const t = useTranslations().vip;
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.userData);
  const { vipGiftInfo } = useAppSelector((state) => state.appData);
  const [isLoadedBG, seIsLoadedBG] = useState<boolean>(true);
  const currBcode = vipGiftInfo?.vipSetList?.find((item: TVipGiftInfoItem) => item.level === userInfo?.vip + 1);
  const progressBarPercent = userInfo?.vip < 50 ? (userInfo?.codeTotal / currBcode?.bcode!) * 100 ?? 0 : 100;

  useEffect(() => {
    isSVGALoaded();
  }, []);

  const handleClose = () => {
    localStorage.removeItem('recent-modal');

    if (hasEventJumpType()) {
      dispatch(setActiveModal(DATA_MODAL.ACTIVITIES));
    } else if (hasAnnounceJumpType()) {
      dispatch(setActiveModal(DATA_MODAL.CLOSE));
      dispatch(setSecondModal(DATA_MODAL.OTHER_ANNOUNCEMENT));
      sessionStorage.removeItem('announceJumpType');
    } else {
      dispatch(setActiveModal(DATA_MODAL.CLOSE));
    }
  };

  const isSVGALoaded = () => {
    seIsLoadedBG(true);
  };

  return (
    <div className={styles.vipWrapper}>
      {!isLoadedBG && (
        <div className={'!opacity-100'}>
          <LoadingIcon />
        </div>
      )}
      <div
        className={classNames(styles.vipModal, {
          [styles.isLoaded]: isLoadedBG,
        })}
      >
        <div className='flex justify-between gap-[0.5rem] h-[0.96rem]'>
          <HeaderTitle
            text={t.title}
            size={40}
            className={styles.title}
          />
          <div className={styles.headerContainer}>
            <Image
              className={styles.vipImg}
              src={images[`vip_${userInfo?.vip}`]}
              alt='vip-level'
              sizes='15vw'
              width={438}
              height={458}
              quality={100}
            />
            <div className={styles.progressBar}>
              <div className={styles.progressTitle}>
                <span>{t.betAccumu}</span>
                <span>
                  {moneyFormat(userInfo?.codeTotal).replace(/[.,]/g, '')}
                  {!!currBcode?.bcode && ` / ${moneyFormat(currBcode?.bcode).replace(/[.,]/g, '')}`}
                </span>
              </div>
              <div className={styles.progressLine}>
                <Progress
                  percent={progressBarPercent}
                  status='active'
                  showInfo={false}
                  trailColor='#270d4f'
                  strokeColor={strokeColor}
                />
              </div>
            </div>
            {userInfo?.vip < 50 && (
              <Image
                className={styles.vipImg}
                src={images[`vip_${userInfo?.vip + 1}`]}
                alt='vip-next-level'
                sizes='15vw'
                width={438}
                height={458}
                quality={100}
              />
            )}
            <Image
              className={styles.vipImg}
              src={staticImport.vip_level_guide}
              alt='vip-level-guide'
              sizes='15vw'
              width={438}
              height={458}
              quality={100}
              placeholder='blur'
              onClick={() => {
                dispatch(setActiveModal(DATA_MODAL.NEXT_LEVEL));
              }}
            />
          </div>
        </div>
        <Content />
        <CloseButton onClick={handleClose} />
      </div>
    </div>
  );
};

export default Vip;
