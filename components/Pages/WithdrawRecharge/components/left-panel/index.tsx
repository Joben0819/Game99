import Image from 'next/image';
import { FC, useEffect, useRef } from 'react';
import { DATA_MODAL, NO_DATA_TYPE } from '@/constants/enums';
import { TPayTypeList } from '@/services/response-type';
import classNames from 'classnames';
import NoData from '@/components/Customs/NoData';
import { useAppSelector } from '@/store';
import { isChineseCharacters } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useDisableZoom } from '@/hooks/useDisabledZoom';
import styles from './index.module.scss';

type LeftPanelProps = {
  title: string;
  activeMenu: number;
  menu: TPayTypeList[];
  handleCLick: (id: number, name?: string, screen?: number) => void;
};

const LeftPanel: FC<LeftPanelProps> = ({ title, activeMenu, menu, handleCLick }) => {
  const locale = useAppSelector((state) => state.appData.language);
  const { activeModal } = useAppSelector((state) => state.appData);
  const btnContainerRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);

  useDisableZoom();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = btnContainerRef.current?.scrollTop ?? 0;
      const scrollHeight = btnContainerRef.current?.scrollHeight! - 10;
      const clientHeight = btnContainerRef.current?.clientHeight ?? 0;

      if (scrollTop + clientHeight > scrollHeight) {
        arrowRef.current?.classList.add('rotate-180');
      } else {
        arrowRef.current?.classList.remove('rotate-180');
      }
    };
    btnContainerRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      btnContainerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollIndicator = () => {
    const container = btnContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollTop + clientHeight > scrollHeight - 10) {
      container.firstElementChild?.scrollIntoView({ behavior: 'smooth' });
    } else {
      container.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={styles.LeftWrapper}
      style={{ zIndex: `${activeModal === DATA_MODAL.WITHDRAWPASS && '10'}` }}
    >
      <div className={styles.bgContainer}>
        <Image
          src={images.left_panel}
          alt='left-panel-bg'
          fill
          sizes='100%'
        />
      </div>
      <div
        data-lang={locale}
        className={styles.header}
      >
        {/* <Image src={title} alt="header" fill sizes="100%" /> */}
        <p data-textafter={title}>{title}</p>
      </div>

      <div
        data-lang={locale}
        className={styles.buttons}
        ref={btnContainerRef}
      >
        {!!menu.length ? (
          menu?.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                handleCLick(item.id ?? 0, item?.name ?? '');
              }}
            >
              <div className={classNames(styles.button, { [styles.inactiveMenu]: item.id === activeMenu })}>
                {item.iconUrl && item?.rate !== 0 && (
                  <p className={styles.rate}>
                    <Image
                      src={images.discount_tag}
                      alt='icon'
                      fill
                      sizes='100%'
                    />
                    <span>+{item?.rate}%</span>
                  </p>
                )}
                <div className={item.iconUrl ? styles.btnContentIcon : styles.btnContent}>
                  {item.iconUrl && (
                    <div className={styles.icon}>
                      {
                        <Image
                          src={item.iconUrl ?? ''}
                          alt='icon'
                          fill
                          sizes='100%'
                          unoptimized
                        />
                      }
                    </div>
                  )}
                  <span
                    className={`${activeMenu === item.id ? styles.spanActive : styles.spanInactive} ${
                      item.iconUrl && styles.hasIcon
                    } ${isChineseCharacters(item.name) ? styles.isChinese : ''}`}
                  >
                    {item.name}
                  </span>
                </div>
                {item?.recommend && (
                  <div className={styles.recommendedContainer}>
                    <Image
                      src={images[`recommended_${locale}`]}
                      alt='menu-button'
                      fill
                      sizes='100%'
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <NoData type={NO_DATA_TYPE.LEFT_PANEL} />
        )}
      </div>

      {menu.length > 5 && (
        <div
          ref={arrowRef}
          className={styles.scrollIndicator}
        >
          <Image
            src={images.scroll_indicator}
            alt='menu-button'
            fill
            sizes='100%'
            onClick={handleScrollIndicator}
          />
        </div>
      )}
    </div>
  );
};

export default LeftPanel;
