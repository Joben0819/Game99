import Image from 'next/image';
import { images } from '@/utils/resources';
import styles from './index.module.scss';

const TableLoader = () => {
  return (
    <div className={styles.loader}>
      <Image src={images.ios_loader} alt="" fill sizes="100%" />
    </div>
  );
};

export default TableLoader;
