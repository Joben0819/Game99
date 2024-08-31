import { CSSProperties, FC } from 'react';
import classNames from 'classnames';
import { useAppSelector } from '@/store';
import styles from './index.module.scss';

type HeaderTitleProps = {
  text: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
  transform?: 'lowercase' | 'uppercase' | 'capitalize' | 'none';
};

const HeaderTitle: FC<HeaderTitleProps> = ({ text, size, className: cName, style, transform }) => {
  const locale = useAppSelector((s) => s.appData.language);
  const customStyle = {
    ...style,
    textTransform: transform ?? 'none',
    '--fSize': size ?? undefined,
  } as CSSProperties;

  return (
    <h1
      className={classNames([styles.header, cName])}
      style={customStyle}
      data-size={size}
      data-textafter={text}
      data-lang={locale}
    >
      {text}
    </h1>
  );
};

export default HeaderTitle;
