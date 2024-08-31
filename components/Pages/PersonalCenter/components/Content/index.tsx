import { Langar, Luckiest_Guy, Poppins } from 'next/font/google';
import { FC, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setPageLoad } from '@/reducers/appData';
import {
  gameWithdrawal,
  getBalanceByPlatform,
  getFundDetails,
  getGameCategoryList,
  getGameDataList,
} from '@/services/api';
import {
  TBalanceByPlatformResponseData,
  TFundDetailsResponseData,
  TGameCategoryList,
  TTradeTypes,
} from '@/services/response-type';
import { TGameDataList } from '@/services/types';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { FreeMode } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import CustomSwiper from '@/components/Customs/CustomSwiper';
import { useAppSelector } from '@/store';
import PersonalCenterProfile from '../Profile';
import AccountDetails from './AccountDetails';
import BettingRecord from './BettingRecord';
import GameBalance from './GameBalance';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import styles from './index.module.scss';

type ContentProps = {
  statusFilter: TTradeTypes['name'];
};

export const langar = Langar({ weight: '400', subsets: ['latin'] });
export const poppins = Poppins({ weight: '400', subsets: ['latin'] });
export const luckiest_guy = Luckiest_Guy({ weight: '400', subsets: ['latin'] });

const Content: FC<ContentProps> = ({ statusFilter }) => {
  const [gameCategoryList, setGameCategoryList] = useState<TGameCategoryList[]>();
  const [BalanceList, setBalanceList] = useState<TBalanceByPlatformResponseData[]>([]);
  const swiperRef = useRef<any>(null);
  const { userInfo } = useAppSelector((state) => state.userData);
  const [activeCategory, setActiveCategory] = useState<string>();
  const {
    personalCenter: { activeTab, dateFilter },
  } = useAppSelector((state) => state.userData);
  const [betData, setBetData] = useState<TGameDataList[]>([]);
  const [transactionData, setTransactionData] = useState<TFundDetailsResponseData[]>([]);
  const [accountDetailsHasNext, setAccountDetailsHasNext] = useState<boolean>(true);
  const [isPulled, setIsPulled] = useState<boolean>(false);
  const [pageNum, setPageNum] = useState(1);
  const dispatch = useDispatch();
  const { getAccountBalance } = useWithDispatch();

  useEffect(() => {
    activeTab === 0 && bettingRecord();
  }, [activeCategory, dateFilter, activeTab]);

  useEffect(() => {
    activeTab === 1 && accountDetails();
  }, [dateFilter, activeTab, statusFilter]);

  useEffect(() => {
    setTransactionData([]);
  }, [activeTab]);

  useEffect(() => {
    //reset
    setAccountDetailsHasNext(true);
    setPageNum(1);
    activeTab === 2 && accountBalance();
    if (activeTab === 0) {
      getGameCategoryList().then((res) => {
        if (res.data?.code === 200) {
          setGameCategoryList(res.data?.data);
          if (localStorage.getItem('betting-record-category')) {
            handleSelectCategory(localStorage.getItem('betting-record-category')!);
          } else {
            handleSelectCategory(res.data?.data[0]?.name);
          }
        }
      });
    } else {
      if (!!gameCategoryList?.length) {
        if (localStorage.getItem('betting-record-category')) {
          handleSelectCategory(localStorage.getItem('betting-record-category')!);
        } else {
          handleSelectCategory(gameCategoryList[0]?.name);
        }
      }
    }
  }, [activeTab]);

  useEffect(() => {
    dispatch(setPageLoad(false));
    return () => {
      dispatch(setPageLoad(false));
    };
  }, []);

  const bettingRecord = async (type?: string) => {
    if (type === 'pulled') {
      setIsPulled(true);
    }

    setBetData([]); // clearing the state before fetching new data. Fixing the flickering issue.
    if (!activeCategory) {
      return;
    }

    const res = await getGameDataList({
      gameCategory: activeCategory,
      enumReqTime: dateFilter,
      pageNum: 1,
      pageSize: 40,
    });

    if (!res?.data) {
      return;
    }

    const next = res.data.hasNext;
    setAccountDetailsHasNext(next);
    setBetData(res?.data.data);
    setIsPulled(false);
  };

  const accountDetails = async (type?: string) => {
    if (type === 'pulled') setIsPulled(true);

    // setTransactionData([]); // clearing the state before fetching new data. Fixing the flickering issue.
    const res = await getFundDetails({
      ...(statusFilter ? { enumMoney: statusFilter } : {}),
      enumReqTime: dateFilter,
      pageNum: 1,
      pageSize: 40,
    });
    if (!res?.data) {
      return;
    }
    const next = res.hasNext;
    setAccountDetailsHasNext(next);
    setTransactionData(res.data);
    setIsPulled(false);
  };

  const loadMoreBetDetails = async () => {
    const res = await getGameDataList({
      gameCategory: activeCategory,
      enumReqTime: dateFilter,
      pageNum: pageNum + 1,
      pageSize: 40,
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

  const loadMoreAccountDetails = async () => {
    const res = await getFundDetails({
      ...(statusFilter ? { enumMoney: statusFilter } : {}),
      enumReqTime: dateFilter,
      pageNum: pageNum + 1,
      pageSize: 40,
    });

    if (!res?.data) {
      return;
    }

    const newData = res.data;
    const next = res.hasNext;
    setPageNum((prevPage) => prevPage + 1);
    setAccountDetailsHasNext(next);
    setTransactionData((prevAccountData) => [...prevAccountData, ...newData]);
  };

  const accountBalance = async (type?: string) => {
    if (type === 'pulled') {
      setIsPulled(true);
    }

    const res = await getBalanceByPlatform({ memberId: userInfo.id });
    setBalanceList(res?.data);
    setIsPulled(false);
  };

  const onWithdraw = (dataId: number) => {
    gameWithdrawal({ id: dataId }).then((res) => {
      if (res.data.code !== 200) {
        toast.error(res.data.msg, { id: 'error' });
      } else {
        getAccountBalance();
        toast.success(res.data.msg);
        accountBalance();
      }
    });
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
                onClick={() => handleSelectCategory(item?.name)}
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
              <SwiperSlide key={item?.name} className={styles.slide}>
                <motion.span
                  whileTap={{ scale: 0.9 }}
                  className={classNames(styles.tabItem, {
                    [styles.activeItem]: item?.name === activeCategory,
                  })}
                  onClick={() => handleSelectCategory(item?.name)}
                >
                  {item?.des}
                </motion.span>
              </SwiperSlide>
            );
          })}
      </CustomSwiper>
    );
  };

  const handleSelectCategory = (name: string) => {
    setActiveCategory(name);
    localStorage.setItem('betting-record-category', name);
  };

  const renderContent = () => {
    if (activeTab === 0) {
      return (
        <BettingRecord
          swiperList={swiperList}
          overFlowList={overFlowList}
          isPulled={isPulled}
          bettingRecord={bettingRecord}
          transactionData={transactionData}
          loadMoreBetDetails={loadMoreBetDetails}
          accountDetailsHasNext={accountDetailsHasNext}
          betData={betData}
        />
      );
    }

    if (activeTab === 1) {
      return (
        <AccountDetails
          isPulled={isPulled}
          transactionData={transactionData}
          accountDetailsHasNext={accountDetailsHasNext}
          loadMoreAccountDetails={loadMoreAccountDetails}
          accountDetails={accountDetails}
        />
      );
    }

    if (activeTab === 2) {
      return (
        <GameBalance
          isPulled={isPulled}
          accountBalance={accountBalance}
          balanceList={BalanceList}
          onWithdraw={onWithdraw}
        />
      );
    }

    return <PersonalCenterProfile />;
  };

  return (
    <div className={styles.mainContentWrapper} data-activetab={activeTab}>
      {renderContent()}
    </div>
  );
};

export default Content;
