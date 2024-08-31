import { FC, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TWithdrawRecord } from '@/services/response-type';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { motion } from 'framer-motion';
import NoData from '@/components/Customs/NoData';
import TableLoader from '@/components/Customs/TableLoader';
import { useAppSelector } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type RechargeTableProps = {
  headerList: string[];
  tableData: TWithdrawRecord[];
  isPulled: boolean;
  hasNext: boolean;
  loadMoreData: () => void;
  fetchData: (param: string) => Promise<void>;
};
const RechargeTable: FC<RechargeTableProps> = ({
  headerList,
  tableData,
  isPulled,
  hasNext,
  loadMoreData,
  fetchData,
}) => {
  const locale = useAppSelector((state) => state.appData.language);
  const t = useTranslations().recharge;
  const tableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--webkit-scrollbar-display', 'block');
    return () => {
      document.documentElement.style.setProperty('--webkit-scrollbar-display', 'none');
    };
  }, []);

  const handleCopy = (value: string) => {
    copy(value);
    toast.success(t.copySuccess, { id: 'copy_success' });
  };

  const copyText = (value: string) => {
    var text = document.getElementById('textToCopy') as HTMLInputElement | null;
    if (text) {
      if (/Android/i.test(navigator.userAgent)) {
        text.select();
        document.execCommand('copy');
        toast.success(t.copySuccess, { id: 'copy_success' });
      } else {
        handleCopy(value);
      }
    } else {
      toast.error(t.copyUnsuccessful, { id: 'copy_error' });
    }
  };

  const TableBody = ({ withdrawData }: { withdrawData: TWithdrawRecord[] }) => (
    <tbody>
      {withdrawData?.map((item, index) => (
        <tr
          key={index}
          data-lang={locale}
        >
          <td width='45%'>{item.requestTime}</td>
          <td>
            <div>
              <span>{item.orderNo}</span>
              <input
                className='absolute opacity-0'
                type='text'
                id='textToCopy'
                value={item.orderNo}
                readOnly
              />
              <motion.span
                whileTap={{ scale: 0.9 }}
                className={styles.copyIcon}
                onClick={() => copyText(item.orderNo)}
                style={{ backgroundImage: `url(${images.copy_btn})` }}
              />
            </div>
          </td>
          <td>{item.money ? moneyFormat(item.money) : '0'}</td>
          <td style={{ color: item.color ?? '#fff' }}>
            <span>{item.remark}</span>
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div
      className={classNames(styles.tableWrapper, 'tableWrapper', { [styles.tableNoData]: tableData.length <= 0 })}
      ref={tableRef}
    >
      <div
        ref={headerRef}
        className={styles.headerContainer}
        data-lang={locale}
      >
        {headerList?.map((q, idx) => (
          <div
            key={idx}
            data-lang={locale}
          >
            <p data-textafter={q}>{q}</p>
          </div>
        ))}
      </div>

      {isPulled && <TableLoader />}
      <div
        id='scrollableDiv'
        className={styles.tableOverFlow}
        data-lang={locale}
      >
        <InfiniteScroll
          dataLength={tableData?.length}
          next={loadMoreData}
          hasMore={hasNext}
          loader={<div className={styles.loadingFetch}>...</div>}
          scrollableTarget='scrollableDiv'
          refreshFunction={() => fetchData('pulled')}
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={<h3 style={{ textAlign: 'center', opacity: 0 }}>&#8595;</h3>}
          releaseToRefreshContent={<h3 style={{ textAlign: 'center', opacity: 0 }}>&#8593;</h3>}
        >
          <table
            className={styles.table}
            data-lang={locale}
          >
            <TableBody withdrawData={tableData} />
          </table>
        </InfiniteScroll>
        {!!!tableData?.length && (
          <div className={styles.noDataWrapper}>
            <NoData />
          </div>
        )}
      </div>
    </div>
  );
};

export default RechargeTable;
