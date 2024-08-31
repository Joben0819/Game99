import { HTMLInputTypeAttribute } from 'react';
import { TDetermineTypeParams } from '../types/input';

export const determineType = ({ type, showPassword }: TDetermineTypeParams): HTMLInputTypeAttribute | undefined => {
  const shouldShowPassword: HTMLInputTypeAttribute = showPassword ? 'text' : 'password';

  if (type !== 'password') return type;

  return shouldShowPassword;
};
