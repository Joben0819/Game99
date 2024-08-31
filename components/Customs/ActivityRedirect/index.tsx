'use client';

import { notFound, redirect, useSearchParams } from 'next/navigation';
import { FC, useEffect } from 'react';

type ActivityRedirectProps = { activity: 'pinduoduo' | 'recharge-bonus' | 'roulette' };

const ActivityRedirect: FC<ActivityRedirectProps> = ({ activity }) => {
  const params = useSearchParams();

  useEffect(() => {
    const domain = window.location.origin;

    const token = params.get('token');
    const lang = params.get('lang');
    const isWindow = params.get('isWindow');

    if (!token && !lang) {
      return notFound();
    } else {
      let newUrl = `${domain}/${lang}/${activity}?token=${token}`;
      if (isWindow) {
        newUrl += '&isWindow=1';
      }
      redirect(newUrl);
    }
  }, [params]);

  return null;
};

export default ActivityRedirect;
