import { FC } from 'react';
import { USDTData } from '../..';
import { USDT } from './components/Usdt';
import { USDTNoData } from './components/UsdtNoData';
import { useGetRechargeUsdtList } from './hooks/useGetRechargeUsdtList';

type USDTTabProps = { usdtData: USDTData };

const USDTTab: FC<USDTTabProps> = ({ usdtData }) => {
  const rechargeList = useGetRechargeUsdtList();
  if (!rechargeList || rechargeList.length === 0) return <USDTNoData usdtData={usdtData} />;
  return (
    <USDT
      rechargeList={rechargeList}
      usdtData={usdtData}
    />
  );
};

export default USDTTab;
