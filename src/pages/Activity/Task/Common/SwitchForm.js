import React from 'react';

function taskStatus(detail) {
  const { status } = detail;
  let value;
  let color;
  switch (status) {
    case 'WAITING':
      value = '待开始';
      color = { color: '#faad14' };
      break;
    case 'STARTED':
      value = '已开始';
      color = { color: '#52c41a' };
      break;
    case 'ENDED':
      value = '已结束';
      color = { color: 'gray' };
      break;
    default:
      value = '';
  }
  return <span style={color}>{value}</span>;
}

function completedResult(detail) {
  const { reward } = detail;
  let value;
  switch (reward) {
    case 'NONE':
      value = '无';
      break;
    case 'UNLOCK_PRODUCT_BUY_ABILITY':
      value = '解锁商品购买资格';
      break;
    case 'DRAW_CODE':
      value = '抽签码';
      break;
    default:
      value = '';
  }
  return value;
}

function taskExchangeType(item) {
  let chinese = '';
  switch (item) {
    case 'INVITATION':
      chinese = '拉新任务';
      break;
    case 'PUZZLE':
      chinese = '寻找真相';
      break;
    case 'DRAW':
      chinese = '抽签任务';
      break;
    default:
  }
  return chinese;
}

export { taskStatus, completedResult, taskExchangeType };
