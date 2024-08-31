import { FC } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { TMessageItem } from '@/services/types';
import { images } from '@/utils/resources';
import { useAppSelector } from '@/store';
import styles from './index.module.scss';

type MessageProps = {
  msg: TMessageItem;
  selectedMessages: TMessageItem[];
  formatTimeAgo: (time: string) => string;
  handleOpenMessage: (msg: TMessageItem) => void;
  handleToggleMessageSelection: (msg: TMessageItem) => void;
};

const Message: FC<MessageProps> = ({
  msg,
  selectedMessages,
  formatTimeAgo,
  handleOpenMessage,
  handleToggleMessageSelection,
}) => {
  const language = useAppSelector((state) => state.appData.language);
  const messageStatusImg = msg.status === 0 ? images.unread : images.read;
  const checkedStatusImg = selectedMessages.some((selectedMsg) => selectedMsg.id === msg.id) ? images.checked : images.unchecked;

  return (
    <>
      <div className={styles.message}>
        <div
          className={styles.messageLeft}
          onClick={() => handleOpenMessage(msg)}
        >
          <span
            className={classNames(styles.mailStatusIcon, { [styles.visible]: msg.status === 0 })}
            style={{ backgroundImage: `url(${messageStatusImg})` }}
          />
          <span className={styles.title}>{msg.title}</span>
        </div>
        <div
          className={styles.messageRight}
          data-lang={language}
        >
          <span className={styles.msgClockIcon} />
          <span className={styles.time}>{formatTimeAgo(msg.createTime)}</span>
          <motion.span
            whileTap={{ scale: 0.9 }}
            className={styles.checkbox}
            style={{ backgroundImage: `url(${checkedStatusImg})` }}
            onClick={() => handleToggleMessageSelection(msg)}
          />
        </div>
      </div>
    </>
  );
};

export default Message;
