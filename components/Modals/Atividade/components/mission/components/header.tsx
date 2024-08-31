import Image from 'next/image';
import { FC, memo } from 'react';
import { COLLECT_STATUS, COLLECT_TYPE } from '@/constants/enums';
import { TEnergyItem } from '@/services/response-type';
import classNames from 'classnames';
import { POETSEN_ONE } from '@/public/fonts/PoetsenOne';
import { useAppSelector } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './styles.module.scss';

type HeaderProps = {
  progressCounter: number;
  missions: TEnergyItem[];
  progressPercentage: number;
  onCollect: (id: string, status: string, amount: number, type: number) => void;
};

type CurrentActivityProps = Pick<HeaderProps, 'progressCounter'>;
type ProgressIndicatorProps = Pick<HeaderProps, 'progressPercentage'>;
type ProgressDataProps = Pick<HeaderProps, 'missions' | 'onCollect'>;
type MissionProps = TEnergyItem & Pick<HeaderProps, 'onCollect'>;

const CurrentActivity: FC<CurrentActivityProps> = ({ progressCounter }) => {
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations().activity;
  return (
    <div className={classNames(styles.gain, POETSEN_ONE.className)}>
      <span>
        <Image
          src={images.act_current_energy}
          alt='thunder-icon'
          width={60}
          height={59}
        />
        {progressCounter}
      </span>
      <span data-lang={locale}>{t.activeToday}</span>
    </div>
  );
};

const ProgressIndicator: FC<ProgressIndicatorProps> = ({ progressPercentage }) => {
  return (
    <div className={styles.progressBar}>
      <div
        className={classNames(styles.indicator, { [styles.noProgress]: progressPercentage <= 0 })}
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

const Mission: FC<MissionProps> = ({ id, status, completionCount, rewards, icon, onCollect }) => {
  return (
    <div className={styles.coinContainer}>
      <div className={styles.energyValue}>
        <span>
          <Image
            src={images.act_current_energy}
            alt='thunder-icon'
            width={60}
            height={59}
          />
          {completionCount}
        </span>
      </div>
      <div className={styles.rewardIcon}>
        <Image
          src={icon ?? ''}
          className={classNames({
            grayscale: status === COLLECT_STATUS.CLAIMED,
            [styles.claimable]: status === COLLECT_STATUS.FINISHED,
          })}
          alt=''
          fill
          sizes='25vw'
          onClick={() =>
            status === COLLECT_STATUS.FINISHED && onCollect(id, status, completionCount, COLLECT_TYPE.HEADER)
          }
        />
        <div className={classNames(styles.coinValue, POETSEN_ONE.className)}>
          <div>
            <span>{moneyFormat(rewards)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
Mission.displayName = 'HeaderMission';

const ProgressData: FC<ProgressDataProps> = memo(({ missions, onCollect }) => {
  return (
    <div className={styles.coins}>
      <div />
      {missions?.map((mission) => (
        <Mission
          key={mission.id}
          {...mission}
          onCollect={onCollect}
        />
      ))}
    </div>
  );
});
ProgressData.displayName = 'ActivityMissionProgress';

const Header: FC<HeaderProps> = ({ missions, progressPercentage, progressCounter, onCollect }) => {
  return (
    <div className={styles.header}>
      <CurrentActivity progressCounter={progressCounter} />
      <div className={styles.progress}>
        <ProgressData
          missions={missions}
          onCollect={onCollect}
        />
        <ProgressIndicator progressPercentage={progressPercentage} />
      </div>
    </div>
  );
};

export default memo(Header);
