import { WheelEvent } from 'react';
import { TDisableScrollBehaviorParams } from '../types/input';

export const disableScrollBehavior = ({ type }: TDisableScrollBehaviorParams) => {
  if (type !== 'number') return undefined;

  return (e: WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
    e.stopPropagation();
  };
};
