import Image from 'next/image';
import { FC } from 'react';
import { images } from '@/utils/resources';
import styles from './RecordHeader.module.scss';

type RecordHeaderProps = {
  title: string;
  coin?: boolean;
  value: string | number | undefined;
};
const RecordHeader: FC<RecordHeaderProps> = ({ title, coin = false, value }) => (
  <div className={styles.recordHeader}>
    <div>
      <Image
        src={coin ? images.record_coins : images.record_person}
        alt="header_refer"
        width={300}
        height={100}
      />
      <span>{title}</span>
    </div>
    <div>
      <span data-textafter={value}>{value ?? '0'}</span>
    </div>
  </div>
);

export default RecordHeader;
