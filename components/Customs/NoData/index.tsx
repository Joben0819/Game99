import Image from 'next/image';
import classNames from 'classnames';
import { FC, memo } from 'react';
import { NO_DATA_TYPE } from '@/constants/enums';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type NodataProps = {
  type?: NO_DATA_TYPE.LEFT_PANEL | NO_DATA_TYPE.RIGHT_PANEL;
};

const NoData: FC<NodataProps> = ({ type = NO_DATA_TYPE.RIGHT_PANEL }) => {
  const t = useTranslations().withdraw;

  return (
    <div className={styles.noDataWrapper}>
      <div className={classNames(styles.image, {
        [styles.leftStyle]: type === NO_DATA_TYPE.LEFT_PANEL
      })}>
        <Image
          src={images.no_data}
          alt='no-data'
          fill
          sizes='100%'
        />
      </div>
      <span>{t.noData}</span>
    </div>
  );
};

export default memo(NoData);
