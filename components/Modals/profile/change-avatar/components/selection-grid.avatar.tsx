import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setProfileIdToSet } from '@/reducers/userData';
import { getProfilePictureList } from '@/services/api';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import styles from '../index.module.scss';
import { TAvatar } from '@/services/types';

const AvatarSelectionGrid = () => {
  const dispatch = useDispatch();
  const { userInfo: { headImgId } } = useAppSelector((state) => state.userData);
  const [currentSelectedAvatar, setCurrentSelectedAvatar] = useState<TAvatar>();
  const [avatarList, setAvatarList] = useState<Array<TAvatar>>([]);
  const [selected, setSelected] = useState<number>();

  useEffect(() => {
    getPictureList();
  }, []);

  useEffect(() => {
    const currentSelectedId = avatarList.find((avatar) => avatar.id === +headImgId);
    if (!!currentSelectedId) {
      setCurrentSelectedAvatar(currentSelectedId);
    }
  }, [avatarList]);

  useEffect(() => {
    if (!!currentSelectedAvatar) {
      setSelected(avatarList.findIndex((avatar) => avatar === currentSelectedAvatar));
    }
  }, [currentSelectedAvatar]);

  const handleClickAvatarItem = (avatar: TAvatar, index: number) => {
    setCurrentSelectedAvatar(avatar);
    setSelected(index);
    dispatch(setProfileIdToSet(avatar.id));
  };

  const getBaseUrl = (url: string) => {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
  }

  const getPictureList = () => {
    getProfilePictureList()
    .then(res => {
      const normalizedData = res?.data?.data?.map((avatar: TAvatar) => {
        const imageBaseUrl = getBaseUrl(avatar.icon);
        if (!avatar.icon.startsWith(imageBaseUrl)) {
          return { ...avatar, icon: `${imageBaseUrl}${avatar.icon}` };
        }
        return avatar;
      });
      setAvatarList(normalizedData);
    }).catch(err => console.error(err));
  }

  return (
    <div className={styles.avatarSelectionGrid}>
      {avatarList && avatarList.map((avatar, index) => {
        return (
          <motion.div
            className={styles.avatar}
            whileTap={{ scale: 0.9 }}
            key={avatar.id}
            onClick={() => handleClickAvatarItem(avatar, index)}
          >
            <Image
              width={208}
              height={224}
              quality={100}
              src={images.avatar_border}
              style={{filter: `${index !== selected ? 'grayscale(1)' : ''}`}}
              alt="Avatar border"
            />
            <Image width={208} height={224} quality={100} src={`${avatar.icon}`} alt="Avatar item" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default AvatarSelectionGrid;
