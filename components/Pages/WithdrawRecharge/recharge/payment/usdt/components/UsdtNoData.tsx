import Image from 'next/image';
import { FC } from 'react';
import Button from '@/components/Customs/Button';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { USDTData } from '../../..';
import PaymentHeader from '../../paymentHeader';
import { getSteps } from '../constants';
import styles from '../index.module.scss';
import { FormatContent } from './FormatContent';

type USDTNoDataProps = { usdtData: USDTData };

export const USDTNoData: FC<USDTNoDataProps> = ({ usdtData }) => {
  const t = useTranslations().rechargeUsdt;
  const steps = getSteps(usdtData);
  const instructions = steps.filter((step) => step ?? step);

  return (
    <section className={styles.panel}>
      <PaymentHeader bankName={t.paymentChannels} />
      <h2 className={styles.paymentAmount}>{t.paymentAmount}</h2>
      <div className={styles.usdtForm}>
        <div className={styles.input}>
          <label>{t.chainName}</label>
          <input disabled />
        </div>

        <div className={styles.input}>
          <label>{t.rechargeAddress}</label>
          <input disabled />
          <div className={styles.icon}>
            <Image
              src={images.copy}
              alt='Copy recharge address'
              quality={100}
              fill
            />
          </div>
        </div>
      </div>

      <form className={styles.usdtForm}>
        <div className={styles.input}>
          <label htmlFor='transactionId'>{t.transactionId}</label>

          <input
            id='transactionId'
            spellCheck='false'
            placeholder={t.transactionIdPlaceholder}
          />
        </div>

        <div className={styles.input}>
          <label htmlFor='rechargeAmount'>{t.rechargeAmount}</label>

          <input
            type='number'
            id='rechargeAmount'
            placeholder={t.rechargeAmountPlaceholder}
          />
        </div>
        <span className={styles.note}>
          <span className={styles.titleNote}>{t.note}</span>
          {t.noteReceived
            .replace('{totalRecharge}', '0')
            .replace('{rechargeAmount}', '0')
            .replace('{exchangeRate}', '0')}
        </span>

        <div
          className={styles.buttonWrapper}
          style={{ margin: '10px' }}
        >
          <Button
            text={t.button}
            type='submit'
            variant={'orange'}
            style={{ width: '4rem' }}
            disabled
          />
        </div>
      </form>

      <div className={styles.rechargeSteps}>
        <p>{t.instructionHeader}</p>
        <ol>
          {instructions.map((instruction, index) => (
            <li key={index}>{!!instruction && <FormatContent content={instruction} />}</li>
          ))}
        </ol>
        <p>{t.instructionReminder}</p>
      </div>
    </section>
  );
};
