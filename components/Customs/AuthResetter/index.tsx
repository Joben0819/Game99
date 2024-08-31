'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetAppDataWithExceptions } from '@/reducers/appData';
import { useWithDispatch } from '@/hooks/useWithDispatch';

const AuthResetter = () => {
  const dispatch = useDispatch();
  const { getAccountUserInfo } = useWithDispatch();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const code = searchParams.get('code');

  useEffect(() => {
    if (!(pathname === '/pinduoduo' || pathname === '/recharge-bonus' || pathname === '/roulette')) {
      if (code === '401') {
        // dispatch(setShowAuthPromptModal(true));
      }

      const token = localStorage.getItem('token');
      if (!token) {
        dispatch(resetAppDataWithExceptions());
      } else {
        pathname !== '/' && getAccountUserInfo();
      }
    }
  }, [code]);

  return null;
};

export default AuthResetter;
