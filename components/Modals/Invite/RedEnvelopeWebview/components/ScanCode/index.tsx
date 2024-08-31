import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';
import classNames from 'classnames';
import { useAppSelector } from '@/store';
import styles from './index.module.scss';

type ScanCodeProps = {
  webView?: boolean;
  isSpinning?: boolean;
  handleScanCodeClick: () => void;
};

const ScanCode: FC<ScanCodeProps> = ({ webView, isSpinning, handleScanCodeClick }) => {
  const params = useSearchParams();
  const locale = useAppSelector((s) => s.appData.language);
  const linkAttr = webView ? { href: '#', onClick: () => handleScanCodeClick() } : { href: `/invite/qr` };
  const newLinkAttr = { href: '#' };
  const spinningLinkAttr = isSpinning ? newLinkAttr : linkAttr;
  const isSmallWebView = window.innerWidth < 450 && webView;
  const isWindow = params.get('isWindow');

  return (
    <div
      className={classNames(styles.scanCode, {
        [styles.isSmallWebView]: isSmallWebView && !isWindow,
      })}
    >
      <Link {...spinningLinkAttr}>
        <div
          className={styles.scanCodeContent}
          data-lang={locale}
        />
      </Link>
    </div>
  );
};

export default ScanCode;
