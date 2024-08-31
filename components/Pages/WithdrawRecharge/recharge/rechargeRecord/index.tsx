import Image from 'next/image';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { withdrawRechargeDetail } from '@/services/api';
import { TWithdrawRecord } from '@/services/response-type';
import classNames from 'classnames';
import Loader from '@/components/Customs/Loader';
import NoData from '@/components/Customs/NoData';
import TableHead from '@/components/Customs/TableHead';
import TableLoader from '@/components/Customs/TableLoader';
import { useAppDispatch } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const RechargeRecordV2 = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations().recharge;
  const [depositRecordData, setDepositRecordData] = useState<TWithdrawRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPulled, setIsPulled] = useState<boolean>(false);
  const [pageNum, setPageNum] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    getRechargeDetails();
  }, []);

  const getRechargeDetails = async (load?: string) => {
    if (load === 'pulled') {
      setIsPulled(true);
    } else {
      setIsLoading(true);
    }

    withdrawRechargeDetail({ type: 'rechargeOnline', pageNum: 1, pageSize: 20 })
      .then((res) => {
        if (res?.data?.code == 200) {
          setDepositRecordData(res?.data?.data);
          setHasNext(res.data.hasNext);
        }
      })
      .finally(() => {
        setIsPulled(false);
        setIsLoading(false);
      });
    setPageNum(1);
  };

  const headerData = [
    { title: t.columnDate },
    { title: t.columnTransNumber },
    { title: t.columnTransAmount },
    { title: t.columnTransStatus },
  ];

  const TableBody = ({ withdrawData }: { withdrawData: TWithdrawRecord[] }) => (
    <tbody>
      {withdrawData?.map((item, index) => (
        <tr key={index}>
          <td>{item.requestTime}</td>
          <td>{item.orderNo}</td>
          <td>{item.money ? `${moneyFormat(item.money)}` : '0'}</td>
          <td style={{ color: item.color ?? '#fff' }}>
            <span>{item.remark}</span>
          </td>
        </tr>
      ))}
    </tbody>
  );

  const loadMoreRecharge = async () => {
    const res = await withdrawRechargeDetail({
      type: 'rechargeOnline',
      pageNum: pageNum + 1,
      pageSize: 20,
    });

    if (!res?.data) {
      return;
    }

    const newData = res.data.data;
    const next = res.data.hasNext;
    setPageNum((prevPage) => prevPage + 1);
    setHasNext(next);
    setDepositRecordData((prevAccountData) => [...prevAccountData, ...newData]);
    setIsLoading(false);
  };

  return (
    <div className={styles.recordWrapper}>
      <div className={styles.container}>
        {/* <Image src={RECORDS_BG} alt="" sizes="100%" fill /> */}

        <div className={styles.contents}>
          <div
            className={classNames(styles.backBtn, 'btn')}
            onClick={() => dispatch(setActiveModal(DATA_MODAL.CLOSE))}
          >
            <Image
              src={images.go_back}
              alt='back-btn'
              fill
              sizes='100%'
            />
          </div>
          <div className={styles.header}>
            <h2 data-textafter={t.onlineRecharge}>{t.onlineRecharge}</h2>
            <div className={styles.filters}></div>
          </div>

          <div className={styles.tableWrapper}>
            {isLoading && <Loader />}
            <TableHead
              tableHeadData={headerData}
              className={styles.table}
            />
            {isPulled && (
              <div className='my-[0.1rem]'>
                <TableLoader />
              </div>
            )}

            <div
              id='scrollableDiv'
              className={styles.tableOverFlow}
            >
              <InfiniteScroll
                dataLength={depositRecordData?.length}
                next={loadMoreRecharge}
                hasMore={hasNext}
                loader={<div className={styles.loadingFetch}>...</div>}
                scrollableTarget='scrollableDiv'
                refreshFunction={() => getRechargeDetails('pulled')}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                pullDownToRefreshContent={<h3 style={{ textAlign: 'center', opacity: 0 }}>&#8595;</h3>}
                releaseToRefreshContent={<h3 style={{ textAlign: 'center', opacity: 0 }}>&#8593;</h3>}
              >
                <table className={styles.table}>
                  <TableBody withdrawData={depositRecordData} />
                </table>
              </InfiniteScroll>
              {!!!depositRecordData?.length && (
                <div className={styles.noDataWrapper}>
                  <NoData />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargeRecordV2;
