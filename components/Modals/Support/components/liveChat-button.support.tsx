import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DEFAULT_SUPPORT_LINK } from '@/constants/app';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from '../index.module.scss';

const LiveChatButton = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const router = useRouter();
  const t = useTranslations().support;
  const initData = useAppSelector((state) => state.appData.initData);
  const [link, setLink] = useState<string>(DEFAULT_SUPPORT_LINK);

  useEffect(() => {
    if (initData) {
      const { customerUrl, customerUrl2 } = initData;
      setLink(customerUrl ? customerUrl : customerUrl2);
    }
  }, [initData]);

  const handleClick = () => {
    if (!!link?.length) {
      router.push(link);
    } else {
      if (!!initData?.customerUrl?.length) {
        router.push(initData.customerUrl);
      } else {
        router.push(initData.customerUrl2);
      }
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      className={styles.liveChatBtn}
      onClick={handleClick}
    >
      <div className={styles.chatButtonInner}>
        <div className={styles.iconWrapper}>
          <Image
            src={images.support_icon}
            alt={'support-icon'}
            sizes='100%'
            fill
          />
        </div>
        <p
          data-lang={locale}
          data-textafter={t.buttonText}
        >
          {t.buttonText}
        </p>
      </div>
    </motion.div>
  );
};

export default LiveChatButton;
