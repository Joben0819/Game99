import { useSearchParams } from 'next/navigation';
import { Dispatch, FC, SetStateAction } from 'react';
import { LogItem } from '@/constants/types';
import classNames from 'classnames';
import { useAppSelector } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import InviterGameRules from '../InviterGameRules';
import LotteryLogs from '../LotteryLogs';
import RewardLogs from '../RewardLogs';
import styles from './index.module.scss';

type TableContainerProps = {
  webView: boolean | undefined;
  lotteryLogs: LogItem[];
  rewardLogs: LogItem[];
  inviterGameRuleText: string | undefined;
  methodTab: number;
  setMethodTab: Dispatch<SetStateAction<number>>;
};

type TableContentData = {
  [key: number]: JSX.Element;
};

const TableContainer: FC<TableContainerProps> = ({
  webView,
  lotteryLogs,
  rewardLogs,
  inviterGameRuleText,
  methodTab,
  setMethodTab,
}) => {
  const params = useSearchParams();
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations().affiliate;
  const isSmallWebView = window.innerWidth < 450 && webView;
  const tableHeaderData = [t.lotteryLogs, t.rewardLogs, t.inviterGameRules];
  const isWindow = params.get('isWindow');

  const TableContentData: TableContentData = {
    1: (
      <LotteryLogs
        webView={webView}
        data={lotteryLogs}
      />
    ),
    2: (
      <RewardLogs
        data={rewardLogs}
        webView={webView}
      />
    ),
    3: (
      <InviterGameRules
        inviterGameRuleText={inviterGameRuleText!}
        webView={webView}
      />
    ),
  };

  return (
    <div
      className={styles.tableMain}
      id='rules'
    >
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          {tableHeaderData.map((name, index) => (
            <button
              key={index}
              className={classNames(styles.tableHeaderBtn, {
                [styles.active]: methodTab === index + 1,
                [styles.isSmallWebView]: isSmallWebView && !isWindow,
              })}
              data-lang={locale}
              onClick={() => setMethodTab(index + 1)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className={styles.tableBody}>{TableContentData[methodTab]}</div>
      </div>
    </div>
  );
};

export default TableContainer;
