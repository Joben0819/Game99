import { useSearchParams } from 'next/navigation';
import { Dispatch, FC, SetStateAction } from 'react';
import { GameInviterData } from '@/constants/types';
import { RightOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useAppSelector } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type IProps = {
  gameInviterData: GameInviterData | null;
  setMethodTab: Dispatch<SetStateAction<number>>;
  isSpinning: boolean;
  handleScroll: (params: string) => void;
  webView: boolean | undefined;
};

const LotteryCount: FC<IProps> = ({ gameInviterData, setMethodTab, isSpinning, handleScroll, webView }) => {
  const params = useSearchParams();
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations().affiliate;
  const isSmallWebView = window.innerWidth < 450 && webView;
  const isWindow = params.get('isWindow');

  return (
    <div
      className={classNames(styles.leftSpin, {
        [styles.webView]: webView,
        [styles.isSmallWebView]: isSmallWebView && !isWindow,
      })}
      data-lang={locale}
    >
      <span>{`${t.luckyDrawChances.text1}${gameInviterData?.playCount || 0}${t.luckyDrawChances.text2}`}</span>
      <span
        className={styles.roundSpan}
        onClick={() => {
          if (!isSpinning) {
            setMethodTab(1);
            handleScroll('rules');
          }
        }}
      >
        {`${t.lotteryLogs}`} <RightOutlined />
      </span>
    </div>
  );
};

export default LotteryCount;
