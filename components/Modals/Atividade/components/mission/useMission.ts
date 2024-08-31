import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { COLLECT_STATUS, COLLECT_TYPE } from '@/constants/enums';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import { useClaimMissionRewardMutation } from '../../index.rtk';

export const useMission = ({ onShowPopUp }: { onShowPopUp: (amount: number, message: string) => void }) => {
  const { push } = useRouter();
  const { getAccountBalance } = useWithDispatch();
  const [claimMissionReward, { isLoading: isCollecting }] = useClaimMissionRewardMutation();

  const collectReward = useCallback(async (id: string, status: string, amount: number, type: number) => {
    if (status === COLLECT_STATUS.FINISHED) {
      const ip = localStorage.getItem('ip');

      if (ip && id) {
        const result: any = await claimMissionReward({
          ip,
          id: id,
        });

        if (result?.data?.code === 200) {
          if (type === COLLECT_TYPE.CONTENT) onShowPopUp(amount, result?.data?.msg ?? '');
          else toast.success(result?.data?.msg, { id: 'success' });
          getAccountBalance();
        } else {
          toast.error(result?.data?.msg);
        }
      }
    }

    if (status === COLLECT_STATUS.ON_GOING) push('/recharge');
  }, []);

  return { isCollecting, collectReward };
};
