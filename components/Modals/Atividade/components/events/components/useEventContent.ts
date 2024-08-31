import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CONTENT_BY_JUMPTYPE } from '@/constants/app';
import { DATA_MODAL, EVENT_TYPES } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { setActiveInviteContent, setPageLoad } from '@/reducers/appData';
import { TEvents } from '@/services/types';
import { useAppDispatch } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import { DisplayProps } from './display';

export const useEventContent = ({ events }: Pick<DisplayProps, 'events'>) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslations().affiliate;
  const [selectedEventIDs, setSelectedEventIDs] = useState<number[]>([]);

  useEffect(() => {
    setSelectedEventIDs([]);
  }, [events]);

  useEffect(() => {
    return () => {
      dispatch(setPageLoad(false));
    };
  }, []);

  const handleRedirect = (url: string, recent: string, isRedirecting: boolean, activeContent?: string) => {
    localStorage.setItem('recent-modal', recent);
    dispatch(setPageLoad(isRedirecting));
    router.push(url);
    if (activeContent) dispatch(setActiveInviteContent(activeContent));
  };

  const handleClick = (event: TEvents) => {
    const { type, url, eventJumpType, typeId, id: eventId } = event || {};

    setSelectedEventIDs((selectedEventIDs) => {
      if (selectedEventIDs.includes(eventId)) {
        return selectedEventIDs.filter((id) => id !== eventId);
      } else {
        return [...selectedEventIDs, eventId];
      }
    });

    localStorage.removeItem('banner-clicked');
    sessionStorage.removeItem('eventJumpType');
    if (localStorage.getItem('recent-modal') !== DATA_MODAL.ACTIVITIES) {
      localStorage.removeItem('recent-modal');
    }

    if (type === EVENT_TYPES.TYPE_3) {
      localStorage.setItem('banner-clicked', String(typeId));
      sessionStorage.setItem('eventJumpType', eventJumpType);
      const active = CONTENT_BY_JUMPTYPE[eventJumpType];

      if (active === 'recharge-page') {
        handleRedirect('/recharge', DATA_MODAL.ACTIVITIES, true);
      } else if (active === 'referral-page') {
        localStorage.setItem('eventJumpType', eventJumpType);
        handleRedirect('/invite', DATA_MODAL.ACTIVITIES, true, t.myReferral);
        dispatch(setActiveModal(DATA_MODAL.CLOSE));
      } else {
        if (active) {
          dispatch(setActiveModal(active));
        }
      }

      return false;
    }

    // jumpTo external browser
    if (type === EVENT_TYPES.TYPE_1) {
      url && window.open(url, '_blank');
    }
    // slide down to display bottom content
    else {
      setTimeout(() => {
        document.getElementById(`content-container-${eventId}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 400);
    }

    return;
  };

  return { selectedEventIDs, handleClick };
};
