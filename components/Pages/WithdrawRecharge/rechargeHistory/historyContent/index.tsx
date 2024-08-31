'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import classNames from 'classnames';
import Loader from '@/components/Customs/Loader';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import OnlineRecharge from './components/onlineRecharge';
import UsdtRecharge from './components/usdtRecharge';
import styles from './index.module.scss';

type HistoryMainContentProps = {
  transactionName: string;
};
const HistoryMainContent: FC<HistoryMainContentProps> = ({ transactionName }) => {
  const router = useRouter();
  const t = useTranslations().recharge;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  return (
    <>
      {isLoading && (
        <div style={{ borderRadius: '1rem' }}>
          <Loader radius='10' />
        </div>
      )}

      <div className={styles.hitoryWrapper}>
        <div
          className={classNames(styles.backBtn, 'btn')}
          onClick={() => router.push('/recharge')}
        >
          <Image
            src={images.go_back}
            alt='back-to-home'
            fill
            sizes='100%'
          />
        </div>
        <div className={styles.header}>
          <h2 data-textafter={transactionName}>{transactionName}</h2>
        </div>

        {transactionName === t.onlineRecharge ? (
          <OnlineRecharge setIsLoading={setIsLoading} />
        ) : (
          <UsdtRecharge setIsLoading={setIsLoading} />
        )}
      </div>
    </>
  );
};

export default HistoryMainContent;
