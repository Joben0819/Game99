import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash-es';
import { useAppSelector } from '@/store';
import { useGetVipGiftInfoQuery } from '../../../index.rtk';
import { ScrollArrowProps } from './vip-levels';

type ArrowType = Extract<ScrollArrowProps['type'], string>;

export const useVipLevel = ({ onChangeVip }: { onChangeVip: (vip: number) => void }) => {
  const { userInfo } = useAppSelector((state) => state.userData);
  const { data: vipInfo } = useGetVipGiftInfoQuery('');
  const vipRef = useRef<HTMLDivElement | null>(null);
  const [activeLvl, setActiveLvl] = useState<number>(userInfo?.vip ?? 1);
  const [arrowVisible, setArrowVisible] = useState<{ arrowUp?: boolean; arrowDown?: boolean }>({
    arrowUp: true,
    arrowDown: false,
  });

  useEffect(() => {
    if (vipInfo?.vipSetList.length) {
      setTimeout(() => {
        vipRef.current?.scrollTo({
          top: document.getElementById(`vipLvl-${activeLvl}`)!.offsetTop,
          behavior: 'smooth',
        });
      }, 1000);
    }
  }, [vipInfo?.vipSetList]);

  useEffect(() => {
    const handleScroll = () => {
      setArrowVisible({
        arrowUp: vipRef?.current?.scrollTop! === 0,
        arrowDown: vipRef?.current?.clientHeight! + vipRef?.current?.scrollTop! + 5 >= vipRef?.current?.scrollHeight!,
      });
    };

    const debouncedScroll = debounce(handleScroll, 100);
    vipRef.current?.addEventListener('scroll', debouncedScroll);
    return () => {
      vipRef.current?.removeEventListener('scroll', debouncedScroll);
    };
  }, []);

  const handleChangeVip = useCallback((level: number) => {
    setActiveLvl(level);
    onChangeVip(level);
  }, []);

  const handleClickArrow = (type: ArrowType) => {
    let position;

    if (type === 'top') position = vipRef?.current?.scrollTop! - vipRef?.current?.clientHeight!;
    else position = vipRef?.current?.clientHeight! + vipRef?.current?.scrollTop!;

    vipRef.current?.scrollTo({
      top: position,
      behavior: 'smooth',
    });
  };

  return { vipInfo, activeLvl, arrowVisible, vipRef, handleChangeVip, handleClickArrow };
};
