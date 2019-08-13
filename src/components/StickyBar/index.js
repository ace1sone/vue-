import React from 'react';
import cn from 'classnames';
import { connect } from 'dva';

import styles from './index.less';

const StickyBar = ({ position, children, className, collapsed, style = {} }) => (
  <div
    style={style}
    className={cn(styles.sticky, className, {
      [styles.top]: position === 'top',
      [styles.bottom]: position === 'bottom',
      [styles.collapsed]: collapsed,
    })}
  >
    {children}
  </div>
);

export default connect(({ global }) => ({
  collapsed: global.collapsed,
}))(StickyBar);
