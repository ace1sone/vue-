import React from 'react';
import { Badge } from 'antd';

function npcStatus(item) {
  let status = '';
  switch (item) {
    case 'ENABLE':
      status = '启用中';
      break;
    case 'DISABLE':
      status = '禁用中';
      break;
    default:
  }
  return status;
}

function npcType(item) {
  let type = '';
  switch (item) {
    case 'VIDEO':
      type = '视频';
      break;
    case 'IMAGE':
      type = '图文';
      break;
    case 'AUDIO':
      type = '音频';
      break;
    default:
  }
  return type;
}

function npcpublish(status) {
  let style = '';
  let text = '';
  if (status === 'WAITING') {
    text = '待发布';
    style = 'warning';
  }
  if (status === 'PUBLISHED') {
    text = '已发布';
    style = 'success';
  }
  return <Badge status={style} text={text} />;
}

function displayType(show) {
  let text = '';
  if (show === 'SHOW') {
    text = '是';
  }
  if (show === 'HIDE') {
    text = '否';
  }
  return <span>{text}</span>;
}

export { npcType, npcStatus, npcpublish, displayType };
