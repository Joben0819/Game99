import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { DATA_MODAL } from '@/constants/enums';
import { setCurrentMessage, setMessages, setOpenModal, setActiveModal } from '@/reducers/appData';
import { deleteMultipleMessages, readMessageOnSites } from '@/services/api';
import { TMessageItem } from '@/services/types';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import HeaderTitle from '@/components/Customs/HeaderTitle';
import { useAppSelector } from '@/store';
import { getMailMessages, isLoggedIn } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import Message from './Message';
import MessageOpen from './MessageOpen';
import styles from './index.module.scss';

const currentMessageInitialState: TMessageItem = {
  content: '',
  createTime: '',
  id: 0,
  status: 0,
  title: '',
  type: '',
};

const Mail = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const dispatch = useDispatch();
  const t = useTranslations().mail;
  const { messages, isOpenModal } = useAppSelector((state) => state.appData);
  const [selectAll, setSelectAll] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Array<TMessageItem>>([]);
  const [messageDisabled, setMessageDisabled] = useState(false);
  const selectStyles = { backgroundImage: `url(${selectAll ? images.selected : images.unselected})` };

  useEffect(() => {
    if (!isLoggedIn()) {
      setTimeout(() => {
        dispatch(setActiveModal(DATA_MODAL.LOGIN_MODAL));
      }, 100);
    }
  }, []);

  useEffect(() => {
    setSelectAll(selectedMessages.length === messages.length);
  }, [selectedMessages, messages]);

  const handleClose = () => {
    if (isOpenModal) {
      dispatch(setOpenModal(false));
      return;
    }
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
  };

  const handleOpenMessage = async (msg: TMessageItem) => {
    if (messageDisabled) {
      return;
    }
    setMessageDisabled(true);
    dispatch(setOpenModal(true));
    dispatch(setCurrentMessage(msg));
    if (msg.status === 0) {
      readMessageOnSites({ id: msg.id, type: msg.type });
      const res = await getMailMessages();
      dispatch(setMessages(res));
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const currentDate = new Date();
    const targetDate = new Date(dateString);
    const timeDifference = currentDate.getTime() - targetDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;

    const timeAgoFormatter = (date: number) => `${locale === 'en' && date > 1 ? 's' : ''} ${t.ago}`;

    if (seconds < minute) {
      return `${seconds} ${t.second}${timeAgoFormatter(seconds)}`;
    } else if (seconds < hour) {
      const minutes = Math.floor(seconds / minute);
      return `${minutes} ${t.minute}${timeAgoFormatter(minutes)}`;
    } else if (seconds < day) {
      const hours = Math.floor(seconds / hour);
      return `${hours} ${t.hour}${timeAgoFormatter(hours)}`;
    } else if (seconds < month) {
      const days = Math.floor(seconds / day);
      const week = Math.floor(days / 7);
      const year = Math.floor(days / 365);

      if (days > 7) {
        return `${week} ${t.week}${timeAgoFormatter(week)}`;
      }
      if (days > 365) {
        return `${year} ${t.year}${timeAgoFormatter(year)}`;
      }

      return `${days} ${t.day}${timeAgoFormatter(days)}`;
    } else {
      const months = Math.floor(seconds / month);
      return `${months} ${t.month}${timeAgoFormatter(months)}`;
    }
  };

  const getMsg = async () => {
    const msg = await getMailMessages();
    dispatch(setMessages(msg));
  };

  const handleToggleMessageSelection = (msg: TMessageItem) => {
    const isSelected = selectedMessages.some((selectedMsg) => selectedMsg.id === msg.id);
    if (isSelected) {
      setSelectedMessages((prevSelectedMessages) =>
        prevSelectedMessages.filter((selectedMsg) => selectedMsg.id !== msg.id),
      );
    } else {
      setSelectedMessages((prevSelectedMessages) => [...prevSelectedMessages, msg]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages);
    }
  };

  const deleteMessage = () => {
    const selectedMessageIds: Array<number> = [];
    selectedMessages.forEach((msg: TMessageItem) => selectedMessageIds.push(msg.id));
    deleteMultipleMessages({ ids: selectedMessageIds }).then((res) => {
      setTimeout(() => {
        dispatch(setActiveModal(DATA_MODAL.CLOSE));
        dispatch(setActiveModal(DATA_MODAL.MAIL));
        toast.success(t.successDelete, { id: 'error' });
        dispatch(setCurrentMessage(currentMessageInitialState));
        setSelectedMessages([]);
        getMsg();
      }, 300);
      dispatch(setMessages(res?.data?.data));
    });
  };

  const handleDelete = () => {
    if (selectedMessages.length > 0) {
      setShowConfirmDelete(true);
    }
  };

  const deleteMany = () => {
    deleteMessage();
    setShowConfirmDelete(false);
  };

  return (
    <>
      <ConfirmDeleteModal
        showConfirmDelete={showConfirmDelete}
        deleteMany={deleteMany}
        setShowConfirmDelete={setShowConfirmDelete}
      />

      <div className={styles.modalWrapper}>
        <div className={styles.modalContainer}>
          <div className={styles.bgContainer}>
            <div className={styles.mailBg} />
            <motion.span
              whileTap={{ scale: 0.9 }}
              className={styles.closeBtn}
              onClick={handleClose}
            />
          </div>
          <div className={styles.contents}>
            <div className={styles.topContainer}>
              <HeaderTitle
                text={t.mailTitle}
                size={30}
              />
              <div className={styles.topRight}>
                {messages.length > 0 && (
                  <>
                    <motion.span
                      whileTap={{ scale: 0.9 }}
                      className={styles.radioSelect}
                      onClick={handleSelectAll}
                    >
                      {t.selectAll}
                      <span
                        className={styles.select}
                        style={selectStyles}
                      />
                    </motion.span>
                    <motion.span
                      whileTap={selectedMessages?.length < 1 ? {} : { scale: 0.9 }}
                      className={classNames(styles.deleteBtn, {
                        [styles.isSelectedMsg]: selectedMessages?.length <= 0
                      })}
                      onClick={handleDelete}
                    >
                      {t.delete}
                      <span className={styles.delete} />
                    </motion.span>
                  </>
                )}
              </div>
            </div>
            <>
              {messages && messages.length > 0 ? (
                <div className={styles.pullContainer}>
                  <PullToRefresh
                    className={styles.pullToRefresh}
                    onRefresh={getMsg}
                  >
                    <div className={styles.messageListContainer}>
                      {messages.map((msg) => {
                        return (
                          <Message
                            key={msg.id}
                            msg={msg}
                            selectedMessages={selectedMessages}
                            formatTimeAgo={formatTimeAgo}
                            handleToggleMessageSelection={handleToggleMessageSelection}
                            handleOpenMessage={handleOpenMessage}
                          />
                        );
                      })}
                    </div>
                  </PullToRefresh>
                </div>
              ) : (
                <div className={styles.emptyMail}>
                  <PullToRefresh
                    className={styles.pullToRefresh}
                    onRefresh={getMsg}
                  >
                    <div className={styles.emptyContent}>
                      <div className={styles.emailBg} />
                      <span>{t.noMail}</span>
                    </div>
                  </PullToRefresh>
                </div>
              )}
              <MessageOpen
                handleClose={handleClose}
                setMessageDisabled={setMessageDisabled}
              />
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mail;
