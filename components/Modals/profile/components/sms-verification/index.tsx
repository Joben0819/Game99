import Image from 'next/image';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { VERIFICATION_METHOD } from '@/constants/enums';
import { sendSmsVerifyCode, sendWhatsAppVerificationCode } from '@/services/api';
import { motion } from 'framer-motion';
import HeaderTitle from '@/components/Customs/HeaderTitle';
import NECaptchaComponent from '@/components/Modals/Captcha/NECaptchaComponent';
import { useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type SMSVerificationProps = {
  phoneNumber: string;
  countryCode: string;
  isCounting: boolean;
  verificationMethod: string;
  setIsCounting: React.Dispatch<React.SetStateAction<boolean>>;
  setShowVerification: React.Dispatch<React.SetStateAction<boolean>>;
  setVerificationMethod: React.Dispatch<React.SetStateAction<VERIFICATION_METHOD>>;
};

const SMSVerification: FC<SMSVerificationProps> = ({
  phoneNumber,
  countryCode,
  isCounting,
  verificationMethod,
  setIsCounting,
  setShowVerification,
  setVerificationMethod,
}) => {
  const t = useTranslations();
  const { initData } = useAppSelector((state) => state.appData);
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);

  const handleCaptchaFailure = (err: any) => {
    toast.error(t.toasts.captchaFailed);
  };

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); //disables the modal from closing when clicked
  };

  const phoneVerificationMethod = (method: VERIFICATION_METHOD) => {
    localStorage.setItem('verificationMethod', method);
    if (initData?.actionSwitch === '1') {
      setShowCaptcha(true);
    } else {
      handleCaptchaSuccess({ method });
    }
  };

  const handleCaptchaSuccess = (data: { validate?: string; method: VERIFICATION_METHOD }) => {
    const validate = data?.validate;
    if (data.method === VERIFICATION_METHOD.WHATSAPP) {
      sendWhatsAppVerificationCode({ number: countryCode + phoneNumber, ...(validate ? { validate } : {}) }).then(
        (res) => {
          if (res.data.code === 200) {
            toast.success(t.toasts.verificationCodeSent);
            if (!isCounting) {
              setIsCounting(true);
            }
            setShowVerification(false);
          } else {
            toast.error(res?.data?.msg);
          }
          setVerificationMethod(VERIFICATION_METHOD.WHATSAPP);
        },
      );
    } else {
      sendSmsVerifyCode({ phone: countryCode + phoneNumber, ...(validate ? { validate } : {}) }).then((res) => {
        if (res.data.code === 200) {
          toast.success(t.toasts.verificationCodeSent);
          if (!isCounting) {
            setIsCounting(true);
          }
          setShowVerification(false);
        } else {
          toast.error(res?.data?.msg);
        }

        setVerificationMethod(VERIFICATION_METHOD.SMS);
      });
    }
  };

  return (
    <>
      {showCaptcha && (
        <NECaptchaComponent
          onSuccess={handleCaptchaSuccess}
          onFailure={handleCaptchaFailure}
          captchaId={initData?.captchaId ?? ''}
          showCaptcha={showCaptcha}
          setShowCaptcha={setShowCaptcha}
        />
      )}
      <div
        className={styles.modalWrapper}
        onClick={() => setShowVerification(false)}
      >
        <div
          className={styles.modalContainer}
          onClick={handleContainerClick}
        >
          <HeaderTitle
            className={styles.headerTitle}
            text={t.login.selectVerificationMethod}
            size={20}
          />
          <div className={styles.buttonContainer}>
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={styles.buttonIcon}
              onClick={() => {
                phoneVerificationMethod(VERIFICATION_METHOD.WHATSAPP);
              }}
            >
              <Image
                src={images.profile_whatsAPP_icon}
                alt='whatsApp_icon'
                sizes='100'
                fill
              />
            </motion.div>

            <span
              onClick={() => {
                phoneVerificationMethod(VERIFICATION_METHOD.SMS);
              }}
            >
              {t.bindPhone.no_whatsapp}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SMSVerification;
