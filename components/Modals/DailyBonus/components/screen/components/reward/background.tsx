import Image from 'next/image';
import { FC } from 'react';
import { DAILY_BONUS_STATUS } from '@/constants/enums';
import { images } from '@/utils/resources';

type BackgroundProps = {
  code: number;
};

const Background: FC<BackgroundProps> = ({ code }) => {
  const imageSource = code === DAILY_BONUS_STATUS.CLAIMABLE ? images.db_reward_claimable : images.db_reward_def;
  return <Image src={imageSource} alt="" fill sizes="20vw" />;
};

export default Background;
