import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DATA_MODAL } from '@/constants/enums';
import { setSecondModal, setThirdModal } from '@/reducers/appData';
import { onlineRecharge, payTypeList } from '@/services/api';
import { TPayTypeList } from '@/services/response-type';
import { TOnlineRecharge } from '@/services/types';
import classNames from 'classnames';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { useAppDispatch, useAppSelector } from '@/store';
import { isIOSSafari, moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import BonusBanner from '../Loja/components/bonus-banner';
import PopularBanner from '../Loja/components/popular-banner';
import styles from './index.module.scss';

const PurchasePayment = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const dispatch = useAppDispatch();
  const { getAccountUserInfo } = useWithDispatch();
  const t = useTranslations().payment;
  const { secondModal } = useAppSelector((state) => state.appData);
  const { depositData } = useAppSelector((state) => state.paymentData);
  const [activeBank, setActiveBank] = useState<TPayTypeList>();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [bankList, setBankList] = useState<TPayTypeList[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    payTypeList().then(({ code, data }) => {
      if (code !== 200) return;
      if (data.length < 1) return;
      setBankList(data);
    });
  }, []);

  const handleClose = () => {
    if (secondModal === DATA_MODAL.PAYMENT) {
      dispatch(setSecondModal(DATA_MODAL.CLOSE));
    } else {
      dispatch(setThirdModal(DATA_MODAL.CLOSE));
    }
  };

  const SelectBank = (bank: TPayTypeList) => {
    setActiveBank(bank);
    setShowDropdown((prev) => !prev);
  };

  const recharge = (id: number, amount: number, type: number) => {
    setIsDisabled((prev) => !prev);
    const ip = localStorage.getItem('ip');
    const data: TOnlineRecharge = {
      channelId: id, //10057
      money: amount,
      realIp: ip as string,
      rechargeType: type.toString(),
    };
    onlineRecharge(data)
      .then((res) => {
        setTimeout(() => {
          if (res?.data?.code === 200) {
            if (isIOSSafari()) {
              window.location.href = res?.data?.data;
            } else {
              window.open(res?.data?.data, '_blank');
            }
            toast.success(t.successRechargeConnection);
            setIsDisabled((prev) => !prev);
            getAccountUserInfo();
          } else {
            toast.error(t.unsuccessRechargeConnection);
            setIsDisabled((prev) => !prev);
          }
        }, 500);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.backdropImage}>
        <Image
          src={images.payment_backdrop}
          sizes='(max-width: 100vw) 100vw'
          alt='close-button'
          fill
          quality={100}
        />
      </div>
      <div className={styles.paymentBoard}>
        {isDisabled && (
          <div className={styles.loadingContainer}>
            <LoadingIcon />
          </div>
        )}

        <Image
          src={images.payment_board}
          sizes='(max-width: 100vw) 100vw'
          alt='close-button'
          fill
          quality={100}
        />

        <div
          className={classNames(styles.closeButton, 'active:scale-75 active:opacity-90')}
          onClick={handleClose}
        >
          <Image
            src={images.support_close}
            sizes='(max-width: 100vw) 100vw'
            alt='close-button'
            fill
            quality={100}
          />
        </div>
        <div className={styles.titleContainer}>
          <div className={locale === 'cn' ? styles.chText : styles.purchaseText}>
            <Image
              src={t.modalTitle}
              sizes='(max-width: 100vw) 100vw'
              alt='close-button'
              fill
              quality={100}
            />
          </div>
        </div>

        <div className={styles.innerContainer}>
          <div className={styles.labelContainer}>
            {depositData?.type === 1 && <PopularBanner />}
            <div className={styles.purchaseLabel}>
              <p>
                {depositData?.type === 1 && t.popular} {t.currency} {moneyFormat(Number(depositData?.amount))}
              </p>
            </div>
            <div className={styles.bonusBanner}>
              <BonusBanner Bonus={depositData ? depositData?.bonus : 0.0} />
            </div>
          </div>

          <div className={styles.bankContainer}>
            <div className={styles.dropdownLabel}>
              <p>{t.chooseBank}:</p>
            </div>
            <div
              className={styles.dropdownContainer}
              onClick={() => {
                setShowDropdown((prev) => !prev);
              }}
            >
              {activeBank === undefined ? (
                <p>{t.selectBank}</p>
              ) : (
                <>
                  <div className={styles.iconContainer}>
                    {activeBank && activeBank.iconUrl && (
                      <Image
                        sizes='(max-width: 100vw) 100vw'
                        alt='reward'
                        src={activeBank.iconUrl}
                        fill
                        quality={100}
                      />
                    )}
                  </div>
                  {activeBank && activeBank.name && <p>{activeBank.name}</p>}
                </>
              )}

              <div
                className={styles.dropdownIcon}
                style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <Image
                  sizes='(max-width: 100vw) 100vw'
                  alt='reward'
                  src={images.loja_chevron_down}
                  fill
                  quality={100}
                />
              </div>
            </div>

            {showDropdown && (
              <div className={styles.dropdownListContainer}>
                {bankList &&
                  bankList.map((bank, index) => (
                    <div
                      className={styles.dropdownItem}
                      key={index}
                      onClick={() => SelectBank(bank)}
                    >
                      <div className={styles.iconContainer}>
                        <Image
                          sizes='(max-width: 100vw) 100vw'
                          alt='reward'
                          src={bank?.iconUrl ?? ''}
                          fill
                          quality={100}
                        />
                      </div>
                      <p>{bank?.name}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className={styles.rechargeTip}>
            <p>{t.depositTip}</p>
          </div>
        </div>

        <div
          className={classNames(styles.rechargeButton, {
            ['active:scale-75 active:opacity-90 transition-all duration-200']: !isDisabled,
          })}
          style={isDisabled ? { filter: 'grayscale(100%)' } : {}}
          onClick={() => !isDisabled && recharge(Number(activeBank?.id), depositData?.amount, depositData?.type)}
        >
          <Image
            sizes='(max-width: 100vw) 100vw'
            alt='reward'
            src={images.loja_submit}
            fill
            quality={100}
          />

          <div className={styles.amountText}>
            <span>{t.recharge}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePayment;
