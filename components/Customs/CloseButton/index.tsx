import Image, { ImageProps } from 'next/image';

import { FC } from 'react';
import classNames from 'classnames';

import { images } from '@/utils/resources';
import styles from './index.module.scss';

const CloseButton: FC<Omit<ImageProps, 'src' | 'alt' >> = ({ className, ...props }) => {
  const closeButtonClasses = classNames('close-btn', styles.closeButton, className);

  return (
    <Image src={images.close_btn} alt="Close" width={80} height={80} className={closeButtonClasses} quality={100} {...props}/>
  );
};

export default CloseButton;
