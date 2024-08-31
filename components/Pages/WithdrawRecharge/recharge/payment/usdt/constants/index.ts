import { USDTData } from '../../..';

export const initialRechargeList = [
  {
    chainName: '',
    channelName: '',
    discountBill: 0,
    discountBillStr: '',
    exchangeRate: '',
    id: '',
    rechargeAddress: '',
  },
];

export const getSteps = (usdtData: USDTData) => {
  return [usdtData.tex1, usdtData.tex2, usdtData.tex3, usdtData.tex4, usdtData.tex5];
};
