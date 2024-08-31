'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { QRCode } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@/components/Customs/Button';
import ShareQr from '@/components/Modals/Share';
import { useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import styles from './styles.module.scss';
import { handleCopy } from '@/utils/helpers';

const QR = () => {
  const router = useRouter();
  const t = useTranslations().invite;
  const translatedToastMessage = useTranslations().recharge;
  const { resetInternetStatus } = useWithDispatch();
  const { id } = useAppSelector((s) => s.userData.userInfo);
  const { registrationData } = useAppSelector((s) => s.userData);
  const [share, setShare] = useState(false);

  useEffect(() => {
    resetInternetStatus();
  }, []);

  return (
    <div className={styles.mainWrapper}>
      <Image
        src={registrationData?.backgroundImage!}
        alt=''
        sizes='100%'
        fill
        priority
      />
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.qrCodeContainer}>
            <div className={styles.qrHeader}>
              <span className={styles.userId}>{`${t.myID} : ${id ?? ''}`}</span>
            </div>
            <div className={styles.qrBody}>
              <QRCode
                value={registrationData?.baseUrl || ''}
                color='#0074D3'
                size={450}
              />
              <Button
                text={t.shareLink}
                variant='orange'
                onClick={() => {setShare(true)}}
                className={styles.shareButton}
              />
              <Button
                text={t.copyLink}
                variant='orange'
                onClick={() => handleCopy(registrationData?.baseUrl ?? '', translatedToastMessage)}
                className={styles.copyButton}
              />
            </div>
          </div>
        </div>
        <motion.div
          whileTap={{ scale: 0.9 }}
          className={styles.closeBtn}
          onClick={() => router.back()}
        >
          <Image
            src={images.exit_modal}
            alt='close-btn'
            width={132}
            height={132}
            quality={100}
          />
        </motion.div>
      </div>
      <AnimatePresence>
        {share && (
          <ShareQr
            value2={registrationData?.baseUrl2 ?? ''}
            click={() => {
              setShare(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QR;
