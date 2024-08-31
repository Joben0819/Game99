import { FC, useEffect, useState } from 'react';
import { withdrawRechargeDetail } from '@/services/api';
import { TWithdrawRecord } from '@/services/response-type';
import { useTranslations } from '@/hooks/useTranslations';
import RechargeTable from '../rechargeTable';

type OnlineRechargeProps = {
  setIsLoading: (type: boolean) => void;
};

const OnlineRecharge: FC<OnlineRechargeProps> = ({ setIsLoading }) => {
  const t = useTranslations().recharge;
  const [isPulled, setIsPulled] = useState<boolean>(false);
  const [depositRecordData, setDepositRecordData] = useState<TWithdrawRecord[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const headers = [t.columnDate, t.columnTransNumber, t.columnTransAmount, t.columnTransStatus];

  useEffect(() => {
    getRechargeDetails('initial');
  }, []);

  const getRechargeDetails = async (load?: string) => {
    if (load === 'pulled') {
      setIsPulled(true);
    } else {
      setIsLoading(true);
    }

    withdrawRechargeDetail({ type: 'rechargeOnline', pageNum: 1, pageSize: 20 })
      .then((res) => {
        if (res?.data?.code == 200) {
          setDepositRecordData(res?.data?.data);
          setHasNext(res?.data?.hasNext);
        }
      })
      .finally(() => {
        setIsPulled(false);
        setIsLoading(false);
      });
    setPageNum(1);
  };

  const loadMoreRecharge = async () => {
    const res = await withdrawRechargeDetail({
      type: 'rechargeOnline',
      pageNum: pageNum + 1,
      pageSize: 20,
    });

    if (!res?.data) {
      return;
    }

    const newData = res.data.data;
    const next = res.data.hasNext;
    setPageNum((prevPage) => prevPage + 1);
    setHasNext(next);
    setDepositRecordData((prevAccountData) => [...prevAccountData, ...newData]);
    setIsLoading(false);
  };

  return (
    <RechargeTable
      fetchData={getRechargeDetails}
      headerList={headers}
      tableData={depositRecordData}
      loadMoreData={loadMoreRecharge}
      isPulled={isPulled}
      hasNext={hasNext}
    />
  );
};

export default OnlineRecharge;
