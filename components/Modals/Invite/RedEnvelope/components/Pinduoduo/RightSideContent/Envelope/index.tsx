import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { GameInviterData } from '@/constants/types';
import { setPageLoad } from '@/reducers/appData';
import classNames from 'classnames';
import { debounce } from 'lodash-es';
import iconShare from '@/public/assets/commons/envelope/iconShare.png';
import { useAppSelector } from '@/store';
import { isVivoBrowser, moneyFormat, percentage } from '@/utils/helpers';
import { images } from '@/utils/resources';
import useCountUp from '@/hooks/useCountUp';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type TProps = {
  gameInviterData: GameInviterData | null;
  showSVGA: boolean;
};

const Envelope: FC<TProps> = ({ gameInviterData, showSVGA }) => {
  const { language: locale, isSpinning } = useAppSelector((s) => s.appData);
  const t = useTranslations().affiliate;
  let buttonText: string;
  let progressbarWidth = 0;

  buttonText = t.disabledBtnText.replace('{ spinNumber }', gameInviterData?.spinsPerInvite || '0');

  const RenderEnvelopeMiddleText = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const completionPoints = gameInviterData?.completionPoints;
    const completePoints = completionPoints ? +(completionPoints || 0) - +gameInviterData?.initialPoints : 0;
    const percentVal = gameInviterData?.progressPoints
      ? +(gameInviterData?.progressPoints || 0) - +gameInviterData?.initialPoints
      : 0;
    const initialValue = (+parseFloat(percentVal?.toString())?.toFixed(2) / completePoints) * 100;
    const animateNumber = useCountUp(Number(gameInviterData?.progressPoints) || 0, 1000);

    progressbarWidth = +percentage(+initialValue, 100);

    let checkCount = 0;

    if (progressbarWidth > 17 && progressbarWidth < 34) checkCount = 1;
    else if (progressbarWidth > 33 && progressbarWidth < 50) checkCount = 2;
    else if (progressbarWidth > 49 && progressbarWidth < 67.5) checkCount = 3;
    else if (progressbarWidth > 66.5 && progressbarWidth < 89) checkCount = 4;
    else if (progressbarWidth > 88) checkCount = 5;

    const handlePlayButton = debounce(() => {
      dispatch(setPageLoad(true));
      router.push('invite/qr');
    }, 750);

    return (
      <div
        className={styles.envelopeMiddleText}
        data-lang={locale}
      >
        <div className={styles.upContentContainer}>
          <h1>{gameInviterData?.progressPoints ? moneyFormat(animateNumber) : '00.00'}</h1>
          <h2 data-lang={locale}>
            {t.quickRedEnvelopeWithdrawal}
            <span>{` ${moneyFormat(+completionPoints! || 0, false)}`}</span>
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
              {/* <span>{`${moneyFormat(+completionPoints! || 0)}`}</span> */}
            </div>
          </div>
        </div>

        <button
          onClick={handlePlayButton}
          className={classNames(styles.envelopeBtn, {
            [styles.disabled]: isSpinning,
          })}
          data-lang={locale}
          disabled={isSpinning || showSVGA}
        >
          <Image
            src={iconShare}
            alt='iconShare'
          />
          <p>{buttonText}</p>
        </button>
      </div>
    );
  };

  return (
    <div
      className={classNames(styles.leftSide, {
        [styles.isVivoBrowser]: isVivoBrowser(),
      })}
    >
      <div className={styles.leftSideContent}>
        <div className={styles.envelope}>
          <div className={styles.envelopeTopText}>
            <span>ID: {gameInviterData?.memberId}</span>
          </div>
          {RenderEnvelopeMiddleText()}
        </div>
      </div>
    </div>
  );
};

export default Envelope;
