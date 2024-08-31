import { ChangeEvent, FC, FormEvent, memo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BANK_TYPE, SCREEN_TYPE } from '@/constants/enums';
import { bankList, setBankBindCard } from '@/services/api';
import { TBankList } from '@/services/response-type';
import classNames from 'classnames';
import Button from '@/components/Customs/Button';
import Loader from '@/components/Customs/Loader';
import Divider from '@/components/Pages/WithdrawRecharge/components/divider';
import { useAppSelector } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import DropDown from '../../../re-useable/drop-down';
import Input from '../../../re-useable/input';
import styles from './index.module.scss';

type AddBankProps = { onChangeScreen: (screen: number) => void };

const AddBank: FC<AddBankProps> = ({ onChangeScreen }) => {
  const locale = useAppSelector((state) => state.appData.language);
  const t = useTranslations().withdraw;
  const initCurrency = useAppSelector((state) => state.appData?.initData?.currency) ?? '';
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accountName, setAccountName] = useState<string>('');
  const [accountDetails, setAccountDetails] = useState<string>('');
  const [allBankList, setAllBankList] = useState<TBankList[]>([]);
  const [bank, setBank] = useState<TBankList>();
  const [bankType, setBankType] = useState<string>('');
  const isWallet = bankType === BANK_TYPE.WALLET;
  const useIfscCode = initCurrency === 'INR' && bankType === BANK_TYPE.BANK;
  const [ifscCode, setIfscCode] = useState<string>('');
  const [nameError, setNameError] = useState(false);
  const [accountError, setAccountError] = useState(false);

  useEffect(() => {
    resetBank();
    bankList().then((res) => {
      setAllBankList(res?.data?.data);
    });
  }, []);

  const resetBank = () => {
    setBank({
      id: 0,
      bankName: '',
      bankIcon: '',
      type: '',
    });
  };

  const submitNewBank = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setNameError(!accountName);
    setAccountError(!accountDetails);

    if (accountName && accountDetails && bank) {
      setIsLoading(true);
      const reqBody = useIfscCode
        ? { realName: accountName, account: accountDetails, bankId: bank.id, ifscCode }
        : {
            bankId: bank.id,
            realName: accountName,
            account: accountDetails,
            cpfAccount: '',
            type: 'PIX_CPF',
          };
      const res = await setBankBindCard(reqBody);

      if (res?.data?.code == 200) {
        resetBank();
        setAccountName('');
        setAccountDetails('');
        toast.success(res?.data.msg, { id: 'success' });
        onChangeScreen(SCREEN_TYPE.BANK_LIST);
      } else {
        toast.error(res?.data.msg, { id: 'error' });
      }

      setIsLoading(false);
    }
  };

  const handleSelectBank = (item: TBankList) => {
    setBankType(item.type);
    setBank(item);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (/^[a-zA-Z\s]*$/.test(inputValue)) {
      setAccountName(inputValue);
    }
  };

  const handleAccountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (/^[0-9]*$/.test(inputValue)) {
      setAccountDetails(inputValue);
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      <form
        onSubmit={submitNewBank}
        className={styles.wrapper}
      >
        <h3
          data-lang={locale}
          className={styles.header}
        >
          {t.addCardTitle}
        </h3>
        <Divider />

        <div className={styles.inputWrapper}>
          <div className={styles.inputContainer}>
            <p>
              {t.bankNameLabel} <span>:</span>
            </p>
            <DropDown
              data={allBankList}
              onSelect={handleSelectBank}
            />
          </div>

          <div className={classNames(styles.inputContainer, { [styles.error]: nameError })}>
            <p>
              {isWallet ? t.userNameLabel : t.accountNameLabel}
              <span>:</span>
            </p>
            <Input
              type='text'
              placeholder={isWallet ? t.userNamePH : t.accountNamePH}
              onChange={handleNameChange}
              value={accountName}
            />
            <span className={classNames(styles.errorIcon, { [styles['errorIcon--show']]: nameError })} />
          </div>

          <div className={classNames(styles.inputContainer, { [styles.error]: accountError })}>
            <p>
              {isWallet ? t.walletNumLabel : t.AccountDetailLabel}
              <span>:</span>
            </p>
            <Input
              type='text'
              placeholder={isWallet ? t.walletNumPH : t.accountDetailPH}
              onChange={handleAccountChange}
              value={accountDetails}
            />
            <span className={classNames(styles.errorIcon, { [styles['errorIcon--show']]: accountError })} />
          </div>
          {useIfscCode && (
            <div className={classNames(styles.inputContainer, { [styles.error]: accountError })}>
              <p>
                {t.ifscCode} <span>:</span>
              </p>
              <Input
                type='text'
                placeholder={t.ifscCodePlaceholder}
                onChange={(e) => setIfscCode(e.target.value)}
                value={ifscCode}
              />
              <span className={classNames(styles.errorIcon, { [styles['errorIcon--show']]: accountError })} />
            </div>
          )}
        </div>

        <div className={styles.buttonWrapper}>
          <Button
            type='submit'
            text={t.bind}
            variant={'orange'}
          />
        </div>
      </form>
    </>
  );
};

export default memo(AddBank);
