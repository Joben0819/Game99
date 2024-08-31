import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal, setSecondModal, setThirdModal } from '@/reducers/appData';
import { TAnnouncementData } from '@/services/response-type';
import { useAppSelector } from '@/store';

export const useAnnouncement = () => {
  const dispatch = useDispatch();
  const { push } = useRouter();
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<TAnnouncementData[]>([]);
  const [activeAnnouncement, setActiveAnnouncement] = useState<number>(0);
  const { secondModal, thirdModal, announcementData } = useAppSelector((state) => state.appData);

  useEffect(() => {
    if (!!announcementData?.length) {
      setActiveAnnouncement(announcementData[0].id);
      setFilteredAnnouncements(announcementData);
    }
  }, [announcementData]);

  const handleActive = (id: number) => {
    setActiveAnnouncement(id);
  };

  const handleClose = () => {
    if (thirdModal === DATA_MODAL.ILUSTRAR) {
      dispatch(setThirdModal(DATA_MODAL.CLOSE));
    } else if (secondModal === DATA_MODAL.ILUSTRAR) {
      dispatch(setSecondModal(DATA_MODAL.CLOSE));
    } else {
      dispatch(setActiveModal(DATA_MODAL.CLOSE));
      push('/withdraw');
    }
  };

  return { activeAnnouncement, filteredAnnouncements, handleActive, handleClose };
};
