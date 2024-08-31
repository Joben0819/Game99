import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getInviterRules } from '@/services/api';
import { TInviterRules } from '@/services/response-type';
import { useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const Rules = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const t = useTranslations().invite;
  const [inviteRules, setInviteRules] = useState<TInviterRules>({
    headRule: '',
    tier1: '',
    tier2: '',
    tier3: '',
    tierN: '',
  });

  useEffect(() => {
    const fetchInviteRules = async () => {
      const { code, data } = await getInviterRules();
      if (code !== 200) return;
      setInviteRules(data);
    };

    fetchInviteRules();
  }, [locale]);

  const superscriptAfterCaret = (str: string) => {
    // This only considers replacing strings after carets as superscript and adding a break on the first white space
    // If more complex formatting is required, it is better for BE to just return raw html
    const setSuperScript = str.replace(/\^([^\s]+)/g, (_, match) => `<sup>${match}</sup>`);
    return setSuperScript.replace(' ', '<br />');
  };

  return (
    <div className={styles.contentInfo}>
      <div className={styles.leftContent}>
        <Image
          className={styles.tierImage}
          src={images[`tier_${locale}`]}
          alt='Tier Hierarchy'
          width={300}
          height={500}
          priority={true}
        />
      </div>
      <div className={styles.rightContent}>
        <div
          className={styles.ruleContainer}
          data-lang={locale}
        >
          <p className={styles.title}>{inviteRules.headRule}</p>
          <div className={styles.ruleListContainer}>
            <div className={styles.rule}>
              <div className={styles.inner}>
                <p data-textafter={`${t.tier} 1`}>{t.tier} 1</p>
                <p data-textafter={t.referralCommission}>{t.referralCommission}</p>
                <p dangerouslySetInnerHTML={{ __html: superscriptAfterCaret(inviteRules.tier1) }}></p>
              </div>
            </div>
            <div className={styles.rule}>
              <div className={styles.inner}>
                <p data-textafter={`${t.tier} 2`}>{t.tier} 2</p>
                <p data-textafter={t.referralCommission}>{t.referralCommission}</p>
                <p dangerouslySetInnerHTML={{ __html: superscriptAfterCaret(inviteRules.tier2) }}></p>
              </div>
            </div>
            <div className={styles.rule}>
              <div className={styles.inner}>
                <p data-textafter={`${t.tier} 3`}>{t.tier} 3</p>
                <p data-textafter={t.referralCommission}>{t.referralCommission}</p>
                <p dangerouslySetInnerHTML={{ __html: superscriptAfterCaret(inviteRules.tier3) }}></p>
              </div>
            </div>
            <div className={styles.rule}>
              <div className={styles.inner}>
                <p data-textafter={`${t.tier} N`}>{t.tier} N</p>
                <p data-textafter={t.referralCommission}>{t.referralCommission}</p>
                <p dangerouslySetInnerHTML={{ __html: superscriptAfterCaret(inviteRules.tierN) }}></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rules;
