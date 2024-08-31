import { FC } from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { TBalanceByPlatformResponseData } from '@/services/response-type';
import { motion } from 'framer-motion';
import NoData from '@/components/Customs/NoData';
import TableLoader from '@/components/Customs/TableLoader';
import { moneyFormat } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type BettingRecordProps = {
  isPulled: boolean;
  balanceList: TBalanceByPlatformResponseData[];
  onWithdraw: (dataId: number) => void;
  accountBalance: (type?: string) => Promise<void>;
};

const GameBalance: FC<BettingRecordProps> = ({ isPulled, balanceList, onWithdraw, accountBalance }) => {
  const t = useTranslations().personalCenter;

  const renderBankListContent = () => {
    if (!!balanceList?.length) {
      return balanceList?.map((data) => {
        return (
          <div
            className={styles.card}
            key={data?.platformId}
          >
            <p>{data?.platformName}</p>
            <div className={styles.setValue}>
              <span>{moneyFormat(data?.money)}</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (data?.money > 0) {
                    onWithdraw(data?.platformId);
                  }
                }}
                disabled={data?.money <= 0}
              >
                {t.transferOut}
              </motion.button>
            </div>
          </div>
        );
      });
    }

    return <NoData />;
  };

  const renderBankList = () => (
    <div className={styles.bankListWrapper}>
      <div className={styles.bankListWrapper__scrollable}>{renderBankListContent()}</div>
    </div>
  );

  const renderContent = () => (
    <>
      {isPulled && (
        <div className='my-1'>
          <TableLoader />
        </div>
      )}
      <PullToRefresh onRefresh={() => accountBalance('pulled')}>{renderBankList()}</PullToRefresh>
    </>
  );

  return renderContent();
};

export default GameBalance;
