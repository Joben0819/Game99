import { useEffect } from 'react';
import { resetSideNotification } from '@/reducers/appData';
import { debounce } from 'lodash-es';
import { useAppDispatch, useAppSelector } from '@/store';
import useOpenGame from '@/hooks/useOpenGame';

const defaultNotification = {
  content: '{}',
  devices: '',
  notificationType: '',
  title: '',
};

export const useSideNotification = () => {
  const dispatch = useAppDispatch();
  const { openGame } = useOpenGame();
  const notification = useAppSelector((state) => state.appData?.sideNotification) || defaultNotification;

  useEffect(() => {
    return () => {
      dispatch(resetSideNotification());
    };
  }, [dispatch]);

  useEffect(() => {
    if (notification.title) {
      setTimeout(() => dispatch(resetSideNotification()), 8000);
    }
  }, [notification.title]);

  const parsedNotification = {
    ...notification,
    content: notification.content ? JSON.parse(notification.content) : '',
  };

  const handleClick = debounce((id: string) => { openGame(id) }, 500);

  return { parsedNotification, handleClick };
};