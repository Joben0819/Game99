import { useEffect, useState } from 'react';
import { MODAL_BG_ANIMATION } from '@/constants/app';
import { DATA_MODAL, VERIFICATION_METHOD } from '@/constants/enums';
import { setActiveModal, setSecondModal } from '@/reducers/appData';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import { hasAnnounceJumpType, hasEventJumpType } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import { Bind } from '../bind';
import { LinkSuccess } from '../link-success';
import { SetPassword } from '../set-password';
import SMSVerification from '../sms-verification';
import styles from './index.module.scss';

const ProfileForm = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations().bindEmail;
  const [bindFormTitle, setBindFormTitle] = useState('');
  const { activeModal } = useAppSelector((state) => state.appData);
  const { userInfo } = useAppSelector((state) => state.userData);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCounting, setIsCounting] = useState(false);
  const [countryCode, setCountryCode] = useState('+62');
  const [view, setView] = useState<string>(
    (sessionStorage.getItem('Authenticacao') && userInfo?.phone !== null && 'success') || 'bind',
  );
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [verificationMethod, setVerificationMethod] = useState(VERIFICATION_METHOD.SMS);

  useEffect(() => {
    if (activeModal === 'bind_email') {
      setBindFormTitle(`${t.modalTitle}`);
    }
    if (activeModal === 'bind_phone') {
      setBindFormTitle('Autenticação');
    }
  }, []);

  useEffect(() => {
    if (activeModal === DATA_MODAL.BIND_EMAIL || activeModal === DATA_MODAL.BIND_GOOGLE_EMAIL_BONUS) {
      if (!userInfo?.email?.length) {
        setView('bind');
      } else {
        setView('success');
      }
    }
    if (activeModal === DATA_MODAL.BIND_PHONE) {
      if (!userInfo?.phone?.length) {
        setView('bind');
      } else {
        setView('success');
      }
    }
  }, [userInfo]);

  const onCloseBtn = () => {
    const isFromBanner = localStorage.getItem('from-banner') === '1';
    if (!sessionStorage.getItem('Authenticacao') && !isFromBanner) {
      if (view === 'bind' && activeModal === DATA_MODAL.BIND_EMAIL) {
        dispatch(setActiveModal(DATA_MODAL.CLOSE));
      } else if (view === 'password' && activeModal === DATA_MODAL.BIND_EMAIL) {
        dispatch(setActiveModal(DATA_MODAL.CLOSE));
      } else {
        dispatch(setActiveModal(DATA_MODAL.CLOSE));

        if (hasEventJumpType()) {
          dispatch(setActiveModal(DATA_MODAL.ACTIVITIES));
        } else if (hasAnnounceJumpType()) {
          dispatch(setActiveModal(DATA_MODAL.CLOSE));
          dispatch(setSecondModal(DATA_MODAL.OTHER_ANNOUNCEMENT));
          sessionStorage.removeItem('announceJumpType');
        }
      }
    } else {
      dispatch(setActiveModal(DATA_MODAL.CLOSE));
      sessionStorage.removeItem('Authenticacao');
      localStorage.removeItem('from-banner');
    }
  };

  const getInputtedEmail = (email: string) => {
    localStorage.setItem('inputtedEmail', email);
  };

  const getOneTimePass = (token: string) => {
    localStorage.setItem('oneTimePass', token);
  };

  return (
    <div className={styles.modalWrapper}>
      <AnimatePresence>
        {showVerification && (
          <motion.div
            variants={MODAL_BG_ANIMATION}
            initial='hidden'
            animate='visible'
            exit='exit'
            className={styles.smsWrapper}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.4,
                  delay: 0.5,
                },
              }}
              exit={{ scale: 0 }}
              className={styles.smsContainer}
            >
              <SMSVerification
                setShowVerification={setShowVerification}
                phoneNumber={phoneNumber}
                countryCode={countryCode}
                setIsCounting={setIsCounting}
                isCounting={isCounting}
                setVerificationMethod={setVerificationMethod}
                verificationMethod={verificationMethod}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.modalContainer}>
        <motion.div
          whileTap={{ scale: 0.9 }}
          className={styles.closeBtn}
          onClick={onCloseBtn}
        />
        {view === 'bind' && (
          <>
            <Bind
              setView={setView}
              currentView={view}
              getInputtedEmail={getInputtedEmail}
              getOneTimePass={getOneTimePass}
              setShowVerification={setShowVerification}
              setPhoneNumber={setPhoneNumber}
              phoneNumber={phoneNumber}
              setIsCounting={setIsCounting}
              isCounting={isCounting}
              setCountryCode={setCountryCode}
              countryCode={countryCode}
            />
          </>
        )}
        {view === 'password' && (
          <SetPassword
            formTitle={bindFormTitle}
            setView={setView}
            currentView={view}
          />
        )}
        {view === 'success' && <LinkSuccess />}
      </div>
    </div>
  );
};

export default ProfileForm;
