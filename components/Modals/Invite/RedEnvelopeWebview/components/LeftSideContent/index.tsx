import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';
import { GameInviterData } from '@/constants/types';
import classNames from 'classnames';
import { useAppSelector } from '@/store';
import { isIOS, moneyFormat, percentage } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import DeadlineTimer from '../DeadlineTimer';
import WinnerList from '../WinnerList';
import styles from './index.module.scss';

type TProps = {
  gameInviterData: GameInviterData | null;
  selectedSlot: number;
  webView: boolean | undefined;
  handleGetInviterData: () => void;
  currentPoints: string | undefined;
  handlePlayButton: () => void;
  showSVGA: boolean;
  isClicked: boolean;
};

const LeftSideContent: FC<TProps> = ({
  gameInviterData,
  selectedSlot,
  webView,
  handleGetInviterData,
  currentPoints,
  handlePlayButton,
  showSVGA,
  isClicked,
}) => {
  const params = useSearchParams();
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations().affiliate;
  const isSpinning = gameInviterData?.playCount! > 0 && selectedSlot !== 0;
  const isDisabled = gameInviterData?.playCount === 0 || !gameInviterData || selectedSlot !== 0;
  const isSmallWebView = window.innerWidth < 450 && webView;
  const isWindow = params.get('isWindow');
  let buttonText: string;
  let progressbarWidth = 0;

  if (isSpinning) {
    buttonText = t.spinning;
  } else if (isDisabled) {
    // buttonText = t('disabledBtnText', {
    //   spinNumber: gameInviterData?.spinsPerInvite || 0,
    // });
    buttonText = t.disabledBtnText.replace('{ spinNumber }', gameInviterData?.spinsPerInvite || '0');
  } else {
    buttonText = t.winningTheLottery;
  }

  const renderEnvelopeMiddleText = () => {
    const completionPoints = gameInviterData?.completionPoints;
    const completePoints = completionPoints ? +(completionPoints || 0) - +gameInviterData?.initialPoints : 0;
    const percentVal = gameInviterData?.progressPoints ? +(currentPoints || 0) - +gameInviterData?.initialPoints : 0;
    const initialValue = (+parseFloat(percentVal?.toString())?.toFixed(2) / completePoints) * 100;

    progressbarWidth = +percentage(+initialValue, 100);

    let checkCount = 0;

    if (progressbarWidth > 17 && progressbarWidth < 34) checkCount = 1;
    else if (progressbarWidth > 33 && progressbarWidth < 50) checkCount = 2;
    else if (progressbarWidth > 49 && progressbarWidth < 67.5) checkCount = 3;
    else if (progressbarWidth > 66.5 && progressbarWidth < 89) checkCount = 4;
    else if (progressbarWidth > 88) checkCount = 5;

    const needNewLine = buttonText.length > 40;

    return (
      <div
        className={styles.envelopeMiddleText}
        data-lang={locale}
      >
        <div
          className={classNames(styles.upContentContainer, {
            [styles.webView]: webView,
            [styles.isIOS]: isIOS() && !isWindow,
            [styles.isSmallWebView]: isSmallWebView && !isWindow,
            [styles.isWindow]: isIOS() && isWindow,
          })}
        >
          <h1>
            {currentPoints ? moneyFormat(+parseFloat(currentPoints).toFixed(2), false) : '00.00'}
            <span> IDR</span>
          </h1>
          <h2 data-lang={locale}>
            {t.quickRedEnvelopeWithdrawal}
            <span>{` ${moneyFormat(+completionPoints! || 0, false)} IDR`}</span>
          </h2>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBarHolder}>
              <div
                className={styles.progressBar}
                style={{ width: progressbarWidth ? `${progressbarWidth}%` : 0 }}
              />
              <div className={styles.progressImgContainer}>
                {Array.from({ length: checkCount })?.map((_item, idx) => (
                  <Image
                    key={idx}
                    src={images.yellow_circle_red_check}
                    width={23}
                    height={23}
                    alt='yellow circle red check'
                  />
                ))}
              </div>
            </div>
            <div className={styles.boxCheckContainer}>
              <Image
                src={images.gopay_small_icon}
                width={9}
                height={9}
                alt='box with 60 and check'
              />
              {/* <span>{`${moneyFormat(+completionPoints! || 0)} IDR`}</span> */}
            </div>
          </div>
        </div>

        <button
          onClick={handlePlayButton}
          className={classNames(styles.envelopeBtn, {
            [styles.disabled]: isSpinning,
            [styles.webView]: webView,
            [styles.isSmallWebView]: isSmallWebView && !isWindow,
            [styles.isIOSneedNewLine]: isIOS() && needNewLine && webView,
          })}
          data-lang={locale}
          disabled={isSpinning || showSVGA || isClicked}
        >
          {buttonText}
        </button>
      </div>
    );
  };

  return (
    <div className={styles.leftSide}>
      <div className={styles.leftSideContent}>
        <div className={styles.envelope}>
          <div
            className={classNames(styles.envelopeTopText, {
              [styles.isSmallWebView]: isSmallWebView && !isWindow,
            })}
          >
            <span>ID: {gameInviterData?.memberId}</span>
          </div>
          {renderEnvelopeMiddleText()}
        </div>
        <DeadlineTimer
          expireTime={gameInviterData?.expireTime}
          handleGetInviterData={handleGetInviterData}
          webView={webView}
        />
        <WinnerList webView={webView} />
      </div>
    </div>
  );
};

export default LeftSideContent;
