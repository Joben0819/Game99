'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DATE_PICKER_FORMAT, DATE_PICKER_LOCALE } from '@/constants/app';
import { DEFAULT } from '@/constants/enums';
import { getReferralData, listIncomeType } from '@/services/api';
import { TListIncomeType, TReferralData } from '@/services/response-type';
import { DoubleLeftOutlined, DoubleRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Loader from '@/components/Customs/Loader';
import NoData from '@/components/Customs/NoData';
import TableHead from '@/components/Customs/TableHead';
import TableLoader from '@/components/Customs/TableLoader';
import { RootState, useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import useOrientation from '@/hooks/useOrientation';
import { useTranslations } from '@/hooks/useTranslations';
import TipsDialog from './TipsDialog';
import styles from './index.module.scss';

const Reimbulso = () => {
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations().invite;
  const { userInfo } = useAppSelector((state: RootState) => state.userData);
  const [referralData, setReferralData] = useState<TReferralData[]>([]);
  const [date, setDate] = useState<dayjs.Dayjs>();
  const [isOpenCal, setIsOpenCal] = useState(false);
  const [tabList, setTabList] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [showTip, setShowTip] = useState(false);
  const [tipContent, setTipContent] = useState('');
  const isPortrait = useOrientation();
  const [hasNext, setHasNext] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [isPulled, setIsPulled] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const headerData = [
    { title: t.invitationID },
    { title: t.tier },
    { title: t.bonus },
    { title: t.time },
    { title: t.bet },
  ];

  useEffect(() => {
    setIsOpenCal(false);
  }, [isPortrait]);

  useEffect(() => {
    const getIncomeTypes = () => {
      setIsLoading(true);
      listIncomeType().then((res) => {
        if (res?.data?.code === 200) {
          setTabList(res?.data?.data);
          setActiveTab(res?.data?.data[0].name);
        }
        setIsLoading(false);
      });
    };

    getIncomeTypes();
  }, []);

  useEffect(() => {
    if (activeTab !== '') {
      getReferralDetailsData();
    }
  }, [userInfo?.id, date, activeTab]);

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    setDate(date);
    setIsOpenCal(false);
  };

  const getReferralDetailsData = async (load?: string) => {
    setPageNum(1);
    setReferralData([]);
    if (load === 'pulled') {
      setIsPulled(true);
    }
    const { data, otherData, hasNext } = await getReferralData({
      incomeSourceType: activeTab,
      pageNum: 1,
      pageSize: 20,
      startDate: `${!!date ? dayjs(date).format(DEFAULT.DATE_FORMAT) : dayjs().format(DEFAULT.DATE_FORMAT)}`,
    });

    setReferralData(data);
    setTipContent(otherData);
    setHasNext(hasNext);
    setIsPulled(false);
  };

  const loadMoreReferralDetails = async () => {
    const { data, hasNext } = await getReferralData({
      incomeSourceType: activeTab,
      pageNum: pageNum + 1,
      pageSize: 20,
      startDate: `${!!date ? dayjs(date).format(DEFAULT.DATE_FORMAT) : dayjs().format(DEFAULT.DATE_FORMAT)}`,
    });
    if (!data) {
      return;
    }
    setPageNum((prevPage) => prevPage + 1);
    setHasNext(hasNext);
    setReferralData((prevAccountData) => [...prevAccountData, ...data]);
  };

  const TableBody = ({ referralData }: { referralData: TReferralData[] }) => (
    <tbody>
      {referralData?.map((item, index) => (
        <tr key={index}>
          <td>{item?.inviterId}</td>
          <td>{item?.level}</td>
          <td>{item?.bonus}</td>
          <td>{item?.time}</td>
          <td>{item?.bet}</td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className={styles.contentInfo}>
      <div className={styles.reimbulsoWrapper}>
        <div className={styles.reimbulsoHeaderWrapper}>
          <ul className={styles.tabWrapper}>
            {tabList.map((tab: TListIncomeType, index) => (
              <li
                key={index}
                onClick={() => setActiveTab(tab.name)}
                className={classNames({ [styles.active]: activeTab === tab.name })}
              >
                {tab.translatedName}
              </li>
            ))}
          </ul>
          <div className={styles.dateTimeWrapper}>
            <DatePicker
              open={isOpenCal}
              defaultValue={dayjs(dayjs(), DATE_PICKER_FORMAT)}
              format={DATE_PICKER_FORMAT}
              onClick={() => setIsOpenCal(!isOpenCal)}
              locale={DATE_PICKER_LOCALE[locale]}
              inputReadOnly
              allowClear={false}
              onChange={onChange}
              getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
              nextIcon={<RightOutlined />}
              superNextIcon={<DoubleRightOutlined />}
              prevIcon={<LeftOutlined />}
              superPrevIcon={<DoubleLeftOutlined />}
              placeholder={t.selectDate}
              suffixIcon={
                <div className={styles.suffixIcon}>
                  <Image
                    className={styles.rangePickerLogo1}
                    src={images.calendar}
                    alt='calendar'
                    width={1000}
                    height={1000}
                    data-lang={locale}
                  />
                </div>
              }
            />
          </div>
        </div>

        <div className={classNames(styles.tableWrapper, { [styles.tableWrapper__noData]: !referralData?.length })}>
          <TableHead
            tableHeadData={headerData}
            className={styles.headers}
            withTipIcon={true}
            setShowTip={setShowTip}
          />

          {isPulled && (
            <div>
              <TableLoader />
            </div>
          )}

          <div
            id='scrollableDiv'
            className={classNames(styles.tableOverFlow, { [styles.tableOverFlow__noData]: !referralData?.length })}
          >
            {isLoading && <Loader />}

            <InfiniteScroll
              dataLength={referralData?.length}
              next={loadMoreReferralDetails}
              hasMore={hasNext}
              loader={<div className={styles.loadingFetch}>...</div>}
              scrollableTarget='scrollableDiv'
              refreshFunction={() => getReferralDetailsData('pulled')}
              pullDownToRefresh
              pullDownToRefreshThreshold={50}
              pullDownToRefreshContent={<h3 style={{ textAlign: 'center', opacity: 0 }}>&#8595;</h3>}
              releaseToRefreshContent={<h3 style={{ textAlign: 'center', opacity: 0 }}>&#8593;</h3>}
            >
              <table className={styles.table}>
                <TableBody referralData={referralData} />
              </table>
            </InfiniteScroll>
            {!!!referralData?.length && (
              <div className={styles.noDataWrapper}>
                <NoData />
              </div>
            )}
          </div>
        </div>
      </div>

      {showTip && (
        <TipsDialog
          setShowTip={setShowTip}
          tipContent={tipContent}
          showTip={showTip}
        />
      )}
    </div>
  );
};

export default Reimbulso;
