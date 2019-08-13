import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Exception } from 'ant-design-pro';

const Exception404 = () => (
  <Exception
    type="404"
    desc={formatMessage({ id: 'exception-404.description.404' })}
    linkElement={Link}
    backText={formatMessage({ id: 'exception-404.exception.back' })}
  />
);

export default Exception404;
