import { ChangeEvent, FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal, setSecondModal, setThirdModal } from '@/reducers/appData';
import { onlineRecharge, payChannelList } from '@/services/api';
import { TOnlineRecharge } from '@/services/types';
import Button from '@/components/Customs/Button';
import Loader from '@/components/Customs/Loader';
import { useAppDispatch } from '@/store';
import { isIOSSafari, moneyFormat } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import { USDTData } from '..';
import PaymentHeader from './paymentHeader';
import USDTTab from './usdt';
import styles from './index.module.scss';

type PaymentProps = {
  bankName: string;
  activeMenu: number;
  usdtData: USDTData;
};

const PaymentPage: FC<PaymentProps> = ({ bankName, activeMenu, usdtData }) => {
  const dispatch = useAppDispatch();
  const t = useTranslations().payment;
  const { getAccountUserInfo } = useWithDispatch();
  const [amount, setAmount] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [channelList, setChannelList] = useState<any[]>([]);
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(0);
  const [displayValue, setDisplayValue] = useState<string>('');
  const [isValidRecharge, setIsValidRecharge] = useState<boolean>(true);

  useEffect(() => {
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
    dispatch(setSecondModal(DATA_MODAL.CLOSE));
    dispatch(setThirdModal(DATA_MODAL.CLOSE));
  }, []);

  useEffect(() => {
    if (amount?.length > 0) {
      setDisplayValue(moneyFormat(+amount));
    } else {
      setDisplayValue('');
    }
  }, [amount]);

  useEffect(() => {
    if (!isDisabled) {
      setIsValidRecharge(true);
    }
  }, [isDisabled]);

  useEffect(() => {
    if (!!activeMenu) {
      setChannelList([]);
      payChannelList({ typeId: activeMenu }).then(({ code, data }) => {
        if (code === 200) {
          setChannelList(data[0]?.quickAmount.split(','));
          setMin(data[0]?.rechargeMin);
          setMax(data[0]?.rechargeMax);
        } else {
          setChannelList([]);
          setIsDisabled(true);
        }

        setTimeout(() => {
          setIsLoading(false);
        }, 400);
      });
    }

    setDisplayValue('');
    setAmount('');
    setIsValidRecharge(true);
  }, [activeMenu, bankName]);

  useEffect(() => {
    (Number(amount) < min && amount === '') || +amount > max || +amount > 100000000
      ? setIsDisabled(true)
      : setIsDisabled(false);
  }, [amount, displayValue, min, max]);

  const rechargeValidation = (id: number, amount: number) => {
    if (!isDisabled) {
      if (displayValue === '') {
        setIsValidRecharge(false);
      } else {
        setIsLoading((prev) => !prev);
        const ip = localStorage.getItem('ip');
        const data: TOnlineRecharge = {
          channelId: id, //change to id in prod
          money: amount, //change to amount in prod
          realIp: ip as string,
        };
        setIsValidRecharge(true);
        recharge(data);
      }
    } else {
      setIsValidRecharge(false);
    }
  };

  const recharge = (data: TOnlineRecharge) => {
    onlineRecharge(data)
      .then((res) => {
        setTimeout(() => {
          if (res?.data?.code === 200) {
            if (isIOSSafari()) {
              window.location.href = res?.data?.data;
            } else {
              window.open(res?.data?.data, '_blank');
            }
            toast.success(res?.data?.msg ?? t.successRechargeConnection);
            setIsDisabled(true);
            getAccountUserInfo();
          } else {
            toast.error(res?.data?.msg ? res?.data?.msg : t.unsuccessRechargeConnection);
            setIsDisabled(true);
          }
        }, 500);

        setTimeout(() => {
          setIsLoading(false);
          setAmount('');
        }, 800);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const validateInput = (e: ChangeEvent<HTMLInputElement>) => {
    let inputMoney: string = e.target.value;
    inputMoney = inputMoney.replace(/^0+(?=\d)/, '');
    inputMoney = inputMoney.replace(/[^0-9]/g, '');
    setAmount(inputMoney);
  };

  if (bankName !== 'USDT') {
    return (
      <div className={styles.paymentContainer}>
        {isLoading && <Loader />}
        <PaymentHeader bankName={bankName} />
        <div className={styles.inputContainer}>
          <input
            type='text'
            placeholder={`${
              min && max ? `${moneyFormat(min ?? 0)} (min) - ${moneyFormat(max ?? 0)} (max) ` : `${t.choose}`
            }`}
            value={displayValue}
            onChange={validateInput}
            maxLength={max ? moneyFormat(max)?.toString().length : 11}
            data-isvalid={isValidRecharge}
          />

          {!isValidRecharge && <div className={styles.tipIcon}>!</div>}
        </div>

        {channelList?.length > 0 && (
          <div className={styles.amountList}>
            {channelList?.map((data, index) => (
              <div
                key={index}
                className={`${moneyFormat(+amount) == moneyFormat(data) ? styles.amountItem : styles.inactiveItem} ${
                  !isDisabled ? 'active:scale-95 active:opacity-90 transition-all duration-200' : ''
                }`}
                onClick={() => {
                  setAmount(data);
                }}
              >
                <p>{moneyFormat(data)}</p>
              </div>
            ))}
          </div>
        )}
        <div className={styles.buttonWrapper}>
          <Button
            text={t.recharge}
            variant='orange'
            onClick={() => rechargeValidation(Number(activeMenu), +amount)}
          />
        </div>
      </div>
    );
  }

  return <USDTTab usdtData={usdtData} />;
};

export default PaymentPage;
