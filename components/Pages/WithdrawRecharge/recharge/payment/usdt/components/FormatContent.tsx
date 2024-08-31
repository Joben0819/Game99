import { Fragment } from 'react';

export const FormatContent = ({ content }: { content: string }) => {
  return content?.split('\n').map((line, index) => (
    <Fragment key={index}>
      {line}
      <br />
    </Fragment>
  ));
};
