import Image from 'next/image';
import React, { FC } from 'react';
import { isIOS } from 'react-device-detect';
import classNames from 'classnames';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './TermsModal.module.scss';

type TTermsModal = {
  termsContent: string;
  showTerms: boolean;
  handleTermModal: () => void;
  isWebView?: boolean;
};
export const TermsModal: FC<TTermsModal> = ({ termsContent, showTerms, handleTermModal, isWebView }) => {
  const t = useTranslations().rechargeBonus;
  return (
    <div
      className={classNames(styles.termsAndCondition, {
        [styles['termsAndCondition--show']]: showTerms,
        [styles.webview]: isWebView,
      })}
    >
      <div
        className={classNames(styles.termsAndCondition__modalContainer, {
          [styles['termsAndCondition__modalContainer--show']]: showTerms,
          [styles['termsAndCondition__modalContainer--isIos']]: isIOS,
        })}
      >
        <div
          className={styles.termsAndCondition__modalCloseButton}
          onClick={handleTermModal}
        >
          <Image
            src={images.terms_close_btn}
            width={108}
            height={108}
            alt='close button'
          />
        </div>
        <div className={styles.termsAndCondition__modalContent}>
          <h1>{t.termsAndCondition}</h1>
          <div
            className={styles.termsAndCondition__paragraph}
            dangerouslySetInnerHTML={{ __html: `<p>${termsContent.replaceAll('\\n', '<br>')}</p>` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
