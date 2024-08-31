'use client';

import { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
// Import your reducers here
import appDataReducer from '@/reducers/appData';
import paymentDataReducer from '@/reducers/paymentData';
import userDataReducer from '@/reducers/userData';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { thunk } from 'redux-thunk';
import { jackpotPrizeListApi } from '@/components/Home/components/Jackpot/jackpot.rtk';
import { depositBonusApi } from '@/components/Modals/Atividade/components/RechargeAndCodeBonus/rechargeBonus.rtk';
import { rouletteApi } from '@/components/Modals/Atividade/components/coinRoulette/roulette.rtk';
import { activitiesApi } from '@/components/Modals/Atividade/index.rtk';
import { dailyBonusApi } from '@/components/Modals/DailyBonus/index.rtk';
import { prizePoolApi } from '@/components/Modals/PrizePool/index.rtk';

// Define the root state
export type RootState = {
  appData: ReturnType<typeof appDataReducer>;
  userData: ReturnType<typeof userDataReducer>;
  paymentData: ReturnType<typeof paymentDataReducer>;
};

const rootReducer = combineReducers({
  appData: appDataReducer,
  userData: userDataReducer,
  paymentData: paymentDataReducer,
  [prizePoolApi.reducerPath]: prizePoolApi.reducer,
  [dailyBonusApi.reducerPath]: dailyBonusApi.reducer,
  [activitiesApi.reducerPath]: activitiesApi.reducer,
  [rouletteApi.reducerPath]: rouletteApi.reducer,
  [depositBonusApi.reducerPath]: depositBonusApi.reducer,
  [jackpotPrizeListApi.reducerPath]: jackpotPrizeListApi.reducer,
});

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const persistConfig = {
  key: 'root',
  blacklist: ['prizePoolApi', 'dailyBonusApi', 'activitiesApi'],
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    })
      .concat(prizePoolApi.middleware)
      .concat(dailyBonusApi.middleware)
      .concat(activitiesApi.middleware)
      .concat(rouletteApi.middleware)
      .concat(depositBonusApi.middleware)
      .concat(jackpotPrizeListApi.middleware)
      .concat(thunk);
  },
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootStore = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
