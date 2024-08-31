import Image from 'next/image';
import { useEffect, useState } from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { getReferralRegistered } from '@/services/api';
import { TRegisteredData } from '@/services/response-type';
import { Flex } from 'antd';
import dayjs from 'dayjs';
import NoData from '@/components/Customs/NoData';
import { RootState, useAppSelector } from '@/store';
import { staticImport } from '@/utils/resources';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const Registered = () => {
  const t = useTranslations().affiliate;
  const { userInfo } = useAppSelector((state: RootState) => state.userData);
  const [registeredUser, setRegisteredUser] = useState<TRegisteredData[]>([]);

  useEffect(() => {
    getRegisteredUser();
  }, [userInfo?.id]);

  const getRegisteredUser = async () => {
    const { code, data } = await getReferralRegistered({});
    if (code !== 200) return;
    if (data.length < 1) return;
    setRegisteredUser(data);
  };

  return (
    <div className={styles.contentInfo}>
      <div className={styles.reimbulsoWrapper}>
        <div className={styles.extraTable}>
          <div className={styles.headers}>
            <span>{t.invitedFriends}</span>
            <span>{t.registrationDate}</span>
            <span>{t.deposited}</span>
            <span>{t.level}</span>
          </div>
          <PullToRefresh onRefresh={getRegisteredUser}>
            <div className={styles.body}>
              {registeredUser.length > 0 ? (
                registeredUser.map((q) => (
                  <div
                    className={styles.dataContainer}
                    key={q?.inviterId}
                  >
                    <Flex
                      justify='center'
                      align='center'
                    >
                      <div className={styles.imageContainer}>
                        <Image
                          sizes='(max-width: 100vw) 100vw'
                          alt='logo'
                          src={q?.headImg ?? staticImport.game_item_placeholder}
                          quality={100}
                          width={30}
                          height={30}
                        />
                      </div>
                      <span>{q?.inviterId}</span>
                    </Flex>
                    <div>
                      <span>{dayjs(q?.registerTime).format('MM-DD-YYYY HH:mm:ss')}</span>
                    </div>
                    <div>
                      <Image
                        src={q?.recharged ? images.check : images.cross}
                        alt='check'
                        width={10}
                        height={10}
                      />
                    </div>
                    <div>
                      <Image
                        src={images[`vip_${q?.vip}`]}
                        alt='vip_icon'
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noDataWrapper}>
                  <NoData />
                </div>
              )}
            </div>
          </PullToRefresh>
        </div>
      </div>
    </div>
  );
};

export default Registered;
