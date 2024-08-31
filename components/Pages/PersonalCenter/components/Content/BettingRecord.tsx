import { FC } from 'react';
import { isMobile } from 'react-device-detect';
import InfiniteScroll from 'react-infinite-scroll-component';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { TFundDetailsResponseData } from '@/services/response-type';
import { TGameDataList } from '@/services/types';
import classNames from 'classnames';
import NoData from '@/components/Customs/NoData';
import TableHead from '@/components/Customs/TableHead';
import TableLoader from '@/components/Customs/TableLoader';
import { isHuaweiBrowser, moneyFormat } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type BettingRecordProps = {
  isPulled: boolean;
  betData: TGameDataList[];
  accountDetailsHasNext: boolean;
  transactionData: TFundDetailsResponseData[];
  swiperList: () => JSX.Element;
  overFlowList: () => JSX.Element;
  loadMoreBetDetails: () => Promise<void>;
  bettingRecord: (type?: string) => Promise<void>;
};

const BettingRecord: FC<BettingRecordProps> = ({
  isPulled,
  betData,
  accountDetailsHasNext,
  transactionData,
  swiperList,
  overFlowList,
  bettingRecord,
  loadMoreBetDetails,
}) => {
  const t = useTranslations().personalCenter;
  const iosVersion = /(iPhone|iPad) OS ([1-9]*)/g.exec(window.navigator.userAgent)?.[2] || 0;

  const headerData = [
    { title: t.date },
    { title: t.orderNumber },
    { title: t.bettingAmount },
    { title: t.profitAmount },
  ];

  const renderHeaderTab = () => (
    <div
      className={classNames({
        [styles.gameCategoryListWrapper]:
          (isMobile && isHuaweiBrowser() && screen?.orientation?.type.includes('landscape')) ||
          (isMobile && !isHuaweiBrowser() && +iosVersion > 15) ||
          (isMobile && !isHuaweiBrowser() && +iosVersion < 16),
        [styles.gameCategorySwiperWrapper]:
          !isMobile || (isMobile && isHuaweiBrowser() && screen?.orientation?.type.includes('portrait')),
      })}
    >
      {!isMobile && swiperList()}
      {isMobile && isHuaweiBrowser() && (
        <>
          {screen?.orientation?.type.includes('landscape') && overFlowList()}
          {screen?.orientation?.type.includes('portrait') && swiperList()}
        </>
      )}
      {isMobile && !isHuaweiBrowser() && +iosVersion > 15 && (
        <>
          {screen?.orientation?.type.includes('landscape') && overFlowList()}
          {screen?.orientation?.type.includes('portrait') && overFlowList()}
        </>
      )}
      {isMobile && !isHuaweiBrowser() && +iosVersion < 16 && <>{overFlowList()}</>}
    </div>
  );

  const renderTableHeader = () => (
    <div className={classNames(styles.tableWrapper, styles.bettingTableHeader)}>
      <TableHead
        tableHeadData={headerData}
        className={styles.table}
      />
    </div>
  );

  const renderTableBodyContent = () => {
    if (!!!betData?.length) return <div className='h-full absolute w-full z-30 bg-transparent' />;

    return (
      <InfiniteScroll
        dataLength={transactionData?.length}
        next={loadMoreBetDetails}
        hasMore={accountDetailsHasNext}
        loader={<div className={styles.dataSizeIndicator} />}
        scrollableTarget='scrollableTable111'
      >
        <table className={classNames(styles.table, styles.bettingTable)}>
          <tbody>
            {betData?.map((item, index) => (
              <tr key={index}>
                <td>{item.createTime ?? '-'}</td>
                <td>{item.gameId ?? '-'}</td>
                <td>{item.allBet ? `${moneyFormat(+item.allBet)}` : '0'}</td>
                <td style={{ color: item.profit < 1 ? '#FF0000' : '#00AD27' }}>
                  {item.profit ? `${moneyFormat(+item.profit)}` : '0'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    );
  };

  const renderTableBody = () => <div className={styles.tableBodyContainer}>{renderTableBodyContent()}</div>;

  const renderContent = () => (
    <>
      {renderHeaderTab()}
      {renderTableHeader()}
      {isPulled && (
        <div className='relative'>
          <TableLoader />
        </div>
      )}
      <PullToRefresh
        onRefresh={() => bettingRecord('pulled')}
        className={styles.ptr_class}
      >
        {renderTableBody()}
      </PullToRefresh>

      {!!!betData?.length && !isPulled && (
        <div
          className={styles.noDataContainer}
          data-type='betting-records'
        >
          <NoData />
        </div>
      )}
    </>
  );

  return renderContent();
};

export default BettingRecord;
