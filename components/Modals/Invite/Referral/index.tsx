'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { DATE_PICKER_FORMAT, DATE_PICKER_LOCALE } from '@/constants/app';
import { DEFAULT } from '@/constants/enums';
import { getReferralReport } from '@/services/api';
import { TReferralData } from '@/services/response-type';
import { DoubleLeftOutlined, DoubleRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import NoData from '@/components/Customs/NoData';
import { RootState, useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const { RangePicker } = DatePicker;

const Referral = () => {
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations().invite;
  const { userInfo } = useAppSelector((state: RootState) => state.userData);
  const [referralData, setReferralData] = useState<TReferralData[]>([]);
  const [date, setDate] = useState<[string, string]>();

  useEffect(() => {
    getReferralDetailsData();
  }, [userInfo?.id, date]);

  const onChange = (date: any, dateString: [string, string]) => {
    setDate(date as any);
  };

  const getReferralDetailsData = async () => {
    const { data } = await getReferralReport({
      pageNum: 1,
      pageSize: 9999,
      startDate: `${date?.[0] ? dayjs(date?.[0]).format(DEFAULT.DATE_FORMAT) : dayjs().format(DEFAULT.DATE_FORMAT)}`,
      endDate: `${date?.[1] ? dayjs(date?.[1]).format(DEFAULT.DATE_FORMAT) : dayjs().format(DEFAULT.DATE_FORMAT)}`,
    });
    setReferralData(data);
  };

  return (
    <div className={styles.contentInfo}>
      <div className={styles.reimbulsoWrapper}>
        <div className={styles.dateTimeWrapper}>
          <RangePicker
            className={styles.rangePicker}
            data-lang={locale}
            inputReadOnly
            defaultValue={[dayjs(dayjs().subtract(1, 'week'), DATE_PICKER_FORMAT), dayjs(dayjs(), DATE_PICKER_FORMAT)]}
            format={DATE_PICKER_FORMAT}
            allowClear={false}
            onChange={onChange}
            locale={DATE_PICKER_LOCALE[locale]}
            getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
            nextIcon={<RightOutlined />}
            superNextIcon={<DoubleRightOutlined />}
            prevIcon={<LeftOutlined />}
            superPrevIcon={<DoubleLeftOutlined />}
            placeholder={[t.startDate, t.endDate]}
            suffixIcon={
              <div className={styles.suffixIcon}>
                <Image
                  className={styles.rangePickerLogo}
                  src={images.calendar}
                  alt='calendar'
                  width={1000}
                  height={1000}
                  data-lang={locale}
                />
              </div>
            }
          />
          <span className={styles.rangePickerSeparator}>-</span>
        </div>
        <div className={styles.extraTable}>
          <div className={styles.headers}>
            <span>{t.bonus}</span>
            <span>{t.time}</span>
          </div>
          <PullToRefresh onRefresh={getReferralDetailsData}>
            <div className={styles.body}>
              {referralData?.length > 0 ? (
                referralData?.map((q, i) => (
                  <div
                    className={styles.dataContainer}
                    key={`${q?.inviterId} ${i}`}
                  >
                    <span>{q.bonus}</span>
                    <span>{dayjs(q?.time).format('MM-DD-YYYY HH:mm:ss')}</span>
                  </div>
                ))
              ) : (
                <div className={styles.noDataWrapper}>
                  <NoData />
                </div>
              )}
            </div>
          </PullToRefresh>
        </div>
      </div>
    </div>
  );
};

export default Referral;
