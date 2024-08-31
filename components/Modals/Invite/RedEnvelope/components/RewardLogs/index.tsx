import { useSearchParams } from 'next/navigation';
import { LogItem } from '@/constants/types';
import classNames from 'classnames';
import NoData from '@/components/Customs/NoData';
import { useAppSelector } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import styles from './index.module.scss';

const RewardLogs = ({ data, webView }: { data: Array<LogItem>; webView: boolean | undefined }) => {
  const params = useSearchParams();
  const { userInfo } = useAppSelector((state) => state.userData);
  const isSmallWebView = window.innerWidth < 450 && webView;
  const isWindow = params.get('isWindow');

  return (
    <>
      {data?.length ? (
        data.map((item, idx) => (
          <div
            key={`${item.memberId}-${idx}`}
            className={classNames(styles.tableItem, {
              [styles.isSmallWebView]: isSmallWebView && !isWindow,
            })}
          >
            <div className={styles.tableItemInfo}>
              <div
                className='w-4 h-4 rounded-full'
                style={{
                  backgroundImage: `url('${userInfo.headImg || images.default_icon}')`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
              />
              <div className={styles.tableItemProfileText}>
                <strong>{item.memberId}</strong>
                <span>{moneyFormat(+item.amount)}</span>
              </div>
            </div>
            <div className={styles.tableItemText}>{item.logTime}</div>
          </div>
        ))
      ) : (
        <div className={styles.noDataContainer}>
          <NoData />
        </div>
      )}
    </>
  );
};

export default RewardLogs;
