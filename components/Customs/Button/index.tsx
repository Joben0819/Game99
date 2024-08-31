import { CSSProperties, FC } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import styles from './index.module.scss';

type ButtonProps = {
  text: string;
  width?: number;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  variant: 'blue' | 'orange';
  type?: 'button' | 'reset' | 'submit';
  onClick?: (val: any) => void;
};

const Button: FC<ButtonProps> = ({ text, width, disabled, className, style, variant, type = 'button', onClick }) => {
  return (
    <motion.div
      className={classNames(styles.customButton, className)}
      style={{ ...style, width: `${width}rem`, height: width ? `${width / 4}rem` : undefined }}
    >
      <motion.button
        type={type}
        disabled={disabled}
        className={classNames(styles[variant], styles.customButton)}
        onClick={onClick}
        whileTap={{ scale: disabled ? 0 : 0.9 }}
      >
        {text}
      </motion.button>
    </motion.div>
  );
};

export default Button;
