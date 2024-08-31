import { forwardRef, useState } from 'react';
import classNames from 'classnames';
import { CustomIcon } from './components/Custom';
import { Label } from './components/Label';
import { PasswordIcon } from './components/Password';
import { WarningIcon } from './components/Warning';
import styles from './index.module.scss';
import { IInputProps } from './types/input';
import { determineType, disableScrollBehavior, onlyAllowDigits } from './utils';

export const Input = forwardRef<HTMLInputElement, IInputProps>((props, ref) => {
  const { labelStyles, formState, customIcon, parentStyles, spellCheck, type, className, onKeyDown, onWheel, ...rest } =
    props;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className={classNames(styles.inputContainer, parentStyles?.className)}
      data-withlabel={!!labelStyles}
    >
      <Label
        text={labelStyles?.text}
        inputId={props.id}
        className={labelStyles?.className}
      />

      <input
        type={determineType({ type, showPassword })}
        spellCheck={false}
        className={classNames({ [styles.invalid]: formState }, className)}
        ref={ref}
        onKeyDown={onlyAllowDigits({ type })}
        onWheel={disableScrollBehavior({ type })}
        {...rest}
      />

      <WarningIcon formState={formState} />

      <PasswordIcon
        type={type}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        formState={formState}
      />

      <CustomIcon customIcon={customIcon} />
    </div>
  );
});

Input.displayName = 'Input';
