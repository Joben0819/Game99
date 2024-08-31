import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { CONTENT_BY_JUMPTYPE } from '@/constants/app';
import { ANNOUNCEMENT_TYPE, DATA_MODAL, JUMP_TYPE } from '@/constants/enums';
import { setActiveModal, setDialogCount, setOtherAnnouncementCount, setSecondModal } from '@/reducers/appData';
import { setPageLoad } from '@/reducers/appData';
import { TAnnouncementTypes } from '@/services/response-type';
import classNames from 'classnames';
import CloseButton from '@/components/Customs/CloseButton';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { useAppDispatch, useAppSelector } from '@/store';
import { isValidURL } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import PartnersModal from '../Partners';
import ContentImage from './ContentImage';
import ContentOnly from './ContentOnly';
import ImageOnly from './ImageOnly';
import styles from './index.module.scss';

const AnnouncementComponent = () => {
  const router = useRouter();
  const t = useTranslations().toasts;
  const dispatch = useAppDispatch();
  const [announcementData, setAnnouncementData] = useState<TAnnouncementTypes[]>([]);
  const [isBgLoaded, setIsBgLoaded] = useState<boolean>(false);
  const [clickedAnnouncement, setClickedAnnouncement] = useState<string | null>(
    sessionStorage.getItem('prev-announceClicked') ?? null,
  );
  const { otherAnnouncementCount: count, otherDialogAnnouncementsData } = useAppSelector((state) => state.appData);
  const [activeAnnouncement, setActiveAnnouncement] = useState<TAnnouncementTypes>(announcementData[count]);
  const [announcementType, setAnnouncementType] = useState<string>(ANNOUNCEMENT_TYPE.CONTENT_IMAGE);

  const filteredAnnouncementData = useMemo(() => {
    return otherDialogAnnouncementsData?.filter((announcement) => {
      if (
        announcement.showType === 'DIALOG' &&
        ((announcement.jumpType && Object.prototype.hasOwnProperty.call(CONTENT_BY_JUMPTYPE, announcement.jumpType)) ||
          announcement.activityTypeId) &&
        !!announcement.image
      ) {
        return true;
      }

      if (announcement.showType === 'DIALOG' && announcement.jumpType === JUMP_TYPE.INVITER) {
        return true;
      }

      return false;
    });
  }, [otherDialogAnnouncementsData]);

  useEffect(() => {
    if (!filteredAnnouncementData?.length) return;
    const prevClicked = sessionStorage.getItem('prev-announceClicked');
    dispatch(setDialogCount(filteredAnnouncementData));

    if (!!filteredAnnouncementData?.length) {
      if (prevClicked && clickedAnnouncement === null) {
        setActiveAnnouncement(filteredAnnouncementData[+prevClicked]);
        dispatch(setOtherAnnouncementCount(+prevClicked));
      } else {
        setActiveAnnouncement(filteredAnnouncementData[clickedAnnouncement != null ? +clickedAnnouncement : count]);
      }
      setAnnouncementData(filteredAnnouncementData);
    }

    setTimeout(() => {
      localStorage.removeItem('announceClicked');
    }, 200);

    return () => {
      dispatch(setPageLoad(false));
    };
  }, [filteredAnnouncementData]);

  useEffect(() => {
    if (localStorage.getItem('announceClicked')) {
      setClickedAnnouncement(localStorage.getItem('announceClicked') ?? null);
    }
  }, [localStorage.getItem('announceClicked')]);

  useEffect(() => {
    setTimeout(() => setIsBgLoaded(true), 500);
    //0: image only, 1: no image provide local with content, 2: Image with content 3: INVITER (partners)
    if (
      !!!activeAnnouncement?.content &&
      activeAnnouncement?.image &&
      activeAnnouncement?.jumpType !== JUMP_TYPE.INVITER
    ) {
      setAnnouncementType(ANNOUNCEMENT_TYPE.IMAGE);
    } else if (
      activeAnnouncement?.content &&
      !!!activeAnnouncement?.image &&
      activeAnnouncement?.jumpType !== JUMP_TYPE.INVITER
    ) {
      setAnnouncementType(ANNOUNCEMENT_TYPE.CONTENT);
    } else if (
      activeAnnouncement?.content &&
      activeAnnouncement?.image &&
      activeAnnouncement?.jumpType !== JUMP_TYPE.INVITER
    ) {
      setAnnouncementType(ANNOUNCEMENT_TYPE.CONTENT_IMAGE);
    } else if (activeAnnouncement?.jumpType === JUMP_TYPE.INVITER) {
      setAnnouncementType(ANNOUNCEMENT_TYPE.PARTNERS);
    } else {
      // dispatch(setSecondModal(DATA_MODAL.CLOSE));
      setAnnouncementType(ANNOUNCEMENT_TYPE.CONTENT);
    }
  }, [activeAnnouncement]);

  const handleCloseBtnModal = () => {
    // localStorage.removeItem('prev-modal');
    if (localStorage.getItem('header-announce-btn-clicked')) {
      localStorage.removeItem('header-announce-btn-clicked');
      dispatch(setActiveModal(DATA_MODAL.CLOSE));
      return;
    }

    if (count === announcementData.length - 1) {
      localStorage.removeItem('recent-modal');
      dispatch(setActiveModal(DATA_MODAL.CLOSE));
    }

    setIsBgLoaded(false);
    if (sessionStorage.getItem('prev-announceClicked')) {
      sessionStorage.removeItem('prev-announceClicked');
      localStorage.removeItem('prev-modal');
    }

    if (clickedAnnouncement) {
      dispatch(setOtherAnnouncementCount(count + 1));
      setActiveAnnouncement(announcementData[count + 1]);
      if (count + 1 === announcementData.length) {
        dispatch(setSecondModal(DATA_MODAL.CLOSE));
        localStorage.removeItem('recent-modal');
        setClickedAnnouncement(null);
      }
      localStorage.removeItem('prev-modal');
    } else {
      dispatch(setOtherAnnouncementCount(count + 1));
      setActiveAnnouncement(announcementData[count + 1]);
      if (count + 1 === announcementData.length) {
        localStorage.removeItem('recent-modal');
        localStorage.removeItem('prev-modal');
        dispatch(setSecondModal(DATA_MODAL.CLOSE));
      }
    }
  };

  const setJumpActivity = useCallback(() => {
    const announcement = activeAnnouncement;
    if (announcement) {
      if (announcement.jumpType) {
        sessionStorage.setItem('announceJumpType', announcement.jumpType);
        localStorage.setItem('announceClicked', count.toString());
        sessionStorage.setItem('prev-announceClicked', count.toString());

        const active = CONTENT_BY_JUMPTYPE[announcement?.jumpType];

        if (active === 'recharge-page') {
          dispatch(setSecondModal(DATA_MODAL.CLOSE));
          localStorage.setItem('recent-modal', DATA_MODAL.OTHER_ANNOUNCEMENT);
          dispatch(setPageLoad(true));
          router.push('/recharge');
        } else if (active === 'external') {
          if (announcement?.url && isValidURL(announcement?.url)) {
            window.open(announcement?.url, '_blank');
          } else {
            sessionStorage.removeItem('announceJumpType');
            localStorage.removeItem('announceClicked');
            toast.error(t.invalidUrl);
          }
        } else if (active === 'referral-page') {
          dispatch(setSecondModal(DATA_MODAL.CLOSE));
          localStorage.setItem('recent-modal', DATA_MODAL.OTHER_ANNOUNCEMENT);
          router.push('/invite');
        } else {
          dispatch(setSecondModal(DATA_MODAL.CLOSE));
          dispatch(setActiveModal(active));
        }

        return;
      }

      if (announcement.activityTypeId) {
        localStorage.setItem('banner-clicked', String(announcement.activityTypeId));
        localStorage.setItem('prev-modal', DATA_MODAL.OTHER_ANNOUNCEMENT);
        sessionStorage.setItem('prev-announceClicked', count.toString());
        dispatch(setSecondModal(DATA_MODAL.CLOSE));
        dispatch(setActiveModal(DATA_MODAL.ACTIVITIES));
      }
    }
  }, [activeAnnouncement]);

  return (
    <div className={styles.announcementWrapper}>
      {!isBgLoaded && (
        <div className={classNames(styles.modal, '!opacity-100')}>
          <LoadingIcon />
        </div>
      )}
      {isBgLoaded && (
        <div
          className={classNames(styles.modal, {
            [styles.isLoaded]: isBgLoaded,
          })}
        >
          <div
            className={styles.closeBtn}
            onClick={handleCloseBtnModal}
            data-announcement-type={announcementType}
          >
            <CloseButton
              quality={100}
              className={`btn ${styles.closeBtn}`}
            />
          </div>

          {announcementType === ANNOUNCEMENT_TYPE.IMAGE && (
            <ImageOnly
              announcement={activeAnnouncement}
              setJumpActivity={setJumpActivity}
            />
          )}
          {announcementType === ANNOUNCEMENT_TYPE.CONTENT && (
            <ContentOnly
              announcement={activeAnnouncement}
              setJumpActivity={setJumpActivity}
            />
          )}
          {announcementType === ANNOUNCEMENT_TYPE.CONTENT_IMAGE && (
            <ContentImage
              announcement={activeAnnouncement}
              setJumpActivity={setJumpActivity}
            />
          )}
          {announcementType === ANNOUNCEMENT_TYPE.PARTNERS && (
            <PartnersModal
              announcement={activeAnnouncement}
              count={count}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AnnouncementComponent;
