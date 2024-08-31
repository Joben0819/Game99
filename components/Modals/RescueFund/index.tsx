import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal, setSecondModal } from '@/reducers/appData';
import { collectRescueBonus } from '@/services/api';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { debounce } from 'lodash-es';
import Button from '@/components/Customs/Button';
import HeaderTitle from '@/components/Customs/HeaderTitle';
import { useAppSelector } from '@/store';
import { hasAnnounceJumpType, hasEventJumpType, moneyFormat } from '@/utils/helpers';
import { images, staticImport } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import styles from './index.module.scss';

const RescueFund = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const t = useTranslations();
  const dispatch = useDispatch();
  const { getAccountUserInfo, getRescueBonusDetails, getVipGiftInfoRequest } = useWithDispatch();
  const [todaysData, yesterdaysData] = useAppSelector((state) => state.appData.rescueDetails);
  const vipSetList = useAppSelector((state) => state.appData.vipGiftInfo?.vipSetList);
  const [isTodayAmountMove, setIsTodayAmountMove] = useState<boolean>(false);
  const [isYesterdayAmountMove, setIsYesterdayAmountMove] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const todayAmountRef = useRef<HTMLDivElement>(null);
  const yesterDayAmountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!yesterdaysData || yesterdaysData.collected === 1) {
      setIsDisabled(true);
    } else {
      if (yesterdaysData?.rescueBonus! < 1) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }
  }, [yesterdaysData]);

  useEffect(() => {
    if (todayAmountRef.current && todayAmountRef?.current?.scrollWidth > todayAmountRef?.current?.offsetWidth) {
      setIsTodayAmountMove(true);
    }
    if (
      yesterDayAmountRef.current &&
      yesterDayAmountRef?.current?.scrollWidth > yesterDayAmountRef?.current?.offsetWidth
    ) {
      setIsYesterdayAmountMove(true);
    }
  }, [todaysData, yesterdaysData]);

  const onCloseBtn = () => {
    if (localStorage.getItem('recent-modal') === 'VIP') {
      dispatch(setActiveModal(DATA_MODAL.VIP));
    } else {
      if (hasEventJumpType()) {
        dispatch(setActiveModal(DATA_MODAL.ACTIVITIES));
      } else if (hasAnnounceJumpType()) {
        dispatch(setActiveModal(DATA_MODAL.CLOSE));
        dispatch(setSecondModal(DATA_MODAL.OTHER_ANNOUNCEMENT));
        sessionStorage.removeItem('announceJumpType');
      } else {
        dispatch(setActiveModal(DATA_MODAL.CLOSE));
      }
    }
  };

  const handleCollection = async () => {
    if (yesterdaysData != undefined) {
      if (yesterdaysData && yesterdaysData.collected !== 1) {
        const result = await collectRescueBonus();
        const { code, msg } = result.data;
        if (code === 200) {
          toast.success(msg);
          getRescueBonusDetails();
          getAccountUserInfo();
        }
        if (code === 400) {
          toast.error(msg || t.toasts.somethingWrong);
        }
        if (code === 405) {
          toast.error(msg || t.toasts.noRedemptionBonusToCollect);
        }
      }
    }
  };

  const Collected = () => (
    <>
      {yesterdaysData?.collected === 1 && (
        <div className={styles.onCheck}>
          <div className={styles.checkImage}>
            <Image
              src={images.no_check}
              alt=''
              fill
            />
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <div className={styles.modalWrapper}>
        <div className={styles.modalContainer}>
          <HeaderTitle
            text={t.rescueFund.title}
            className={styles.title}
            size={locale === 'in' ? 25 : 30}
          />
          <div className={styles.content}>
            <div className={classNames([styles.todayLosses])}>
              <div className={styles.rescueBonusRate}>
                <span className={styles.bonusRate}>
                  {!!todaysData?.rescueBonusRate ? moneyFormat(+(todaysData?.rescueBonusRate * 100).toFixed(2)) : 0}%
                </span>
              </div>
              <Image
                className={styles.background}
                src={images.today_losses_bg}
                alt="Today's losses background"
                fill
                sizes='33vw'
              />
              <div className={styles.boxContent}>
                <div className={styles.head}>
                  <span className={styles.boxTitle}>{t.rescueFund.todaysLoses}</span>
                  <p className={styles.lossAmount}>{` ${!!todaysData?.loss ? moneyFormat(todaysData?.loss) : '0'} `}</p>
                </div>
                <div className={styles.boxBody}>
                  <span className={styles.description}>{t.rescueFund.todaysRescue}</span>

                  <Image
                    src={staticImport.rescue_fund_icon}
                    alt='Rescue Fund'
                    width={130}
                    height={130}
                    priority
                    placeholder='blur'
                  />

                  <div
                    className={classNames([styles.rescueAmount], [styles.marqueeWrapper])}
                    ref={todayAmountRef}
                  >
                    <p
                      className={classNames({ [styles.moving]: isTodayAmountMove })}
                      style={{ animationDuration: `6s` }}
                    >
                      {`${!!todaysData?.rescueBonus ? moneyFormat(todaysData?.rescueBonus) : '0'}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Yesterdays Rescue Bonus Box */}
            <div
              className={classNames({
                [styles.yesterdayLosses]: true,
                [styles.todayLosses]: isDisabled,
                [styles.zeroCollected]: yesterdaysData?.collected,
              })}
            >
              <div className={styles.rescueBonusRate}>
                <span className={styles.bonusRate}>
                  {!!yesterdaysData?.rescueBonusRate
                    ? moneyFormat(+(yesterdaysData?.rescueBonusRate * 100).toFixed(2))
                    : 0}
                  %
                </span>
              </div>
              <Image
                className={styles.background}
                src={
                  !!yesterdaysData?.rescueBonus && yesterdaysData?.rescueBonus > 0
                    ? images.yesterday_losses_bg
                    : images.today_losses_bg
                }
                alt="Yesterday's losses background"
                fill
                sizes='33vw'
              />
              <div className={styles.boxContent}>
                <div className={styles.head}>
                  <span className={styles.boxTitle}>{t.rescueFund.yesterdaysLoses}</span>
                  <p className={styles.lossAmount}>
                    {`${!!yesterdaysData?.loss ? moneyFormat(yesterdaysData?.loss) : '0'}`}
                  </p>
                </div>
                <div className={styles.boxBody}>
                  <span className={styles.description}>{t.rescueFund.yesterdaysRescue}</span>
                  <Image
                    src={staticImport.rescue_fund_icon}
                    alt='Rescue Fund'
                    width={150}
                    height={150}
                    priority
                    placeholder='blur'
                  />
                  <div
                    className={classNames([styles.rescueAmount], [styles.marqueeWrapper])}
                    ref={yesterDayAmountRef}
                  >
                    <p
                      className={classNames({ [styles.moving]: isYesterdayAmountMove })}
                      style={{ animationDuration: `6s` }}
                    >
                      {`${!!yesterdaysData?.rescueBonus ? moneyFormat(yesterdaysData?.rescueBonus) : '0'}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* GameRules box */}
            <div className={classNames([styles.gameRule])}>
              <Image
                className={styles.background}
                src={images.game_rule_bg}
                alt="Yesterday's losses background"
                fill
                priority
                sizes='33vw'
              />
              <p
                className={styles.gameRuleTitle}
                data-lang={locale}
              >
                {t.rescueFund.gameRules}
              </p>
              <div className={styles.gameRulesBodyContainer}>
                <div className='flex flex-col gap-y-0.5'>
                  <p>{t.rescueFund.rule1}</p>
                  <p>{t.rescueFund.rule2}</p>
                  <p>{t.rescueFund.rule3}</p>
                  <p>{t.rescueFund.rule4}</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            whileTap={{ scale: 0.9 }}
            className={styles.closeBtn}
            onClick={onCloseBtn}
          />

          <motion.div
            whileTap={{ scale: 0.9 }}
            className={styles.faqBtn}
            onClick={() => {
              if (!vipSetList?.length) {
                getVipGiftInfoRequest();
              }
              dispatch(setActiveModal(DATA_MODAL.FUNDO_MODAL));
            }}
          />
          <Button
            className={styles.getRescueFundBtn}
            style={isDisabled ? { filter: 'grayscale(100%)' } : {}}
            text={t.rescueFund.receive}
            variant={'orange'}
            onClick={debounce(handleCollection, 300)}
            width={2.3}
            disabled={isDisabled}
          />

          <Collected />
        </div>
      </div>
    </>
  );
};

export default RescueFund;
