import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { withdrawRechargeDetail } from '@/services/api';
import { TWithdrawRecord } from '@/services/response-type';
import classNames from 'classnames';
import Loader from '@/components/Customs/Loader';
import NoData from '@/components/Customs/NoData';
import DateDropdown from '@/components/Pages/PersonalCenter/components/DateDropdown';
import { useAppDispatch, useAppSelector } from '@/store';
import { dateFormatter, getStatusTextColor, moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const WithdrawRecordV2 = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [withdrawRecordData, setWithdrawRecordData] = useState<TWithdrawRecord[]>([]);
  const [withdrawRecordDataFixed, setWithdrawRecordDataFixed] = useState<TWithdrawRecord[]>([]);
  const [dateFilter, setDateFilter] = useState(t.personalCenter.today);
  const [statusFilter, setStatusFilter] = useState(t.withdraw.allStatus);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dateItems = useMemo(
    () => [
      { label: t.personalCenter.today, filter: 'today', key: 0 },
      { label: t.personalCenter.yesterday, filter: 'yesterday', key: 1 },
      { label: t.personalCenter.oneMonth, filter: 'month', key: 2 },
    ],
    [locale],
  );

  const statusItems = useMemo(
    () => [
      { label: t.withdraw.allStatus, filter: 'all', key: 0 },
      { label: t.withdraw.processingStatus, filter: '0', key: 1 },
      { label: t.withdraw.successStatus, filter: '1', key: 2 },
      { label: t.withdraw.failedStatus, filter: '2', key: 3 },
    ],
    [locale],
  );

  useEffect(() => {
    const today = new Date();
    const tempRecords = [...withdrawRecordDataFixed];

    const isStatusAll = () => {
      return statusFilter === 'all';
    };

    if (dateFilter === 'today') {
      if (!isStatusAll()) {
        setWithdrawRecordData(
          tempRecords.filter(
            (item) => item.requestTime.startsWith(dateFormatter(new Date())) && item.status === +statusFilter,
          ),
        );
      } else {
        setWithdrawRecordData(tempRecords.filter((item) => item.requestTime.startsWith(dateFormatter(new Date()))));
      }
    }

    if (dateFilter === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (!isStatusAll()) {
        setWithdrawRecordData(
          tempRecords.filter(
            (item) => item.requestTime.startsWith(dateFormatter(yesterday)) && item.status === +statusFilter,
          ),
        );
      } else {
        setWithdrawRecordData(tempRecords.filter((item) => item.requestTime.startsWith(dateFormatter(yesterday))));
      }
    }

    if (dateFilter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 2);

      setWithdrawRecordData(
        tempRecords.filter((item) => {
          const requestDate = new Date(item.requestTime);
          if (!isStatusAll()) {
            return requestDate >= oneMonthAgo && requestDate <= today && item.status === +statusFilter;
          } else {
            return requestDate >= oneMonthAgo && requestDate <= today;
          }
        }),
      );
    }
  }, [dateFilter, statusFilter, withdrawRecordDataFixed]);

  useEffect(() => {
    getWithdrawDetails();
    setFilterDate('today');
    setStatusFilter('all');
  }, []);

  const setFilterDate = (filter: string) => {
    setDateFilter(filter);
  };

  const setFilterStatus = (filter: string) => {
    setStatusFilter(filter);
  };

  const getWithdrawDetails = async () => {
    const res = await withdrawRechargeDetail({ type: 'withdraw', pageNum: 1, pageSize: 100 });
    if (res?.data.code === 200) {
      setWithdrawRecordData(
        res.data.data.filter((item: TWithdrawRecord) => item.requestTime.startsWith(dateFormatter(new Date()))),
      );
      setWithdrawRecordDataFixed(res.data.data);
    }
    setIsLoading(false);
  };

  const TableBody = ({ withdrawData }: { withdrawData: TWithdrawRecord[] }) => (
    <tbody>
      {withdrawData?.map((item, index) => (
        <tr key={index}>
          <td>{item.orderNo}</td>
          <td>{item.money ? `${moneyFormat(item.money)}` : '0'}</td>
          <td>{item.fee}</td>
          <td style={{ color: getStatusTextColor(item.status) }}>{item.remark}</td>
          <td>{item.requestTime}</td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className={styles.recordWrapper}>
      <div className={styles.container}>
        <Image
          src={images.records_bg}
          alt=''
          sizes='100%'
          fill
        />

        <div className={styles.contents}>
          <div className={styles.header}>
            <h2> {t.withdraw.withdrawRecords}</h2>
            <div className={styles.filters}>
              <div className={styles.transaction}>
                <DateDropdown
                  activeTab={1}
                  label={`${t.recharge.status}:`}
                  items={statusItems}
                  handleSelectFilter={setFilterStatus}
                />
              </div>
              <div className={styles.transaction}>
                <DateDropdown
                  activeTab={1}
                  label={`${t.recharge.transactionDate}:`}
                  items={dateItems}
                  handleSelectFilter={setFilterDate}
                />
              </div>
              <div
                className={classNames(styles.backBtn, 'btn')}
                onClick={() => dispatch(setActiveModal(DATA_MODAL.CLOSE))}
              >
                <Image
                  src={images.back_btn}
                  alt='back-btn'
                  fill
                  sizes='100%'
                />
              </div>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            {isLoading && <Loader />}
            <Image
              src={images.inside_box}
              alt=''
              sizes='100%'
              fill
            />

            <div className={styles.tableOverFlow}>
              <PullToRefresh onRefresh={getWithdrawDetails}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t.registerRecord.transactionNo}</th>
                      <th>{t.registerRecord.money}</th>
                      <th>{t.registerRecord.chargeTax}</th>
                      <th>{t.registerRecord.status}</th>
                      <th>{t.registerRecord.time}</th>
                    </tr>
                  </thead>
                  <TableBody withdrawData={withdrawRecordData} />
                </table>
              </PullToRefresh>
              {!!!withdrawRecordData?.length && (
                <div>
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

export default WithdrawRecordV2;
