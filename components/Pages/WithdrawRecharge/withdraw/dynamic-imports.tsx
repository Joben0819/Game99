import dynamic from 'next/dynamic';

const FastWithdraw = dynamic(() => import('./components/fast-withdraw'));

const CodeDetails = dynamic(() => import('./components/code-details/old'));

const WalletManagement = dynamic(() => import('./components/wallet-management'));

const Records = dynamic(() => import('./components/records/old'));

const BettingRecords = dynamic(() => import('./components/bet-records'));

export { FastWithdraw, CodeDetails, WalletManagement, Records, BettingRecords };
