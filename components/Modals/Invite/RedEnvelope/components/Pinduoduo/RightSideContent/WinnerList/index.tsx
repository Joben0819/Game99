import { FC, useEffect, useRef, useState } from 'react';
import { getWinnerList } from '@/services/api';
import { TWinnerList } from '@/services/types';
import { motion } from 'framer-motion';
import { moneyFormat } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type WinnerListProps = {};

const WinnerList: FC<WinnerListProps> = ({}) => {
  const t = useTranslations().affiliate;
  const [height, setHeight] = useState(0);
  const [winnerIndex, setWinnerIndex] = useState(1);
  const [winnerList, setWinnerList] = useState<TWinnerList[]>([]);
  const [duration, setDuration] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWinner = async () => {
      const { data } = await getWinnerList({ pageNum: 1, pageSize: 100 });
      if (data.code !== 200) {
        console.error(data.msg);
        return;
      }
      setWinnerList(data.data);
      setDuration(data.data.length * 0.75);
    };
    fetchWinner();
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const list = listRef.current;
    if (wrapper && list) {
      const wrapperHeight = wrapper.getBoundingClientRect().height;
      const listHeight = list.getBoundingClientRect().height;
      setHeight(wrapperHeight);
      if (listHeight < wrapperHeight) {
        setDuration((wrapperHeight / (listHeight / winnerList.length)) * 0.75);
      } else {
        setDuration(winnerList.length * 0.75);
      }
    }
    const interval = setInterval(() => {
      setWinnerIndex((prevIndex) => (prevIndex === winnerList.length ? 0 : prevIndex + 1));
    }, duration * 1000);
    return () => clearInterval(interval);
  }, [winnerList, duration]);

  if (!winnerList.length) return null;

  const filterWinnerList = winnerList.filter((item) => item !== null);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.winnerListContainer}>
        <div
          ref={wrapperRef}
          className={styles.winnerListCarouselWrapper}
        >
          {filterWinnerList.length === 0 && (
            <div className={styles.noRecordWrapper}>
              <p className={styles.noRecordFound}>{t.noRecordFound}</p>
            </div>
          )}

          {filterWinnerList.length > 0 && (
            <motion.div
              ref={listRef}
              key={winnerIndex}
              initial={{ y: height }}
              animate={{ y: `-100%` }}
              transition={{ duration, ease: 'linear' }}
              className={styles.winnerListMovingRows}
            >
              {filterWinnerList.map((item, index) => (
                <div
                  key={index}
                  className={styles.winnerListCarouselItem}
                >
                  <span>{item.memberId}</span>
                  <span>{item.name}</span>
                  <span>{moneyFormat(item.amount)}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WinnerList;
