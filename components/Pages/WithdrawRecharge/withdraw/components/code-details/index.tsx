import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { getCodeFlowList } from '@/services/api';
import { TCodeFlow } from '@/services/response-type';
import classNames from 'classnames';
import Loader from '@/components/Customs/Loader';
import NoData from '@/components/Customs/NoData';
import DateDropdown from '@/components/Pages/PersonalCenter/components/DateDropdown';
import { useAppDispatch, useAppSelector } from '@/store';
import { dateFormatter, getStatusTextColor, moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const BetRecordsV2 = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [flowList, setFlowList] = useState<TCodeFlow[]>([]);
  const [flowListFixed, setFlowListFixed] = useState<TCodeFlow[]>([]);
  const [dateFilter, setDateFilter] = useState(t.personalCenter.today);
  const [statusFilter, setStatusFilter] = useState(t.withdraw.allStatus);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getCodeFlow();
    setFilterDate('today');
    setFilterStatus('all');
  }, []);

  useEffect(() => {
    const today = new Date();
    const tempRecords = [...flowListFixed];

    const isStatusAll = () => {
      return statusFilter === 'all';
    };

    if (dateFilter === 'today') {
      if (!isStatusAll()) {
        setFlowList(
          tempRecords.filter(
            (item) => item.createTime.startsWith(dateFormatter(new Date())) && item.status === +statusFilter,
          ),
        );
      } else {
        setFlowList(tempRecords.filter((item) => item.createTime.startsWith(dateFormatter(new Date()))));
      }
    }

    if (dateFilter === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (!isStatusAll()) {
        setFlowList(
          tempRecords.filter(
            (item) => item.createTime.startsWith(dateFormatter(yesterday)) && item.status === +statusFilter,
          ),
        );
      } else {
        setFlowList(tempRecords.filter((item) => item.createTime.startsWith(dateFormatter(yesterday))));
      }
    }

    if (dateFilter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 2);

      setFlowList(
        tempRecords.filter((item) => {
          const requestDate = new Date(item.createTime);

          if (!isStatusAll()) {
            return requestDate >= oneMonthAgo && requestDate <= today && item.status === +statusFilter;
          } else {
            return requestDate >= oneMonthAgo && requestDate <= today;
          }
        }),
      );
    }
  }, [dateFilter, statusFilter, flowListFixed]);

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
      { label: t.withdraw.statusSuccessful, filter: '1', key: 1 },
      { label: t.withdraw.statusUnsuccessful, filter: '0', key: 2 },
    ],
    [locale],
  );

  const setFilterDate = (filter: string) => {
    setDateFilter(filter);
  };

  const setFilterStatus = (filter: string) => {
    setStatusFilter(filter);
  };

  const getCodeFlow = async () => {
    const res = await getCodeFlowList();
    if (res?.data?.code === 200) {
      setFlowList(res?.data?.data.filter((item: TCodeFlow) => item.createTime.startsWith(dateFormatter(new Date()))));
      setFlowListFixed(res?.data?.data);
    }
    setIsLoading(false);
  };

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
            <h2> {t.withdraw.codeDetails}</h2>
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
              <PullToRefresh onRefresh={getCodeFlow}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t.withdraw.flowTime}</th>
                      <th>{t.withdraw.demandCode}</th>
                      <th>{t.withdraw.actual}</th>
                      <th>{t.withdraw.condition}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flowList?.map((item, index) => (
                      <tr key={index}>
                        <td>{item?.createTime}</td>
                        <td>{moneyFormat(item?.income)}</td>
                        <td>{moneyFormat(item?.cur)}</td>
                        <td style={{ color: getStatusTextColor(item.status) }}>
                          {item?.status === 0 ? t.withdraw.statusUnsuccessful : t.withdraw.statusSuccessful}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </PullToRefresh>
              {!!!flowList?.length && (
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

export default BetRecordsV2;
