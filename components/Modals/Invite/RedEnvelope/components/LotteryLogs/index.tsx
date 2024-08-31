import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { LogItem } from '@/constants/types';
import classNames from 'classnames';
import { useAppSelector } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const LotteryLogs = ({ data, webView }: { data: Array<LogItem>; webView: boolean | undefined }) => {
  const params = useSearchParams();
  const t = useTranslations().affiliate;
  const { userInfo } = useAppSelector((state) => state.userData);
  const isSmallWebView = window.innerWidth < 450 && webView;
  const isWindow = params.get('isWindow');

  return (
    <>
      {data?.length ? (
        data?.map((item, idx) => (
          <div
            key={`${item?.memberId}-${idx}`}
            className={classNames(styles.tableItem, {
              [styles.isSmallWebView]: isSmallWebView && !isWindow,
            })}
          >
            <div className={styles.tableItemInfo}>
              <div
                className='w-4 h-4 rounded-full'
                style={{
                  backgroundImage: `url('${userInfo?.headImg || images.default_icon}')`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
              />
              <div className={styles.tableItemProfileText}>
                <strong>{item?.memberId}</strong>
                <span>{moneyFormat(+item?.amount)}</span>
              </div>
            </div>
            <div className={styles.tableItemText}>{item?.logTime}</div>
          </div>
        ))
      ) : (
        <div className='flex flex-col items-center justify-center p-2 space-y-1'>
          <Image
            className={styles.noDataImg}
            src={images.no_data_icon}
            width={141}
            height={106}
            quality={100}
            alt='No data'
          />
          <p className={styles.noRecordFound}>{t.noRecordFound}</p>
        </div>
      )}
    </>
  );
};

export default LotteryLogs;
