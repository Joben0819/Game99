import { FC } from 'react';
import classNames from 'classnames';
import { useAppSelector } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type RuleInvitationCodeProps = { onClick: () => void; webView: boolean | undefined };

const RuleInvitationCode: FC<RuleInvitationCodeProps> = ({ onClick, webView }) => {
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations().affiliate;
  const isSmallWebView = window.innerWidth < 450 && webView;

  return (
    <div
      className={classNames(styles.ruleInvitationCode, {
        [styles.webView]: webView,
        [styles.isSmallWebView]: isSmallWebView,
      })}
      onClick={onClick}
    >
      <div
        className={styles.ruleInvitationCodeContent}
        data-lang={locale}
      >
        <div
          className={styles.ruleInvitationCodeText}
          data-lang={locale}
        >
          <span>{t.invitation}</span>
          <span>{t.rule}</span>
        </div>
      </div>
    </div>
  );
};

export default RuleInvitationCode;
