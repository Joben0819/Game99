import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { DATA_MODAL, SCREEN_TYPE, SIDE_MENU } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { setRspWithdrawInfo } from '@/reducers/paymentData';
import { getBindCardList } from '@/services/api';
import { TMemberCard } from '@/services/types';
import classNames from 'classnames';
import Button from '@/components/Customs/Button';
import Loader from '@/components/Customs/Loader';
import Divider from '@/components/Pages/WithdrawRecharge/components/divider';
import { useAppSelector } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import Input from '../re-useable/input';
import Bank from './components/bank';
import styles from './index.module.scss';

type SelectBankProps = {
  handleRedirect: (id: number, name: string, screen: number) => void;
};

const SelectBank: FC<SelectBankProps> = ({ handleRedirect }) => {
  const locale = useAppSelector((state) => state.appData.language);
  const dispatch = useDispatch();
  const t = useTranslations().withdraw;
  const { activeModal } = useAppSelector((state) => state.appData);
  const { rspWithdrawInfo } = useAppSelector((state) => state.paymentData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeBank, setActiveBank] = useState<number | null>(null);
  const [withDrawAmount, setWithdrawAmount] = useState<string>('');
  const [bindCards, setBindCards] = useState<TMemberCard[]>([]);
  const [isInvalidInput, setIsInvalidInput] = useState<boolean>(false);

  useEffect(() => {
    getBindCardList().then((res) => {
      if (res?.data?.code == 200) {
        dispatch(setRspWithdrawInfo(res?.data?.data?.rspWithdrawInfo));
        setBindCards(res?.data?.data?.memberCardList);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!!!activeModal) {
      setActiveBank(null);
      setWithdrawAmount('');
    }
  }, [activeModal]);

  const handleActiveBank = useCallback(
    (id: number) => {
      setActiveBank(id);
      sessionStorage.setItem('memberCardId', id.toString());
    },
    [activeBank],
  );

  const submitWithdraw = useCallback(() => {
    if (+withDrawAmount < 1) {
      setIsInvalidInput(true);
      return;
    }

    if (!activeBank) {
      toast.error(t.selectBankError, { id: 'error-bank' });
      return;
    }

    if (withDrawAmount && activeBank) {
      sessionStorage.setItem('withdrawAmount', withDrawAmount);
      dispatch(setActiveModal(DATA_MODAL.WITHDRAWPASS));
    }
  }, [withDrawAmount, activeBank]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, '').replace(/^0+/, '');
    setWithdrawAmount(sanitizedValue);
    setIsInvalidInput(false);
  };

  return (
    <>
      {isLoading && <Loader />}

      <div className={styles.FWrapper}>
        <h3
          data-textafter={t.withdrawAmount}
          data-lang={locale}
        >
          {t.withdrawAmount}
        </h3>
        <Divider />
        <div className={styles.fInnerWrapper}>
          <div className={styles.canBeWithdrawn}>
            <div className={styles.withdrawable}>
              <div>
                <p>{moneyFormat(rspWithdrawInfo?.canWithdrawMoney ?? 0.0)}</p>
              </div>
              <div>
                <p>{t.amountCanWD}</p>
              </div>
            </div>
            <div className={styles.codeNeed}>
              <div>
                <p>{moneyFormat(rspWithdrawInfo?.needBeat ?? 0.0)}</p>
              </div>
              <div>
                <p>{t.codeNeeded}</p>
              </div>
            </div>
          </div>

          <Divider />

          <div className={styles.banksContainer}>
            <div className={styles.inputContainer}>
              <Input
                type='text'
                placeholder={t.placeholderWithdrawAmount}
                onChange={handleInputChange}
                value={withDrawAmount !== '' ? moneyFormat(+withDrawAmount) : ''}
                hasError={isInvalidInput}
              />
            </div>
            {bindCards?.map((item, index) => (
              <Bank
                key={index}
                name={`${item.bankName ?? ''} ${item.account}`}
                id={item.id}
                icon={item?.bankIcon ?? ''}
                isActive={activeBank === item.id}
                handleActiveBank={handleActiveBank}
              />
            ))}

            <div
              className={classNames(styles.addBankBtn, 'btn')}
              onClick={() => handleRedirect(SIDE_MENU.WALLET_MANAGEMENT, '', SCREEN_TYPE.ADD_BANK)}
            >
              <span>+</span>
              {t.addBankCard}
            </div>

            <div className={styles.buttonWrapper}>
              <Button
                text={t.withdrawNow}
                onClick={submitWithdraw}
                variant={'orange'}
                width={3.2}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectBank;
