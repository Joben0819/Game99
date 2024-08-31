'use client';

import { useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './error.module.scss';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations().common;

  useEffect(() => {
    console.error('APP ERROR', error);
  }, [error]);

  return (
    <div className={styles.error}>
      <div className={styles.error__background}>
        <h1
          className={styles.error__title}
          data-textafter={t.appError}
        >
          {t.appError}
        </h1>
        <div className={styles.error__content}>
          <p>{t.appErrorRetry}</p>
        </div>
        <div className={styles.error__buttonContainer}>
          <div
            className={styles.error__toSupport}
            onClick={() => reset()}
          >
            {t.retry}
          </div>
        </div>
      </div>
    </div>
  );
}
