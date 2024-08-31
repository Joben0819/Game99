import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';
import { DATA_LANG } from '@/constants/enums';
import classNames from 'classnames';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import CountdownTimer from '@/components/Customs/CountDownTimer';
import { useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault('Asia/Jakarta');

type DeadlineTimerProps = {
  expireTime?: number;
  handleGetInviterData: () => void;
};

const DeadlineTimer: FC<DeadlineTimerProps> = ({ expireTime, handleGetInviterData }) => {
  const params = useSearchParams();
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations().affiliate;
  // const startDatetime = dayjs.tz();
  // const endDatetime = dayjs.tz(deadlineDateTime);
  const validUntil = expireTime;
  const isSmallWebView = window.innerWidth < 450;
  const isWindow = params.get('isWindow');

  const renderDeadlineTimerText = () => {
    if (locale === DATA_LANG.EN || locale === DATA_LANG.IND)
      return (
        <>
          {t.cashWillExpireAfter}
          <CountdownTimer
            onCountdownEnd={handleGetInviterData}
            validUntil={validUntil ?? 0}
          />
        </>
      );

    return (
      <>
        <CountdownTimer
          onCountdownEnd={handleGetInviterData}
          validUntil={validUntil ?? 0}
        />
        {t.cashWillExpireAfter}
      </>
    );
  };

  return (
    <div
      className={classNames(styles.deadlineTimer, {
        [styles.isSmallWebViewOverride]: isSmallWebView && !isWindow,
      })}
      data-lang={locale}
    >
      <Image
        src={images.clock_icon}
        width={17}
        height={17}
        alt='clock icon'
      />
      {renderDeadlineTimerText()}
    </div>
  );
};

export default DeadlineTimer;
