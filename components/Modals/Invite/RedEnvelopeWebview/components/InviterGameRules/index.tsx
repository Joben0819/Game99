import { useSearchParams } from 'next/navigation';
import { FC, Fragment } from 'react';
import classNames from 'classnames';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type InviterGameRulesProps = {
  inviterGameRuleText: string;
  webView: boolean | undefined;
};

const InviterGameRules: FC<InviterGameRulesProps> = ({ inviterGameRuleText, webView }) => {
  const params = useSearchParams();
  const t = useTranslations().affiliate;
  const isSmallWebView = window.innerWidth < 450 && webView;
  const isWindow = params.get('isWindow');

  const formatContent = (content: string | null) => {
    return content?.split('\n').map((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  };

  return (
    <div
      className={classNames(styles.inviterGameRule, {
        [styles.isSmallWebView]: isSmallWebView && !isWindow,
      })}
    >
      <p>{formatContent(inviterGameRuleText) || formatContent(t.altTextForRules)}</p>
    </div>
  );
};

export default InviterGameRules;
