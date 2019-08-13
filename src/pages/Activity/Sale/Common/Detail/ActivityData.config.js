import React from 'react';
import { Badge, } from 'antd'

export const INVITATION = 'INVITATION'
export const PUZZLE = 'PUZZLE'

export const WAITING = 'WAITING'
export const STARTED = 'STARTED'
export const ENDED = 'ENDED'

export function getStatus(status) {
  const obj = {
    [WAITING]: <Badge status="warning" text="待开始" />,
    [STARTED]: <Badge status="success" text="进行中" />,
    [ENDED]: <Badge status="default" text="已结束" />,
  }

  return obj[status] || <Badge status="default" text="无" />;
} 

export function getIndex(index) {
  const i = index + 1;
  const text = i < 10 ? `0${i}` : i;
  return `关联任务${text}`;
}

export function getTaskType(type) {
  const obj = {
    [INVITATION]: '转发邀请任务',
    [PUZZLE]: '解谜任务',
  }

  return obj[type] || '--';
}
