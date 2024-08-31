import {
  DOMAttributes,
  Dispatch,
  FC,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SetStateAction,
} from 'react';

export type IInputProps = InputHTMLAttributes<HTMLInputElement> & {
  inputId?: string;
  formState?: boolean;
  customIcon?: {
    src: string;
    alt: string;
    onClick?: DOMAttributes<HTMLDivElement>['onClick'];
  };
  parentStyles?: {
    className?: string;
  };
  labelStyles?: {
    text: string;
    textAfter?: boolean;
    className?: string;
  };
};

export type TCustomIconProps = FC<Pick<IInputProps, 'customIcon'>>;

export type ILabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  text?: string;
  inputId?: string;
};

export type TPasswordIconProps = FC<
  Pick<IInputProps, 'type' | 'formState'> &
    Required<{
      showPassword: boolean;
      setShowPassword: Dispatch<SetStateAction<boolean>>;
    }>
>;

export type TWarningIconProps = FC<Pick<IInputProps, 'formState'>>;

export type TDetermineTypeParams = {
  type?: HTMLInputTypeAttribute;
  showPassword: boolean;
};

export type TDisableScrollBehaviorParams = Pick<TDetermineTypeParams, 'type'>;
export type TOnlyAllowDigits = TDisableScrollBehaviorParams;
