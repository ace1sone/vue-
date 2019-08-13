import React from 'react';
import cn from 'classnames';
import styles from './index.less';

const StatusToggle = ({
  disabled,
  enabled,
  disabledText = '禁用',
  enabledText = '启用',
  // eslint-disable-next-line
  onClick = (enabled, event) => {},
  className,
}) =>
  enabled ? (
    <span
      className={cn(styles.disabled, className, {
        [styles.forbid]: disabled,
      })}
      onClick={disabled ? null : e => onClick(false, e)}
    >
      {disabledText}
    </span>
  ) : (
    <span
      className={cn(styles.enabled, className, {
        [styles.forbid]: disabled,
      })}
      onClick={disabled ? null : e => onClick(true, e)}
    >
      {enabledText}
    </span>
  );

export default StatusToggle;
