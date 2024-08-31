import Image from 'next/image';
import { FC } from 'react';
import { useAppSelector } from '@/store';
import { staticImport } from '@/utils/resources';
import styles from './index.module.scss';

type TableHeadProps = {
  tableHeadData: { title: string }[];
  className?: string;
  title?: string;
  dataModuleTab?: string;
  withTipIcon?: boolean;
  setShowTip?: (showTip: boolean) => void;
};

const TableHead: FC<TableHeadProps> = ({ tableHeadData, className, dataModuleTab, withTipIcon, setShowTip }) => {
  const locale = useAppSelector((s) => s.appData.language);
  return (
    <>
      <table className={className}>
        <thead>
          <tr data-moduletab={dataModuleTab}>
            {tableHeadData?.map((item, index) => (
              <th key={index}>
                <p data-textafter={item.title}>{item.title}</p>
              </th>
            ))}
          </tr>
        </thead>
      </table>

      {withTipIcon && setShowTip && (
        <span
          className={styles.questionIcon}
          onClick={() => setShowTip(true)}
          data-lang={locale}
        >
          <Image
            src={staticImport.question}
            alt={'question-icon'}
            sizes='(max-width: 100vw) 100vw'
            quality={100}
            fill
          />
        </span>
      )}
    </>
  );
};

export default TableHead;
