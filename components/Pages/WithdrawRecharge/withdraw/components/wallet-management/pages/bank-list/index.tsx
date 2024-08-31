import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { SCREEN_TYPE } from '@/constants/enums';
import { getBindCardList } from '@/services/api';
import { TMemberCard } from '@/services/types';
import classNames from 'classnames';
import Loader from '@/components/Customs/Loader';
import TableLoader from '@/components/Customs/TableLoader';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type BankListProps = {
  onChangeScreen: (screen: number) => void;
};

const BankList: FC<BankListProps> = ({ onChangeScreen }) => {
  const t = useTranslations().withdraw;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPulled, setIsPulled] = useState<boolean>(false);
  const [bindCards, setBindCards] = useState<TMemberCard[]>([]);

  useEffect(() => {
    getCards('initial');
  }, []);

  const getCards = async (type: string) => {
    if (type === 'pulled') setIsPulled(true);
    else setIsLoading(true);

    const res = await getBindCardList();
    if (res?.data?.code == 200) {
      setBindCards(res?.data?.data?.memberCardList);
    }
    setIsLoading(false);
    setIsPulled(false);
  };

  return (
    <>
      {isLoading && <Loader />}
      {isPulled && <TableLoader />}

      {!!bindCards.length ? (
        <PullToRefresh
          className={styles.ptr}
          onRefresh={() => getCards('pulled')}
        >
          <div className={styles.wrapper}>
            {bindCards?.map((item, index) => (
              <div
                className={styles.bank}
                key={index}
              >
                <div className={styles.titleIcon}>
                  <div className={styles.icon}>
                    <Image
                      src={item?.bankIcon || images.bank_default_icon}
                      alt='selected-icon'
                      fill
                      sizes='100%'
                    />
                  </div>
                  <span>{item.bankName}</span>
                </div>
                <div>
                  <span>{item.account}</span>
                </div>
              </div>
            ))}

            <div
              className={classNames(styles.addBankBtn, 'btn')}
              onClick={() => onChangeScreen(SCREEN_TYPE.ADD_BANK)}
            >
              <span>+</span>
              {t.addBankCard}
            </div>
          </div>
        </PullToRefresh>
      ) : (
        <div
          className={classNames(styles.addBankBtn, 'btn')}
          onClick={() => onChangeScreen(SCREEN_TYPE.ADD_BANK)}
        >
          <span>+</span>
          {t.addBankCard}
        </div>
      )}
    </>
  );
};

export default BankList;
