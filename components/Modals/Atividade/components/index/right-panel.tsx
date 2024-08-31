import Image from 'next/image';
import { FC } from 'react';
import classNames from 'classnames';
import { images } from '@/utils/resources';
import Header from './header';
import styles from './styles.module.scss';

type RightPanelProps = {
  isEvent: boolean;
};

const RightPanel: FC<RightPanelProps> = ({ isEvent }) => {
  return (
    <div
      className={classNames(styles.rightPanel, {
        [styles['rightPanel--isEvent']]: isEvent,
      })}
    >
      <Header isEvent={isEvent} />
      <Image
        src={isEvent ? images.act_right_panel_event : images.act_right_panel_activity}
        alt=""
        fill
        sizes="100%"
        priority
      />
      <div className={classNames(styles.cloud, { [styles['cloud--isEvent']]: isEvent })}>
        <Image src={images.act_cloud_mission} alt="" fill sizes="100%" />
      </div>
      <div
        className={classNames(styles.cloudBottom, {
          [styles['cloudBottom--isEvent']]: isEvent,
        })}
      >
        <Image src={images.act_cloud_bottom} alt="" fill sizes="100%" />
      </div>
    </div>
  );
};

export default RightPanel;
