'use client';

import { usePathname } from 'next/navigation';
import { memo, useEffect } from 'react';
import { MODAL_CONTENT_ANIMATION } from '@/constants/app';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import Modal from './Modals';
import styles from './index.module.scss';

const PortalModal = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token') ?? '';
  const userID = useAppSelector((state) => state.userData.userInfo.id);
  const { activeModal, secondModal, thirdModal, fourthModal } = useAppSelector((state) => state.appData);
  const isPinduoduoInviteModal = fourthModal === DATA_MODAL.PINDUODUO && pathname.includes('invite');

  // useEffect(() => {
  //   localStorage.removeItem('prev-modal');
  // }, []);

  useEffect(() => {
    if (!token || !userID) dispatch(setActiveModal(DATA_MODAL.CLOSE));
  }, [userID]);

  if (
    pathname.includes('pinduoduo') ||
    window.location.pathname.includes('recharge-bonus') ||
    window.location.pathname.includes('roulette')
  )
    return;

  const exitAnimation = () => {
    if (isPinduoduoInviteModal) {
      return {
        opacity: 0,
        transition: {
          duration: 0.3,
          delay: 0.5,
        },
      };
    }

    return 'exit';
  };

  const RenderPortal = (modal: string, zIndex: string, modalType: string) => {
    return (
      <motion.div
        variants={MODAL_CONTENT_ANIMATION}
        initial='hidden'
        animate='visible'
        exit={exitAnimation()}
        className={styles.modal}
        key={modalType === DATA_MODAL.PINDUODUO ? modalType : undefined}
      >
        <Modal modalType={modalType} />
      </motion.div>
    );
  };

  const isModalActive = fourthModal || thirdModal || secondModal || activeModal;

  return (
    <div
      className={classNames(styles.modalWrapper, {
        [styles['modalWrapper--show']]: isModalActive,
        [styles['modalWrapper--blurred']]: isPinduoduoInviteModal,
      })}
    >
      <AnimatePresence>
        {(() => {
          if (fourthModal) {
            return RenderPortal('fourthModal', '13', fourthModal);
          }
          if (thirdModal && !fourthModal) {
            return RenderPortal('thirdModal', '12', thirdModal);
          }
          if (secondModal && !thirdModal && !fourthModal) {
            return RenderPortal('secondModal', '11', secondModal);
          }
          if (activeModal && !secondModal && !thirdModal && !fourthModal) {
            return RenderPortal('firstModal', '10', activeModal);
          }

          return null;
        })()}
      </AnimatePresence>
    </div>
  );
};

export default memo(PortalModal);
