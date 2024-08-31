'use client';

import Image from 'next/image';
import { useState } from 'react';
import { setLoginMethodList } from '@/reducers/appData';
import { newLoginMethods } from '@/services/api';
import classNames from 'classnames';
import HeaderTitle from '@/components/Customs/HeaderTitle';
import { useAppDispatch } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './connectionError.module.scss';

const ConnectionError = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const t = useTranslations().login;

  const refetchLoginMethods = async () => {
    setIsLoading(true);
    const { code, data } = await newLoginMethods();
    if (code === 200) {
      dispatch(setLoginMethodList(data));
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div>
          <HeaderTitle text={t.noConnectionTitle} />
          <p>{t.noConnectionText}</p>
        </div>
        <Image
          src={images.refresh_btn}
          alt='Fetch login methods'
          width={53}
          height={53}
          className={classNames({
            [styles.spin]: isLoading,
          })}
          onClick={refetchLoginMethods}
        />
      </div>
    </div>
  );
};

export default ConnectionError;
