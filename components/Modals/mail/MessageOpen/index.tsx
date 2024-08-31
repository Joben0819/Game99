import { Dispatch, FC, SetStateAction } from 'react';
import { MODAL_ANIMATION } from '@/constants/app';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppSelector } from '@/store';
import { isChineseCharacters } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type MessageOpenProps = {
  handleClose: () => void;
  setMessageDisabled: Dispatch<SetStateAction<boolean>>;
};

const MessageOpen: FC<MessageOpenProps> = ({ handleClose, setMessageDisabled }) => {
  const t = useTranslations().mail;
  const { currentMessage, isOpenModal } = useAppSelector((state) => state.appData);

  const createParagraph = () => {
    return currentMessage?.content?.replace(/\n/g, '<br />');
  };

  return (
    <AnimatePresence onExitComplete={() => setMessageDisabled(false)}>
      {isOpenModal && (
        <motion.div
          variants={MODAL_ANIMATION}
          initial='hidden'
          animate='visible'
          exit='exit'
          className={styles.main}
        >
          <div className={styles.mailContent}>
            <h1
              data-chinese={isChineseCharacters(currentMessage.title)}
              className={styles.mailOpenTitle}
            >
              {currentMessage.title}
            </h1>
            <div
              className={styles.mailOpenContent}
              dangerouslySetInnerHTML={{ __html: createParagraph() }}
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            type='submit'
            className={styles.btnSubmit}
            onClick={handleClose}
          >
            <span>{t.emailOkay}</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessageOpen;
