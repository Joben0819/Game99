import { createSlice } from '@reduxjs/toolkit';
import { TPaymentDataState } from '@/services/types';

const initialState: TPaymentDataState = {
  activeBankMemberCard: { bankName: '', bankIcon: '', id: 0, sort: 0 },
  bankMemberCard: [],
  depositData: { id: 0, amount: 0, type: 0, bonus: 0, image: '' },
  rspWithdrawInfo: { canWithdrawMoney: 0, accountNow: 0, needBeat: 0 },
};

export const paymentDataSlice = createSlice({
  name: 'paymentData',
  initialState,
  reducers: {
    resetPaymentData: () => initialState,
    setActiveBankMemberCardList: (state, action) => ({ ...state, activeBankMemberCard: action.payload }),
    setBankMemberCardList: (state, action) => ({ ...state, bankMemberCard: action.payload }),
    setRspWithdrawInfo: (state, action) => ({ ...state, rspWithdrawInfo: action.payload }),
  },
});

export const {
  resetPaymentData,
  setActiveBankMemberCardList,
  setBankMemberCardList,
  setRspWithdrawInfo,
} = paymentDataSlice.actions;

export default paymentDataSlice.reducer;
