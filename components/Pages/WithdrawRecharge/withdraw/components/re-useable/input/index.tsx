import { FC, InputHTMLAttributes, memo } from 'react';
import styles from './index.module.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

const Input: FC<InputProps> = ({ hasError, ...rest }) => {
  return (
    <div className={styles.wrapper}>
      {hasError && <span className={styles.error}>!</span>}
      <input
        className={styles.input}
        min={1}
        data-error={hasError}
        {...rest}
      />
    </div>
  );
};

export default memo(Input);
