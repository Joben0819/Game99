import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import CSVGA from '@/components/Customs/CSVGA';
import styles from './index.module.scss';

type SVGAProps = {
  showSVGA: boolean;
  svga: string;
  isSVGALoaded: () => void;
  svgaText?: string;
  topText?: boolean;
  svgaTextDelay?: number;
  svgaTextExit?: number;
  webView?: boolean;
};

const SVGA: FC<SVGAProps> = ({
  showSVGA,
  svga,
  isSVGALoaded,
  svgaText,
  topText,
  svgaTextDelay = 1000,
  svgaTextExit = 2200,
  webView = false,
}) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const textShowTimeout = setTimeout(() => {
      setShowText(true);
    }, svgaTextDelay);

    const textHideTimeout = setTimeout(() => {
      setShowText(false);
    }, svgaTextDelay + svgaTextExit);

    return () => {
      clearTimeout(textShowTimeout);
      clearTimeout(textHideTimeout);
    };
  }, []);

  return (
    <div
      className={classNames(styles.svgaWrapper, {
        [styles.hide]: !showSVGA,
        [styles.webView]: webView,
      })}
    >
      <div className={styles.tvContainer}>
        {svgaText && (
          <div
            className={classNames(styles.svgaTextContainer, {
              [styles.topText]: topText,
              [styles.webView]: webView,
            })}
          >
            <h1>{showText && svgaText}</h1>
          </div>
        )}

        <CSVGA
          src={svga}
          option={{ loop: false }}
          isSVGALoaded={isSVGALoaded}
        />
      </div>
    </div>
  );
};

export default SVGA;
