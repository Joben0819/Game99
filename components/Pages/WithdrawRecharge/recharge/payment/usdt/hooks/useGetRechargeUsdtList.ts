import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { getRechargeUsdtList } from '@/services/api';
import { TUsdtListData } from '@/services/response-type';

import { initialRechargeList } from '../constants';

export const useGetRechargeUsdtList = () => {
  const [rechargeList, setRechargeList] = useState<TUsdtListData[]>(initialRechargeList);

  useEffect(() => {
    const fetchRechargeUsdtList = async () => {
      try {
        const { data, code, msg } = await getRechargeUsdtList();
        if (code !== 200) return toast.error(msg);
        if (!data) return toast.error('USDT List currently unavailable. Try again later.');
        setRechargeList(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRechargeUsdtList();
  }, []);

  return rechargeList;
};
