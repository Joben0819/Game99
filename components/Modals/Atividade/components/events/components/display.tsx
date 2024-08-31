import { FC, memo } from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { ActivityTypesData } from '@/services/response-type';
import { TEvents } from '@/services/types';
import Loader from '@/components/Customs/Loader';
import Events from './events';
import styles from './styles.module.scss';

export type DisplayProps = ActivityTypesData & {
  events?: TEvents[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
};

const Display: FC<DisplayProps> = ({ events = [], isLoading, onRefresh }) => {
  if (isLoading) return <Loader radius="10" />;
  return (
    <PullToRefresh className={styles.refresh} onRefresh={onRefresh}>
      <Events events={events} />
    </PullToRefresh>
  );
};

export default memo(Display);
