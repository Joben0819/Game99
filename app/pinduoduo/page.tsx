import classNames from 'classnames';
import { Metadata } from 'next';
import RedEnvelope from './RedEnvelope';
import styles from './page.module.scss';

export const metadata: Metadata = {
  icons: null,
};

const Pinduoduo = () => {
  return (
    <div className={classNames(styles.pinduoduoContainer, 'size-full relative')}>
      <RedEnvelope />
    </div>
  );
};

export default Pinduoduo;
