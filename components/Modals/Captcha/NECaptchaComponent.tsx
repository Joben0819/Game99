'use client';

import { Dispatch, FC, SetStateAction, useEffect, useRef } from 'react';
import initNECaptcha from '@/scripts/yidun-captcha';
import { isMobilePlatform } from '@/utils/helpers';
import styles from './NECaptchaComponent.module.scss';

type NECaptchaComponentProps = {
  onSuccess: (data: any) => void;
  onFailure: (error: any) => void;
  captchaId?: string;
  showCaptcha?: boolean;
  setShowCaptcha: Dispatch<SetStateAction<boolean>>;
};

const NECaptchaComponent: FC<NECaptchaComponentProps> = ({
  onSuccess,
  onFailure,
  captchaId,
  showCaptcha,
  setShowCaptcha,
}) => {
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  let captchaInstance: any = null;

  useEffect(() => {
    if (captchaId && showCaptcha) {
      initNECaptcha(
        {
          captchaId,
          element: '#captchaContainer',
          mode: 'embed',
          width: '6.2rem',
          apiVersion: 2,
          customStyles: {
            imagePanel: {
              borderRadius: 10,
            },
            controlBar: {
              textColor: '#8e91aa',
              borderColor: '#dfe1ea',
              borderColorMoving: '#dfe1ea',
              borderColorSuccess: '#dfe1ea',
              borderColorError: '#dfe1ea',
              background: '#f0f2f4',
              backgroundMoving: 'linear-gradient(270deg, rgba(55, 73, 233, 0.48) 0%, rgba(55, 73, 233, 0.08) 100%)',
              backgroundSuccess:
                'linear-gradient(270deg, rgba(35, 196, 148, 0.48) 14.18%, rgba(35, 196, 148, 0.08) 100%)',
              backgroundError: 'linear-gradient(270deg, rgba(215, 80, 80, 0.48) 0%, rgba(215, 80, 80, 0.08) 100%)',
              height: 40,
              borderRadius: 10,
              slideIcon: 'https://yidunfe.nos-jd.163yun.com/moving1669028036380.png',
              slideIconMoving: 'https://yidunfe.nos-jd.163yun.com/moving1669028036380.png',
              slideIconSuccess: 'https://yidunfe.nos-jd.163yun.com/success1669028036503.png',
              slideIconError: 'https://yidunfe.nos-jd.163yun.com/error1669028036362.png',
            },
          },
          onVerify: (err: any, data: any) => {
            if (err) return;
            const verificationMethod = localStorage.getItem('verificationMethod');
            onSuccess({ validate: data.validate, method: verificationMethod });
            setShowCaptcha(false);
          },
        },
        function onload(instance: any) {
          captchaInstance = instance;
        },
        function onerror(err: any) {
          console.error('NECaptcha initialization failed:', err);
          onFailure(err);
        },
      );
    }

    // Cleanup function
    return () => {
      localStorage.removeItem('verificationMethod');
      if (captchaInstance) {
        captchaInstance.destroy();
        captchaInstance = null;
      }
    };
  }, [onSuccess, onFailure, captchaId]);

  return showCaptcha ? (
    <div className={styles.captchaWrapper}>
      <div
        className={styles.backdrop}
        onClick={() => setShowCaptcha(false)}
      />
      <div
        className={isMobilePlatform() ? styles.rotated : ''}
        id="captchaContainer"
        ref={captchaContainerRef}
      />
    </div>
  ) : null;
};

export default NECaptchaComponent;
