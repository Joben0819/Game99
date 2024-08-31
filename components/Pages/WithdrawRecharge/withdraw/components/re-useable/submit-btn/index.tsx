import Image from 'next/image';
import { FC, memo } from 'react';
import classNames from 'classnames';
import { images } from '@/utils/resources';
import styles from './index.module.scss';

type SubmitBtnProps = {
  title: string;
  isDisabled: boolean;
  handleClick: () => void;
};

const SubmitBtn: FC<SubmitBtnProps> = ({ title, isDisabled, handleClick }) => {
  return (
    <div
      className={classNames(styles.btnWrapper, { grayscale: isDisabled, btn: !isDisabled })}
      onClick={!isDisabled ? handleClick : undefined}
    >
      <Image
        src={images.submit_btn}
        alt='submit-button'
        fill
        sizes='100%'
      />
      <span>{title}</span>
    </div>
  );
};

export default memo(SubmitBtn);
