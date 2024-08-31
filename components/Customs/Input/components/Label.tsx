import { forwardRef } from 'react';
import classNames from 'classnames';
import styles from '../index.module.scss';
import { ILabelProps } from '../types/input';

export const Label = forwardRef<HTMLLabelElement, ILabelProps>(({ text, inputId, className }, ref) => {
  if (!text) return null;

  return (
    <label
      htmlFor={inputId}
      className={classNames(styles.inputLabel, className)}
      ref={ref}
    >
      {text}
    </label>
  );
});

Label.displayName = 'Label';
