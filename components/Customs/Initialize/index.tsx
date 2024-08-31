'use client';

import { useEffect } from 'react';

import { setInitData, setThirdModal } from '@/reducers/appData';
import { browseInit } from '@/services/api';

import { useAppDispatch, useAppSelector } from '@/store';
import { DATA_MODAL } from '@/constants/enums';
import { isLoggedIn } from '@/utils/helpers';

const Initialize = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.userData);

  useEffect(() => {
    if(isLoggedIn()) return;
    browseInit().then(({ code, data }) => {
      if (code === 200) {
        dispatch(setInitData(data));
        if (data.maintain === '1') {
          dispatch(setThirdModal(DATA_MODAL.ANNOUNCE));
        }
      }
    });
  }, [userInfo.token]);

  return null;
};

export default Initialize;
