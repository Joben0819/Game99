import Image from 'next/image';
import { FC, memo } from 'react';
import classNames from 'classnames';
import { TVipGiftInfoItem } from '@/services/response-type';
import { images } from '@/utils/resources';
import { useVipLevel } from './useVipLevel';
import styles from './styles.module.scss';

type VipLevelsProps = {
  onChangeVip: (vip: number) => void;
};

type LevelProps = {
  active: number;
  onClick: (level: number) => void;
} & TVipGiftInfoItem;

export type ScrollArrowProps = {
  type: 'top' | 'bottom';
  isVisible: boolean;
  onClick: () => void;
};

const ScrollArrow: FC<ScrollArrowProps> = ({ type, isVisible, onClick }) => {
  return (
    <div
      data-type={type}
      className={classNames(styles.arrowContainer, { [styles.isVisible]: isVisible })}
      onClick={onClick}
    >
      <Image src={images.db_arrow} alt="arrow" fill sizes="100%" />
    </div>
  );
};

const Level: FC<LevelProps> = memo(({ active, level, onClick }) => {
  return (
    <div className={styles.vipLvlWrapper} onClick={() => onClick(level)}>
      <div
        id={`vipLvl-${level}`}
        className={classNames(`${styles.lvlBtn}`, {
          [styles.active]: active === level,
        })}
      >
        <span className={classNames({ [styles.currentLvl]: active === level })}>VIP {level}</span>
        <div className={styles.vipIcon}>
          <Image src={images[`vip_${level}`]} alt={`${level}`} fill sizes="15vw" />
        </div>
      </div>
    </div>
  );
});

Level.displayName = 'LevelVip';

const VipLevels: FC<VipLevelsProps> = ({ onChangeVip }) => {
  const { vipInfo, activeLvl, arrowVisible, vipRef, handleChangeVip, handleClickArrow } = useVipLevel({
    onChangeVip,
  });

  return (
    <div className={styles.vipWrapper}>
      <ScrollArrow type="top" isVisible={!arrowVisible!?.arrowUp} onClick={() => handleClickArrow('top')} />
      <div ref={vipRef} className={styles.vipList}>
        {vipInfo?.vipSetList.map((vip) => (
          <Level key={vip.level} active={activeLvl} {...vip} onClick={handleChangeVip} />
        ))}
      </div>
      <ScrollArrow type="bottom" isVisible={!arrowVisible!?.arrowDown} onClick={() => handleClickArrow('bottom')} />
    </div>
  );
};

export default VipLevels;
