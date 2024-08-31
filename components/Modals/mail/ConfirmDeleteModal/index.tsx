import { Dispatch, FC, SetStateAction } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type ConfirmDeleteModalProps = {
  showConfirmDelete: boolean;
  setShowConfirmDelete: Dispatch<SetStateAction<boolean>>;
  deleteMany: () => void;
};

const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({ showConfirmDelete, setShowConfirmDelete, deleteMany }) => {
  const t = useTranslations().mail;

  return (
    <AnimatePresence>
      {showConfirmDelete && (
        <motion.div
          className={styles.deleteModalWrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
          }}
        >
          <motion.div
            className={styles.deleteModal}
            initial={{ y: '50vh' }}
            animate={{ y: 0 }}
            exit={{ y: '50vh' }}
          >
            <span className={styles.modalHeader}>{t.delete}</span>
            <span className={styles.modalContent}>{t.deleteMany}</span>
            <div className={styles.modalControls}>
              <motion.span
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowConfirmDelete(false)}
              >
                {t.cancel}
              </motion.span>
              <motion.span
                whileTap={{ scale: 0.9 }}
                onClick={deleteMany}
              >
                {t.ok}
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
