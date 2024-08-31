import Image from 'next/image';
import { FC } from 'react';
import { CardListType, GameInviterData } from '@/constants/types';
import classNames from 'classnames';
import NoData from '@/components/Customs/NoData';
import styles from './index.module.scss';

type EnvelopesProps = {
  selected: number;
  webView: boolean | undefined;
  gameInviterData: GameInviterData | null;
  cardList: Array<CardListType> | undefined;
};

const Envelopes: FC<EnvelopesProps> = ({ selected, webView, gameInviterData, cardList }) => {
  const params = new URL(gameInviterData?.inviterLink || `${document.location}`).searchParams;
  const channelCode = params.get('channelCode');
  const isSmallWebView = window.innerWidth < 450 && webView;

  const renderEnvelopeList = () => {
    if (!cardList?.length) return <NoData />;

    return (
      <>
        {cardList?.map((item) => {
          return (
            <div
              className={classNames(styles.slotItem, {
                [styles.selected]: selected === +item?.id,
                [styles.webView]: webView,
                [styles.isSmallWebView]: isSmallWebView,
              })}
              key={item?.id}
            >
              <Image
                src={item?.icon}
                alt={item?.name || 'Card'}
                sizes='15vw'
                fill
              />
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className={styles.rightSideContent}>
        <div className={styles.slotContainer}>
          <div className={styles.channelCodeContainer}>
            <span>{channelCode || gameInviterData?.memberId}</span>
          </div>
          <div className={styles.slotWrapper}>
            <div
              className={classNames(styles.slot, {
                [styles.selected]: selected > 0 && selected < 10,
                [styles.webView]: webView,
                [styles.isSmallWebView]: isSmallWebView,
              })}
            >
              {renderEnvelopeList()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Envelopes;
