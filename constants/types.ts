import { TAnnouncementTypes } from '@/services/response-type';
import { RewardLogsType } from './enums';

export type CardListType = {
  id: string;
  name: string;
  icon: string;
  points: string;
};

export type GameInviterData = {
  memberId: string;
  progressPoints: string;
  completionPoints: string;
  gamePrize: string;
  startDatetime: string;
  deadlineDatetime: string;
  playCount: number;
  inviterLink: string;
  inviterGameRule: string;
  initialPoints: string;
  spinsPerInvite: string;
  backgroundImage: string;
  baseUrl2: string;
  cardList: Array<CardListType>;
  expireTime: number;
};

export type LogItem = {
  memberId: string;
  amount: string;
  logTime: string;
  type: RewardLogsType;
};

export type AnnouncementProps = {
  announcement: TAnnouncementTypes;
  setJumpActivity: () => void;
};

export type updatesTypes = {
  update: string;
};
