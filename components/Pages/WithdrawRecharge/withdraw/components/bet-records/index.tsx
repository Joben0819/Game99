import { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getGameCategoryList, getGameDataList } from '@/services/api';
import { TGameCategoryList } from '@/services/response-type';
import { TGameDataList } from '@/services/types';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { FreeMode } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import CustomSwiper from '@/components/Customs/CustomSwiper';
import Loader from '@/components/Customs/Loader';
import NoData from '@/components/Customs/NoData';
import TableHead from '@/components/Customs/TableHead';
import TableLoader from '@/components/Customs/TableLoader';
import DateDropdown from '@/components/Pages/PersonalCenter/components/DateDropdown';
import { useAppSelector } from '@/store';
import { isHuaweiBrowser, moneyFormat } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const BettingRecords = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const t = useTranslations().personalCenter;
  const iosVersion = /(iPhone|iPad) OS ([1-9]*)/g.exec(window.navigator.userAgent)?.[2] || 0;
  const [gameCategoryList, setGameCategoryList] = useState<TGameCategoryList[]>();
  const [accountDetailsHasNext, setAccountDetailsHasNext] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>();
  const [betData, setBetData] = useState<TGameDataList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPulled, setIsPulled] = useState<boolean>(false);
  const [pageNum, setPageNum] = useState(1);
  const [dateFilter, setDateFilter] = useState(t.today);
  const swiperRef = useRef<any>(null);

  const dateItems = [
    { label: t.today, filter: 'today', key: 0 },
    { label: t.yesterday, filter: 'yesterday', key: 1 },
    { label: t.oneMonth, filter: 'month', key: 2 },
  ];

  const betHistoryTHead = [
    { title: t.date },
    { title: t.orderNumber },
    { title: t.bettingAmount },
    { title: t.profitAmount },
  ];

  useEffect(() => {
    setDateFilter('today');
    getGameCategoryList().then((res) => {
      if (res.data?.code === 200) {
        setGameCategoryList(res.data?.data);
        setActiveCategory(res.data?.data[0]?.name);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    bettingRecord('initial');
  }, [activeCategory, dateFilter]);

  const bettingRecord = async (type: string) => {
    if (type === 'pulled') setIsPulled(true);
    else setIsLoading(true);

    setBetData([]); // clearing the state before fetching new data. Fixing the flickering issue.
    if (!activeCategory) {
      return;
    }

    const res = await getGameDataList({
      gameCategory: activeCategory,
      enumReqTime: dateFilter,
      pageNum: 1,
      pageSize: 20,
    });

    if (!res?.data) {
      return;
    }

    const next = res.data.hasNext;
    setAccountDetailsHasNext(next);
    setBetData(res?.data.data);
    setIsLoading(false);
    setIsPulled(false);
    setPageNum(1);
  };

  const loadMoreBetDetails = async () => {
    const res = await getGameDataList({
      gameCategory: activeCategory,
      enumReqTime: dateFilter,
      pageNum: pageNum + 1,
      pageSize: 20,
    });

    if (!res?.data) {
      return;
    }

    const newData = res.data.data;
    const next = res.data.hasNext;
    setPageNum((prevPage) => prevPage + 1);
    setAccountDetailsHasNext(next);
    setBetData((prevAccountData) => [...prevAccountData, ...newData]);
  };

  const overFlowList = () => {
    return (
      <div className={styles.gameCategoryListOverflow}>
        {!!gameCategoryList?.length &&
          gameCategoryList?.map((item, index) => {
            return (
              <motion.span
                key={index}
                whileTap={{ scale: 0.9 }}
                className={classNames({
                  [styles.activeItem]: item?.name === activeCategory,
                })}
                onClick={() => setActiveCategory(item?.name)}
              >
                {item?.des}
              </motion.span>
            );
          })}
      </div>
    );
  };

  const swiperList = () => {
    return (
      <CustomSwiper
        ref={swiperRef}
        modules={[FreeMode]}
        className={styles.tabsSwiper}
        slidesPerView={'auto'}
        freeMode={true}
        loop={false}
      >
        {gameCategoryList?.length &&
          gameCategoryList?.map((item) => {
            return (
              <SwiperSlide
                key={item?.name}
                className={styles.slide}
              >
                <motion.span
                  whileTap={{ scale: 0.9 }}
                  className={classNames(styles.tabItem, {
                    [styles.activeItem]: item?.name === activeCategory,
                  })}
                  onClick={() => setActiveCategory(item?.name)}
                >
                  {item?.des}
                </motion.span>
              </SwiperSlide>
            );
          })}
      </CustomSwiper>
    );
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.mainContentWrapper}>
        <div
          className={styles.transactions}
          data-lang={locale}
        >
          <DateDropdown
            activeTab={0}
            label={`${t.transactionTime}:`}
            items={dateItems}
            handleSelectFilter={(item) => setDateFilter(item)}
          />
        </div>

        <div
          className={classNames({
            [styles.gameCategoryListWrapper]:
              (isMobile && isHuaweiBrowser() && screen?.orientation?.type.includes('landscape')) ||
              (isMobile && !isHuaweiBrowser() && +iosVersion > 15) ||
              (isMobile && !isHuaweiBrowser() && +iosVersion < 16),
            [styles.gameCategorySwiperWrapper]:
              !isMobile || (isMobile && isHuaweiBrowser() && screen?.orientation?.type.includes('portrait')),
          })}
        >
          {!isMobile && swiperList()}
          {isMobile && isHuaweiBrowser() && (
            <>
              {screen?.orientation?.type.includes('landscape') && overFlowList()}
              {screen?.orientation?.type.includes('portrait') && swiperList()}
            </>
          )}
          {isMobile && !isHuaweiBrowser() && +iosVersion > 15 && (
            <>
              {screen?.orientation?.type.includes('landscape') && overFlowList()}
              {screen?.orientation?.type.includes('portrait') && overFlowList()}
            </>
          )}
          {isMobile && !isHuaweiBrowser() && +iosVersion < 16 && <>{overFlowList()}</>}
        </div>

        <TableHead
          tableHeadData={betHistoryTHead}
          className={styles.table}
        />

        <div
          id='scrollTable'
          className={styles.tableBodyContainer}
        >
          {isPulled && <TableLoader />}

          <InfiniteScroll
            dataLength={betData?.length}
            next={loadMoreBetDetails}
            hasMore={accountDetailsHasNext}
            loader={<div className={styles.loadingFetch}></div>}
            scrollableTarget='scrollTable'
            refreshFunction={() => bettingRecord('pulled')}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={<h3 style={{ textAlign: 'center', opacity: 0 }}>_</h3>}
            releaseToRefreshContent={<h3 style={{ textAlign: 'center', opacity: 0 }}>_</h3>}
          >
            <table className={styles.table}>
              <tbody>
                {betData?.map((item, index) => (
                  <tr key={index}>
                    <td className={styles.createTime}>{item.createTime ?? '-'}</td>
                    <td>{item.gameId ?? '-'}</td>
                    <td>{item.allBet ? `${moneyFormat(+item.allBet)}` : '-'}</td>
                    <td style={{ color: item.profit < 1 ? '#FF0000' : '#00AD27' }}>
                      {item.profit ? `${moneyFormat(+item.profit)}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </InfiniteScroll>
          {!!!betData?.length && (
            <div className={styles.noDataContainer}>
              <NoData />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BettingRecords;
