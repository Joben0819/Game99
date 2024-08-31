import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal, setPageLoad } from '@/reducers/appData';
import { updateProfilePicture } from '@/services/api';
import Button from '@/components/Customs/Button';
import { useAppDispatch, useAppSelector } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import styles from '../index.module.scss';

const ConfirmAvatarButton = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations().changeAvatar;
  const { getAccountUserInfo } = useWithDispatch();
  const [isSameId, setIsSameId] = useState(false);
  const {
    profileIdToSet,
    userInfo: { headImgId },
  } = useAppSelector((state) => state.userData);

  useEffect(() => {
    setIsSameId(true);
    return () => {
      dispatch(setPageLoad(false));
    };
  }, []);

  useEffect(() => {
    setIsSameId(profileIdToSet === +headImgId);
  }, [headImgId, profileIdToSet]);

  const handleConfirmAvatarChange = () => {
    if (profileIdToSet) {
      setProfileAvatar(profileIdToSet);
      dispatch(setActiveModal(DATA_MODAL.CLOSE));
      dispatch(setPageLoad(true));
    }
  };

  const setProfileAvatar = (profileId: number | null) => {
    dispatch(setPageLoad(true));
    if (!!profileId) {
      updateProfilePicture(profileId).then((res) => {
        if (res?.data?.code === 200) {
          getAccountUserInfo();
          dispatch(setPageLoad(false));
          toast.success('Avatar updated', { id: 'avatar-updated' });
        } else if (res?.data?.code === 500) {
          toast.success('Error updating avatar', { id: 'error-updating-avatar' });
          dispatch(setPageLoad(false));
        }
      });
    }
  };

  return (
    <Button
      text={t.confirm}
      variant='orange'
      onClick={handleConfirmAvatarChange}
      className={classNames({ [styles.grayscale]: !profileIdToSet || isSameId  })}
      disabled={!profileIdToSet || isSameId}
    />
  );
};

export default ConfirmAvatarButton;
