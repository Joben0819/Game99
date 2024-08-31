'use client';

import Image from 'next/image';
import { type ImageProps } from 'next/image';
import { FC } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store';

type ItemsHolderProps = Omit<ImageProps, 'alt'> & {
  iconClassName?: string;
  alt?: string;
  text: string;
};

const ItemsHolder: FC<ItemsHolderProps> = ({
  alt,
  text,
  style,
  onClick,
  children,
  className,
  iconClassName,
  ...props
}) => {
  const locale = useAppSelector((s) => s.appData.language);

  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      className={className}
      onClick={onClick}
      data-lang={locale}
      style={style}
    >
      {children}
      <div className={iconClassName}>
        <Image
          sizes='25vw'
          fill
          quality={100}
          priority
          alt={alt || text}
          {...props}
        />
      </div>
      <span
        data-lang={locale}
        data-textafter={text}
      >
        {text}
      </span>
    </motion.div>
  );
};

export default ItemsHolder;
