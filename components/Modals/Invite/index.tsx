'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveInviteContent, setActiveModal, setPageLoad, setPrevPage, setSecondModal } from '@/reducers/appData';
import { setRegistrationData } from '@/reducers/userData';
import { getRegistrationData, referralWebViewList } from '@/services/api';
import { TWebviewList } from '@/services/response-type';
import classNames from 'classnames';
import { AnimatePresence } from 'framer-motion';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { useAppDispatch, useAppSelector } from '@/store';
import { filterImageSrc, hasAnnounceJumpType, isLoggedIn } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import ShareQr from '../Share';
import Convite from './Convite';
import RedEnvelope from './RedEnvelope';
import Referral from './Referral';
import Registered from './Registered';
import Reimbulso from './Reimbulso';
import SidebarItem from './SidebarItem';
import styles from './index.module.scss';

const InvitePage = () => {
  const dispatch = useAppDispatch();
  const { resetInternetStatus } = useWithDispatch();
  const t = useTranslations().affiliate;
  const state = useAppSelector((state) => state.appData.activeInviteContent);
  const { prevPage, isSpinning } = useAppSelector((state) => state.appData);
  const { userInfo, registrationData } = useAppSelector((state) => state.userData);
  const [share, setShare] = useState(false);
  // const [isRedPocketAvailable, setIsRedPocketAvailable] = useState(false);
  const [isBgLoaded, setIsBgLoaded] = useState<boolean>(false);
  const [webViewlist, setWebViewlist] = useState<TWebviewList[]>([]);
  const [webView, setWebView] = useState(false);
  const [type, setType] = useState<null | string>();

  const sidebarItems = [
    // { name: t('redEnvelope'), id: 3000 },
    // { name: t('invitationRules'), id: 3001 },
    { name: t.myReferral, id: 3002 },
    { name: t.commissionDetails, id: 3003 },
    { name: t.referralReport, id: 3004 },
    { name: t.registeredUser, id: 3005 },
  ];

  useEffect(() => {
    resetInternetStatus();
    fetchData();
    return () => {
      dispatch(setPageLoad(false));
      dispatch(setActiveInviteContent(''));
    };
  }, []);

  useEffect(() => {
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
    dispatch(setSecondModal(DATA_MODAL.CLOSE));
  }, [userInfo?.id, isLoggedIn]);

  const switchState = (name: string, isWebView: boolean, type: string | null) => {
    setType(type);
    setWebView(isWebView);
    dispatch(setActiveInviteContent(name));
  };

  const fetchRegistrationData = async () => {
    const res = await getRegistrationData();
    if (res?.data) {
      localStorage.setItem('inviteBGLink', res.data.backgroundImage);
      dispatch(setRegistrationData(res.data));
    }
  };

  const getWebviewList = async () => {
    const { data } = await referralWebViewList();
    const webViewList =
      data?.data
        ?.filter(
          (item: TWebviewList) =>
            (item.type === 'IMAGE' && filterImageSrc(item.baseUrl || '')) || item.type === 'PINDUODUO',
        )
        .map((item: TWebviewList, idx: number) => ({ ...item, id: idx })) || [];
    setWebViewlist(webViewList);

    const eventJumpType = localStorage.getItem('eventJumpType');
    localStorage.removeItem('eventJumpType');

    if (prevPage === t.myReferral) {
      dispatch(setActiveInviteContent(prevPage));
      setWebView(false);
      dispatch(setPrevPage(''));
    } else if (state) {
      setWebView(webViewList.some((item: TWebviewList) => item.baseUrl === state));
      const activeWebView = webViewList.find((item: TWebviewList) => item.baseUrl === state);
      const activeWebViewPinduoduo = webViewList.find((item: TWebviewList) => item.type === eventJumpType);
      const activeWebViewImage = webViewList.find(
        (item: TWebviewList) => eventJumpType === 'INVITER' && item.type === 'IMAGE',
      );

      if (activeWebViewPinduoduo) {
        dispatch(setActiveInviteContent(activeWebViewPinduoduo.baseUrl));
        setType('PINDUODUO');
        setWebView(true);
      } else if (activeWebViewImage) {
        dispatch(setActiveInviteContent(activeWebViewImage.baseUrl));
        setType('IMAGE');
        setWebView(true);
      } else if (!!activeWebView) {
        setWebView(true);
        setType(activeWebView.type);
      } else if (eventJumpType === 'PINDUODUO' && webViewList.length > 0) {
        dispatch(setActiveInviteContent(webViewList[0].baseUrl));
        setType(webViewList[0].type);
        setWebView(true);
      } else {
        dispatch(setActiveInviteContent(t.myReferral));
        setWebView(false);
      }
    } else if (webViewList.length > 0) {
      dispatch(setActiveInviteContent(webViewList[0].baseUrl));
      setType(webViewList[0].type);
      setWebView(true);
    } else {
      dispatch(setActiveInviteContent(t.myReferral));
      setWebView(false);
    }
  };

  const checkRedPacket = async () => {
    // const { data } = await checkUserRedPacket();
    // setIsRedPocketAvailable(data);
    // if (state === t('redEnvelope') && !data) {
    //   dispatch(setActiveInviteContent(t('invitationRules')));
    // }
    dispatch(setPrevPage('other-page'));

    // if (!state && data !== undefined) {
    //   const contentKey = data ? 'redEnvelope' : 'invitationRules';
    //   dispatch(setActiveInviteContent(t(contentKey)));
    // }
  };

  const fetchData = async () => {
    await Promise.all([fetchRegistrationData(), checkRedPacket(), getWebviewList()]);
    setTimeout(() => setIsBgLoaded(true), 300);
  };

  return (
    <>
      {!isBgLoaded && (
        <div className={classNames(styles.loaderWrapper, 'opacity-100')}>
          <LoadingIcon />
        </div>
      )}
      {isSpinning && <div className={styles.blocker} />}
      {isBgLoaded && (
        <div className={styles.mainWrapper}>
          <div className={styles.content}>
            <div className={styles.sidebarItems}>
              {webViewlist.concat(sidebarItems)?.map((sidebar, idx) => {
                const isWebView = !!sidebar.baseUrl;
                // const isWebView = webViewlist?.some((item) => item.baseUrl === sidebar.baseUrl);
                const activeState = isWebView ? sidebar.baseUrl : sidebar.name;
                const type = sidebar.type || null;

                return (
                  <SidebarItem
                    key={`${sidebar.id}-${idx}`}
                    sidebar={sidebar}
                    isActive={state === activeState}
                    onClick={() => switchState(activeState as string, isWebView, type)}
                  />
                );
              })}
            </div>
            <div className={styles.contentContainer}>
              <div className={styles.contentBG}>
                <Image
                  src={images.content_bg}
                  alt='content-bg'
                  width={320}
                  height={420}
                  priority
                />
              </div>
              {/* <iframe
                src={webUrl}
                className="size-full"
              /> */}
              {webView ? (
                <>
                  {type === 'PINDUODUO' && <RedEnvelope />}
                  {type === 'IMAGE' && (
                    <div className={styles.webView}>
                      <Image
                        src={state.includes('http') ? state : `https://${state}`}
                        alt=''
                        fill
                        priority
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* {state === t('invitationRules') && <Rules />} */}
                  {state === t.myReferral && <Convite Share={() => setShare(true)} />}
                  {state === t.commissionDetails && <Reimbulso />}
                  {state === t.referralReport && <Referral />}
                  {state === t.registeredUser && <Registered />}
                </>
              )}
            </div>
          </div>
          <CloseBtn />
          <AnimatePresence>
            {share && (
              <ShareQr
                value2={registrationData?.baseUrl2 ?? ''}
                click={() => {
                  setShare(false);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

const CloseBtn = memo(() => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleCloseBtn = () => {
    if (hasAnnounceJumpType()) {
      setTimeout(() => {
        dispatch(setActiveModal(DATA_MODAL.CLOSE));
        dispatch(setSecondModal(DATA_MODAL.OTHER_ANNOUNCEMENT));
        sessionStorage.removeItem('announceJumpType');
      }, 200);
    }
    router.push('/');
  };

  return (
    <div
      className={styles.closeBtn}
      onClick={handleCloseBtn}
    >
      <Image
        src={images.go_back}
        className='btn'
        alt='close-btn'
        fill
        sizes='100%'
      />
    </div>
  );
});
CloseBtn.displayName = 'CloseBtn';

export default InvitePage;
