import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DATA_MODAL } from '@/constants/enums';
import { setSecondModal } from '@/reducers/appData';
import { setActiveInviteContent } from '@/reducers/appData';
import { getReferralInfo } from '@/services/api';
import { TAnnouncementTypes, TReferralInfoTypes } from '@/services/response-type';
import classNames from 'classnames';
import HeaderTitle from '@/components/Customs/HeaderTitle';
import { useAppSelector } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type PartnersModalProps = {
  count: number;
  announcement: TAnnouncementTypes;
};

const PartnersModal: FC<PartnersModalProps> = ({ count, announcement }) => {
  const locale = useAppSelector((state) => state.appData.language);
  const { push } = useRouter();
  const dispatch = useDispatch();
  const t = useTranslations().partners;
  const [referralInfo, setReferralInfo] = useState<TReferralInfoTypes>({
    invites: null,
    commissionReceived: null,
  });

  useEffect(() => {
    getReferralInfo().then(({ code, data }) => {
      if (code === 200) {
        setReferralInfo(data);
      }
    });
  }, []);

  const handleClickBtn = () => {
    if (announcement.jumpType) {
      localStorage.setItem('eventJumpType', announcement.jumpType);
      sessionStorage.setItem('announceJumpType', announcement.jumpType);
      localStorage.setItem('announceClicked', count.toString());
      dispatch(setActiveInviteContent(t.invitationRules));
      dispatch(setSecondModal(DATA_MODAL.CLOSE));
      push('/invite');
    }
  };

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalContainer}>
        <div className={styles.bgContainer}>
          <div className={styles.partnersWrapper}>
            <HeaderTitle
              text={t.title}
              size={40}
            />
            <div className={styles.partnersBg}>
              <div className={styles.partnersDetailsWrapper}>
                <div className={styles.partnersDescription}>
                  <p data-lang={locale}>{t.inviteYourFriends}</p>
                </div>

                <div className={styles.partnersDetails}>
                  <div>
                    <span data-lang={locale}>{t.inviteSuccess}</span>
                    <span data-lang={locale}>
                      {referralInfo?.invites ?? 0} {t.people}
                    </span>
                  </div>
                  <hr />
                  <div>
                    <span data-lang={locale}>{t.commissionRebateAmount}</span>
                    <span data-lang={locale}>
                      {referralInfo?.commissionReceived ? moneyFormat(referralInfo?.commissionReceived) : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={classNames(styles.inviteNowBtn, 'btn')}
              onClick={handleClickBtn}
              data-lang={locale}
            >
              <p>{t.inviteNow}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersModal;
