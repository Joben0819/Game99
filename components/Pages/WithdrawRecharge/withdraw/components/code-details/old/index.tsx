import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getCodeFlowList } from '@/services/api';
import { TCodeFlow } from '@/services/response-type';
import Loader from '@/components/Customs/Loader';
import NoData from '@/components/Customs/NoData';
import TableHead from '@/components/Customs/TableHead';
import TableLoader from '@/components/Customs/TableLoader';
import { useTranslations } from '@/hooks/useTranslations';
import { getStatusTextColor } from '@/utils/helpers';
import styles from './index.module.scss';

const CodeDetails = () => {
  const t = useTranslations().withdraw;
  const [flowList, setFlowList] = useState<TCodeFlow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPulled, setIsPulled] = useState<boolean>(false);
  const flowHasNext = false;
  const betAmountTHead = [{ title: t.flowTime }, { title: t.demandCode }, { title: t.actual }, { title: t.condition }];

  useEffect(() => {
    getCodeFlow('initial');
  }, []);

  const getCodeFlow = async (type: string) => {
    if (type === 'pulled') {
      setIsPulled(true);
    } else {
      setIsLoading(true);
    }

    const res = await getCodeFlowList();
    if (res?.data?.code === 200) {
      setFlowList(res?.data?.data);
    }
    setIsLoading(false);
    setIsPulled(false);
  };

  return (
    <>
      {isLoading && <Loader />}
      <TableHead
        tableHeadData={betAmountTHead}
        className={styles.table}
      />
      {isPulled && <TableLoader />}
      <div
        id='scrollTable'
        className={styles.tableBodyContainer}
      >
        <InfiniteScroll
          dataLength={flowList?.length}
          next={() => getCodeFlow('pulled')}
          hasMore={flowHasNext}
          loader={<div className={styles.loadingFetch}>...</div>}
          scrollableTarget='scrollTable'
          refreshFunction={() => getCodeFlow('pulled')}
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={<h3 style={{ textAlign: 'center', opacity: 0 }}>_</h3>}
          releaseToRefreshContent={<h3 style={{ textAlign: 'center', opacity: 0 }}>_</h3>}
        >
          <table className={styles.table}>
            <tbody>
              {flowList?.map((item, index) => (
                <tr key={index}>
                  <td>{item?.createTime}</td>
                  <td>{item?.income}</td>
                  <td>{item?.cur}</td>
                  <td style={{ color: getStatusTextColor(item.status, false) }}>
                    {item?.status === 0 ? t.statusUnsuccessful : t.statusSuccessful}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
        {!!!flowList.length && (
          <div className={styles.noDataContainer}>
            <NoData />
          </div>
        )}
      </div>
    </>
  );
};

export default CodeDetails;
