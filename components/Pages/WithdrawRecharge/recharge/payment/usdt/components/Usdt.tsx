'use client';

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { postUsdtRecharge } from '@/services/api';
import { TUsdtListData } from '@/services/response-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/Customs/Button';
import { Input } from '@/components/Customs/Input';
import { moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { USDTData } from '../../..';
import PaymentHeader from '../../paymentHeader';
import { getSteps } from '../constants';
import styles from '../index.module.scss';
import { FormatContent } from './FormatContent';

type USDTProps = {
  usdtData: USDTData;
  rechargeList: TUsdtListData[];
};

const USDTFormSchema = z
  .object({
    transactionId: z.string().min(1),
    rechargeAmount: z.string().min(1),
  })
  .required();

export const USDT: FC<USDTProps> = ({ usdtData, rechargeList }) => {
  const t = useTranslations().rechargeUsdt;
  const [selectedChainName, setSelectedChainName] = useState(0);
  const steps = getSteps(usdtData);
  const instructions = steps.filter((step) => step ?? steps);

  const { watch, handleSubmit, register, formState, reset, setValue } = useForm<z.infer<typeof USDTFormSchema>>({
    resolver: zodResolver(USDTFormSchema),
    defaultValues: {
      transactionId: '',
      rechargeAmount: '',
    },
  });

  const formValues = watch();
  const rechargeAmount = +formValues.rechargeAmount || 0;
  const exchangeRate = +rechargeList[selectedChainName].exchangeRate;
  const totalRecharge = rechargeAmount * exchangeRate;

  const cleanString = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '');

  const handleTransactionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = cleanString(e.target.value);
    setValue('transactionId', cleanedValue, { shouldValidate: false });
  };

  const onSubmit = (values: z.infer<typeof USDTFormSchema>) => {
    const id = +rechargeList[selectedChainName].id;
    const transactionId = values.transactionId;
    const rechargeNumber = +values.rechargeAmount;

    (async () => {
      try {
        const { code, msg } = await postUsdtRecharge({
          id,
          transactionId,
          rechargeNumber,
        });
        if (code !== 200) return toast.error(msg);
        toast.success(msg);
        reset();
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong.');
      }
    })();
  };

  return (
    <section className={styles.panel}>
      <PaymentHeader bankName={t.paymentChannels}>
        <div className={styles.chainNameContainer}>
          {rechargeList.map((list, index) => (
            <div
              key={list.id}
              className={styles.chainName}
              onClick={() => setSelectedChainName(index)}
            >
              {list.channelName}
            </div>
          ))}
        </div>
      </PaymentHeader>
      <h2 className={styles.paymentAmount}>{t.paymentAmount}</h2>

      <div className={styles.usdtForm}>
        <Input
          placeholder={rechargeList[selectedChainName].chainName}
          labelStyles={{
            text: t.chainName,
          }}
          disabled
        />

        <Input
          labelStyles={{
            text: t.rechargeAddress,
          }}
          placeholder={rechargeList[selectedChainName].rechargeAddress}
          customIcon={{
            src: images.copy,
            alt: 'Copy recharge address',
            onClick: () => {
              if (+rechargeList[selectedChainName].rechargeAddress > 0) {
                navigator.clipboard.writeText(rechargeList[selectedChainName].rechargeAddress);
                toast.success(t.copyRechargeAddress, { id: 'copy' });
              }
            },
          }}
          disabled
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.usdtForm}
      >
        <Input
          id='transactionId'
          placeholder={t.transactionIdPlaceholder}
          labelStyles={{
            text: t.transactionId,
          }}
          formState={!!formState.errors.transactionId}
          {...register('transactionId', { onChange: handleTransactionIdChange })}
        />

        <Input
          type='number'
          id='rechargeAmount'
          placeholder={t.rechargeAmountPlaceholder}
          labelStyles={{
            text: t.rechargeAmount,
          }}
          formState={!!formState.errors.rechargeAmount}
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            if (target.value.length > 5) {
              target.value = target.value.slice(0, 5);
            }
          }}
          {...register('rechargeAmount')}
        />

        <span className={styles.note}>
          <span className={styles.titleNote}>{t.note}</span>

          {t.noteReceived
            .replace('{totalRecharge}', moneyFormat(totalRecharge))
            .replace('{rechargeAmount}', moneyFormat(rechargeAmount))
            .replace('{exchangeRate}', moneyFormat(exchangeRate))}
        </span>

        <div className={styles.button}>
          <Button
            text={t.button}
            type='submit'
            variant={'orange'}
            style={{ width: '4rem' }}
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
