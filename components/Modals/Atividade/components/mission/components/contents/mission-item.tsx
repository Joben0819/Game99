import Image from 'next/image';
import { FC } from 'react';
import { ACTIVITY_TYPE, COLLECT_TYPE, DATA_MODAL } from '@/constants/enums';
import { TRepeatMissionItem } from '@/services/response-type';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import { moneyFormat } from '@/utils/helpers';
import { staticImport } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { ContentProps } from './contents';
import styles from './styles.module.scss';

type MissionItemProps = TRepeatMissionItem & Pick<ContentProps, 'onCollect' | 'isCollecting'>;

const Icon: FC<Pick<TRepeatMissionItem, 'icon' | 'rewardActivity'>> = ({ icon, rewardActivity }) => {
  return (
    <div>
      <Image
        src={icon ?? staticImport.game_item_placeholder}
        alt=''
        width={2000}
        height={2000}
      />
      <span>{rewardActivity}</span>
    </div>
  );
};
Icon.displayName = 'MissionContentIcon';

const ProgressBar: FC<Pick<TRepeatMissionItem, 'description' | 'progressCounter' | 'completionCount'>> = ({
  description,
  progressCounter,
  completionCount,
}) => {
  const progress = (progressCounter / completionCount) * 100;
  let progressColor: string = progress >= 0 && progress <= 99 ? '#B01515' : progress >= 100 ? '#2DA632' : '#B01515';

  return (
    <div>
      <div className={styles.progressStatus}>
        <span>{description}</span>
        <span>
          <span style={{ color: progressColor }}>{moneyFormat(progressCounter)}</span>/
          {`${moneyFormat(completionCount)}`}
        </span>
      </div>
      <div className={styles.progressBarContent}>
        <div
          className={styles.indicator}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

ProgressBar.displayName = 'MissionContentProgress';

const Button: FC<Pick<MissionItemProps, 'status' | 'isCollecting'> & { onClick: () => void }> = ({
  status,
  isCollecting,
  onClick,
}) => {
  const t = useTranslations().activity;

  const throttledClick = debounce(onClick, 500);

  const MISSION_STATUS = {
    CLAIMED: t.claimed,
    FINISHED: t.receive,
    NOT_CLAIMABLE: t.notClaimable,
    ON_GOING: t.go,
  };

  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      onClick={throttledClick}
      className={classNames(styles.contentBnt, { 'pointer-events-none': isCollecting })}
      data-status={status}
    >
      <span className={classNames({ [styles.ongoing]: status === 'ON_GOING' })}>
        {MISSION_STATUS[status as keyof typeof MISSION_STATUS]}
      </span>
    </motion.div>
  );
};
Button.displayName = 'MissionContentButton';

const MissionItem: FC<MissionItemProps> = ({
  id,
  icon,
  rewardActivity,
  description,
  progressCounter,
  completionCount,
  status,
  isCollecting,
  onCollect,
}) => {
  return (
    <li>
      <Icon
        icon={icon}
        rewardActivity={rewardActivity}
      />
      <ProgressBar
        description={description}
        progressCounter={progressCounter}
        completionCount={completionCount}
      />
      <Button
        status={status}
        isCollecting={isCollecting}
        onClick={() => {
          onCollect(id, status, rewardActivity, COLLECT_TYPE.CONTENT);
          localStorage.setItem('recent-modal', DATA_MODAL.ACTIVITIES);
          localStorage.setItem('activityType', ACTIVITY_TYPE.MISSION);
        }}
      />
    </li>
  );
};

export default MissionItem;
