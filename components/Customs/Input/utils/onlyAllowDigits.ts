import { KeyboardEvent } from 'react';
import { isAllowedKey } from '@/utils/helpers';
import { TOnlyAllowDigits } from '../types/input';

export const onlyAllowDigits = ({ type }: TOnlyAllowDigits) => {
  if (type !== 'number') return undefined;

  return (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      !isAllowedKey({
        key: e.key,
        isMetaKey: e.metaKey,
      })
    )
      return e.preventDefault();
  };
};
