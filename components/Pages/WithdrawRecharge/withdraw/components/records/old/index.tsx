import { FC, useEffect, useRef, useState } from 'react';
import { withdrawRechargeDetail } from '@/services/api';
import { TWithdrawRecord } from '@/services/response-type';
import classNames from 'classnames';
import { debounce } from 'lodash-es';
import Loader from '@/components/Customs/Loader';
import NoData from '@/components/Customs/NoData';
import TableLoader from '@/components/Customs/TableLoader';
import DateDropdown from '@/components/Pages/PersonalCenter/components/DateDropdown';
import { useAppSelector } from '@/store';
import { getStatusTextColor, moneyFormat } from '@/utils/helpers';
import { useDisableZoom } from '@/hooks/useDisabledZoom';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { images } from '@/utils/resources';
import PullToRefresh from 'react-simple-pull-to-refresh';

type TableBodyProps = { withdrawData: TWithdrawRecord[] };

const TableBody: FC<TableBodyProps> = ({ withdrawData }) => {
  const { language } = useAppSelector((state) => state.appData);

  return withdrawData?.map((item, i) => (
    <div
      className={styles.dataContainer}
      style={i % 2 !== 0 ? { background: '#EDF7FF' } : {}}
      key={`${i}${item.orderNo}`}
    >
      <div data-lang={language}>{item.orderNo}</div>
      <div data-lang={language}>{item.money ? `${moneyFormat(item.money)} IDR` : '0'}</div>
      <div data-lang={language}>{item.fee}</div>
      <div
        data-lang={language}
        style={{ color: getStatusTextColor(item.status, false) }}
      >
        {item.remark}
      </div>
      <div data-lang={language}>{item.requestTime}</div>
    </div>
  ));
};

const Records = () => {
  useDisableZoom();
  const t = useTranslations();
  const { language } = useAppSelector((state) => state.appData);
  const [withdrawRecordData, setWithdrawRecordData] = useState<TWithdrawRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPulled, setIsPulled] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState('');
  const headers = [
    t.registerRecord.transactionNo,
    t.registerRecord.money,
    t.registerRecord.chargeTax,
    t.registerRecord.status,
    t.registerRecord.time,
  ];
  const headerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState({
    left: false,
    right: true,
  });

  const dateItems = [
    { label: t.personalCenter.today, filter: 'today', key: 0 },
    { label: t.personalCenter.yesterday, filter: 'yesterday', key: 1 },
    { label: t.personalCenter.oneMonth, filter: 'month', key: 2 },
  ];

  const getWithdrawDetails = async (type: string) => {
    if (!dateFilter) {
      return;
    }
    setWithdrawRecordData([]);
    if (type === 'pulled') {
      setIsPulled(true);
    } else {
      setIsLoading(true);
    }
    const res = await withdrawRechargeDetail({
      type: 'withdraw',
      pageNum: 1,
      pageSize: 100,
      enumReqTime: dateFilter.toLowerCase(),
    });
    if (res?.data.code === 200) {
      setWithdrawRecordData(res.data.data);
    }
    setIsLoading(false);
    setIsPulled(false);
    setIsVisible({
      left: false,
      right: true,
    });
  };

  useEffect(() => {
    getWithdrawDetails('initial');
    document.documentElement.style.setProperty('--webkit-scrollbar-display', 'block');
    return () => {
      document.documentElement.style.setProperty('--webkit-scrollbar-display', 'none');
    };
  }, [dateFilter]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!tableRef.current) return;
    const maxScroll = tableRef.current.scrollWidth - tableRef.current.clientWidth;
    const scrollValue = direction === 'left' ? -maxScroll : maxScroll;
    tableRef.current.scrollLeft += scrollValue;
  };

  useEffect(() => {
    const selected = localStorage.getItem(`profile-date-filter-1`);
    if (!selected) {
      setDateFilter('today');
    }

    const onScroll = () => {
      if (!tableRef.current) return;
      const maxScroll = tableRef.current.scrollWidth - tableRef.current.clientWidth;
      setIsVisible({
        left: tableRef.current?.scrollLeft !== 0,
        right: tableRef.current?.scrollLeft < maxScroll - 1,
      });
    };
    const debouncedFunction = debounce(onScroll, 100);
    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('scroll', debouncedFunction);
    }
    return () => {
      if (tableElement) {
        tableElement.removeEventListener('scroll', debouncedFunction);
      }
    };
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div
        className={styles.transactions}
        data-lang={language}
      >
        <DateDropdown
          activeTab={1}
          label={`${t.personalCenter.transactionTime}:`}
          items={dateItems}
          handleSelectFilter={(item) => setDateFilter(item)}
        />
      </div>
      <div className={classNames(styles.tableContainer, { [styles.tableNoData]: withdrawRecordData.length <= 0 })}>
        {!!!withdrawRecordData?.length && <NoData />}
        {isPulled && (
          <div className={styles.loaderContainer}>
            <TableLoader />
          </div>
        )}

        <div
          className={classNames(styles.tableWrapper, 'tableWrapper')}
          ref={tableRef}
        >
          <div
            ref={headerRef}
            className={styles.headerContiner}
            data-lang={language}
          >
            {headers?.map((q, idx) => (
              <div
                key={idx}
                data-lang={language}
              >
                <p data-textafter={q}>{q}</p>
              </div>
            ))}
          </div>
          <PullToRefresh
            className='withdrawPtr'
            onRefresh={() => getWithdrawDetails('pulled')}
          >
            <div
              className={styles.dataWrapper}
              data-lang={language}
            >
              <TableBody withdrawData={withdrawRecordData} />
            </div>
          </PullToRefresh>
        </div>

        <AnimatePresence>
          {isVisible.left && (
            <motion.div
              initial={{ x: -5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className={classNames(styles.arrowContainer, styles.iceArrowLeft)}
            >
              <Image
                src={images.ice_arrow}
                alt='Scroll to left'
                onClick={() => handleScroll('left')}
                width={20}
                height={20}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isVisible.right && withdrawRecordData.length > 0 && (
            <motion.div
              initial={{ x: 5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className={classNames(styles.arrowContainer, styles.iceArrowRight)}
            >
              <Image
                src={images.ice_arrow}
                alt='Scroll to right'
                onClick={() => handleScroll('right')}
                width={20}
                height={20}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Records;
