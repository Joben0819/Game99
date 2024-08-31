import { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { TFundDetailsResponseData } from '@/services/response-type';
import NoData from '@/components/Customs/NoData';
import TableHead from '@/components/Customs/TableHead';
import TableLoader from '@/components/Customs/TableLoader';
import { moneyFormat } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type AccountDetailsProps = {
  isPulled: boolean;
  accountDetailsHasNext: boolean;
  transactionData: TFundDetailsResponseData[];
  loadMoreAccountDetails: () => Promise<void>;
  accountDetails: (type?: string) => Promise<void>;
};

const AccountDetails: FC<AccountDetailsProps> = ({
  isPulled,
  accountDetailsHasNext,
  transactionData,
  loadMoreAccountDetails,
  accountDetails,
}) => {
  const t = useTranslations().personalCenter;

  const headerData = [
    { title: t.date },
    { title: t.transactionType },
    { title: t.expenditure },
    { title: t.income },
    { title: t.balance },
  ];

  const renderTableBodyContent = () => {
    if (!!transactionData?.length) {
      return (
        <InfiniteScroll
          dataLength={transactionData?.length}
          next={loadMoreAccountDetails}
          hasMore={accountDetailsHasNext}
          loader={
            <div className={styles.dataSizeIndicator}>
              {/* {!transactionData || !transactionData?.length ? '' : 'Loading...'} */}
            </div>
          }
          scrollableTarget='scrollableTable'
        >
          <table className={styles.table}>
            <tbody>
              {transactionData?.map((item, index) => {
                const splittedDate = item.createTime?.split(' ');
                return (
                  <tr key={index}>
                    <td>
                      {item.createTime ? (
                        <div className={'flex flex-col'}>
                          <span>{splittedDate[0]}</span>
                          <span>{splittedDate[1]}</span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{item.des ?? '-'}</td>
                    <td>{item.pay ? `${moneyFormat(+item.pay)}` : '0'}</td>
                    <td style={{ color: `${item.des === 'Withdrawal' ? '#FF0000' : '#00AD27'}` }}>
                      {item.income ? `${moneyFormat(+item.income)} ` : '0'}
                    </td>
                    <td>{item.total ? `${moneyFormat(+item.total)}` : '0'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </InfiniteScroll>
      );
    }
    return <div className='h-full absolute w-full z-30 bg-transparent' />;
  };

  const renderTableBody = () => (
    <div
      className={styles.tableBodyContainer}
      id={'scrollableTable'}
    >
      {renderTableBodyContent()}
    </div>
  );

  const renderContent = () => (
    <>
      <div className={styles.tableWrapper}>
        <TableHead
          tableHeadData={headerData}
          className={styles.table}
          dataModuleTab={'fund-details'}
        />
      </div>
      {isPulled && (
        <div className='my-[10px]'>
          <TableLoader />
        </div>
      )}

      <PullToRefresh
        onRefresh={() => accountDetails('pulled')}
        className={styles.ptr_class}
      >
        {renderTableBody()}
      </PullToRefresh>

      {!!!transactionData.length && (
        <div className={styles.noDataContainer}>
          <NoData />
        </div>
      )}
    </>
  );

  return renderContent();
};

export default AccountDetails;
