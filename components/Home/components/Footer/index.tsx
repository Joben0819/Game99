import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { APK_EVENT, DATA_MODAL } from '@/constants/enums';
import { setActiveModal, setSecondModal, setThirdModal, setPageLoad } from '@/reducers/appData';
import { TMenu } from '@/services/types';
import classNames from 'classnames';
import ItemsHolder from '@/components/Customs/ItemsHolder';
import { useAppDispatch, useAppSelector } from '@/store';
import { isIOSChrome, isIOSSafari, isLoggedIn, triggerApkEvent } from '@/utils/helpers';
import { images, staticImport } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import styles from './index.module.scss';

const Footer = () => {
  const locale = useAppSelector((s) => s.appData.language);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations().home;
  const { getVipGiftInfoRequest, getRescueBonusDetails, getAccountUserInfo } = useWithDispatch();
  const { messages, language } = useAppSelector((state) => state.appData);
  const { userInfo } = useAppSelector((state) => state.userData);
  const unreadMsg = messages?.filter((q) => q.status === 0);

  useEffect(() => {
    return () => {
      dispatch(setPageLoad(false));
    };
  }, []);

  const bottomMenu: TMenu[] = [
    {
      text: t.activity,
      icon: images.footer_activity,
      modal: DATA_MODAL.ACTIVITIES,
    },
    {
      text: t.vip,
      icon: images.footer_vip,
      modal: DATA_MODAL.VIP,
      apkEvent: APK_EVENT.VIP_REWARD,
    },
    {
      text: t.dailyBonus,
      icon: images.footer_bonus,
      modal: DATA_MODAL.DAILY_BONUS,
      apkEvent: APK_EVENT.DAILY_REWARD,
    },
    {
      text: t.invite,
      icon: images.footer_affiliate,
      link: '/invite',
      apkEvent: APK_EVENT.ENTER_PROMOTE,
    },
    {
      text: t.withdraw,
      icon: images.footer_withdraw,
      link: '/withdraw',
      apkEvent: APK_EVENT.WITHDRAW_CLICK,
    },
    {
      text: t.store,
      icon: images.footer_deposit,
      link: '/recharge',
      apkEvent: APK_EVENT.RECHARGE_CLICK,
    },
  ];

  const memoizedBotRightMenu = useMemo(
    () => [
      {
        text: t.email,
        icon: images.icon_mail,
        modal: DATA_MODAL.MAIL,
      },
      {
        text: t.support,
        icon: images.icon_cs,
        modal: DATA_MODAL.SUPPORT,
      },
    ],
    [language, userInfo],
  );

  const handleClickMenu = (menu: TMenu) => {
    if ((userInfo?.id && isLoggedIn()) || menu?.modal === 'support') {
      if (menu.apkEvent) triggerApkEvent(menu.apkEvent);
      if (menu.link) {
        dispatch(setPageLoad(true));
        dispatch(setActiveModal(DATA_MODAL.CLOSE));
        dispatch(setSecondModal(DATA_MODAL.CLOSE));
        dispatch(setThirdModal(DATA_MODAL.CLOSE));
        router.push(menu.link);
        return;
      }

      if (menu?.modal === DATA_MODAL.VIP) {
        getVipGiftInfoRequest();
        getRescueBonusDetails();
        getAccountUserInfo();
      }

      if (menu.modal) {
        dispatch(setActiveModal(menu.modal));
        return;
      }
    }
    dispatch(setActiveModal(DATA_MODAL.LOGIN_MODAL));
  };

  const notificationBubble = (menu: TMenu, modal: string) => {
    return (
      <>
        {menu.modal === modal && modal === DATA_MODAL.MAIL && unreadMsg?.length > 0 && (
          <div className={styles.notificationBadge}>
            <p>{unreadMsg?.length > 9 ? '9+' : `${unreadMsg?.length}`}</p>
          </div>
        )}
        {menu.modal === modal && modal === DATA_MODAL.VIP && userInfo.updateVip && (
          <div className={styles.notificationBadge} />
        )}
      </>
    );
  };

  return (
    <div className={styles.footerBg}>
      <div className={styles.left}>
        {bottomMenu.map((menu, idx) => {
          return (
            <ItemsHolder
              key={idx}
              text={menu.text}
              iconClassName={styles.icon}
              src={menu.icon}
              onClick={() => handleClickMenu(menu)}
              className={classNames(styles.iconHolder, {
                [styles['iconHolder--indoBonus']]: menu.modal === DATA_MODAL.DAILY_BONUS && locale === 'in'
              })}
            >
              {isLoggedIn() && userInfo.updateVip && notificationBubble(menu, DATA_MODAL.VIP)}
            </ItemsHolder>
          );
        })}
      </div>
      <div className={styles.right}>
        {memoizedBotRightMenu?.map((item, idx) => {
          return (
            <ItemsHolder
              key={idx}
              text={item.text}
              iconClassName={styles.icon}
              src={item?.icon ?? staticImport.game_item_placeholder}
              blurDataURL={item.icon}
              onClick={() => handleClickMenu(item)}
              className={classNames(styles.iconHolder, { [styles.iosOverrides]: isIOSChrome() || isIOSSafari() })}
            >
              {isLoggedIn() && item.modal === 'mail' && messages.some((obj) => obj.status === 0) && (
                <span className={styles.notification} />
              )}
            </ItemsHolder>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
