import { FC } from 'react';
import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  MailruShareButton,
  OKShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  VKShareButton,
  ViberShareButton,
  WhatsappShareButton,
} from 'react-share';
import {
  EmailIcon,
  FacebookIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  MailruIcon,
  OKIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  VKIcon,
  ViberIcon,
  WhatsappIcon,
} from 'react-share';
import { MODAL_BG_ANIMATION } from '@/constants/app';
import { motion } from 'framer-motion';
import Button from '@/components/Customs/Button';
import { handleCopy } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './style.module.scss';

type ShareQrProp = {
  value2: string;
  click: () => void;
};

const ShareQr: FC<ShareQrProp> = ({ value2, click }) => {
  const t = useTranslations().invite;
  const translatedToastMessage = useTranslations().recharge;

  return (
    <motion.div
      variants={MODAL_BG_ANIMATION}
      initial='hidden'
      animate='visible'
      exit='exit'
      className={styles.wrapper}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className={styles.mainWrapper}
      >
        <div className={styles.shareContainer}>
          <div className={styles.inputUrl}>
            <input
              type='text'
              value={value2}
              readOnly
            />
            <span
              className='absolute opacity-0 top-[o] left-[0]'
              style={{ fontSize: '1px' }}
              id='textToCopy'
            >
              {value2}
            </span>
            <motion.div
              whileTap={{ scale: 0.9 }}
              onClick={() => handleCopy(value2, translatedToastMessage)}
              className={styles.copy}
            ></motion.div>
          </div>
          <div className={styles.socialsContainer}>
            {/* ok */}
            <EmailShareButton url={value2}>
              <EmailIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </EmailShareButton>

            <FacebookShareButton url={value2}>
              <FacebookIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </FacebookShareButton>

            {/* ok */}
            <WhatsappShareButton url={value2}>
              <WhatsappIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </WhatsappShareButton>

            <VKShareButton url={value2}>
              <VKIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </VKShareButton>

            <HatenaShareButton url={value2}>
              <HatenaIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </HatenaShareButton>

            <LinkedinShareButton url={value2}>
              <LinkedinIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </LinkedinShareButton>

            <InstapaperShareButton url={value2}>
              <InstapaperIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </InstapaperShareButton>

            <LineShareButton url={value2}>
              <LineIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </LineShareButton>

            <MailruShareButton url={value2}>
              <MailruIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </MailruShareButton>

            <OKShareButton url={value2}>
              <OKIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </OKShareButton>
            {/* ok */}
            <TelegramShareButton url={value2}>
              <TelegramIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </TelegramShareButton>
            <PocketShareButton url={value2}>
              <PocketIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </PocketShareButton>
            {/* ok */}
            <TwitterShareButton url={value2}>
              <TwitterIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </TwitterShareButton>
            {/* ok */}
            <ViberShareButton url={value2}>
              <ViberIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </ViberShareButton>

            <RedditShareButton
              url={value2}
              title={value2}
            >
              <RedditIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </RedditShareButton>

            <TumblrShareButton url={value2}>
              <TumblrIcon
                size={'.55rem'}
                borderRadius={4}
              />
            </TumblrShareButton>
          </div>
          <Button
            className={styles.exitModal}
            text={t.exit}
            variant='orange'
            onClick={click}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
export default ShareQr;
