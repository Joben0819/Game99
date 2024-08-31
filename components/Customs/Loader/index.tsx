import { FC, memo } from 'react';
import classNames from 'classnames';
import LoadingIcon from '../LoadingIcon';
import styles from './index.module.scss';

type LoaderProps = { radius?: '10' | '14' };

const Loader: FC<LoaderProps> = ({ radius = '14' }) => {
  return (
    <div
      className={classNames(styles.loader, {
        [styles['loader--radius10']]: radius === '10',
      })}
    >
      <LoadingIcon />
    </div>
  );
};

export default memo(Loader);
