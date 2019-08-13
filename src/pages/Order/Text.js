export function getStatusText(text) {
  let statusText = '';

  switch (text) {
    case 1:
      statusText = '待支付';
      break;
    case 2:
      statusText = '待支付';
      break;
    case 3:
      statusText = '待发货';
      break;
    case 4:
      statusText = '待收货';
      break;
    case 5:
      statusText = '已取消';
      break;
    case 6:
      statusText = '已关闭';
      break;
    case 7:
      statusText = '已完成';
      break;
    default:
      statusText = '';
  }

  return statusText;
}

export function getTypeText(text) {
  let typeText = '';

  switch (text) {
    case 1:
      typeText = '常规订单';
      break;
    case 2:
      typeText = '预售订单';
      break;
    case 3:
      typeText = '预定订单';
      break;
    default:
      typeText = '';
  }

  return typeText;
}

export function reverseTypeText(text) {
  let reverseText = '';

  switch (text) {
    case 'ONLY_REFUND':
      reverseText = '仅退款';
      break;
    case 'RETURN_NOT_REFUND':
      reverseText = '退货不退款';
      break;
    case 'RETURN_REFUND':
      reverseText = '退款退货';
      break;
    case 'TIME_OUT':
      reverseText = '系统自动取消';
      break;
    case 'BUYER':
      reverseText = '客户取消';
      break;
    case 'SELLER':
      reverseText = '客服取消';
      break;
    default:
      reverseText = '';
  }

  return reverseText;
}

export function subordinateText(text) {
  let subText = '';

  switch (text) {
    case 1:
      subText = 'B2C';
      break;
    case 2:
      subText = 'C2C';
      break;
    case 3:
      subText = 'C2C商家';
      break;
    default:
      subText = '';
  }

  return subText;
}

export function paymentText(text) {
  let payTypeText = '';

  switch (text) {
    case 1:
      payTypeText = '常规订单全款';
      break;
    case 2:
      payTypeText = '预售订单全款';
      break;
    case 3:
      payTypeText = '预定订单定金';
      break;
    case 4:
      payTypeText = '预定订单尾款';
      break;
    default:
      payTypeText = '';
  }

  return payTypeText;
}

export function payChannelText(text) {
  let channelText = '';

  switch (text) {
    case 'aliPay':
      channelText = '支付宝';
      break;
    case 'wechatPay':
      channelText = '微信';
      break;
    default:
      channelText = '';
  }

  return channelText;
}

export function operatingText(text) {
  let opeText = '';

  switch (text) {
    case 'CREATE':
      opeText = '申请售后';
      break;
    case 'FINISH':
      opeText = '完成售后';
      break;
    case 'CANCEL':
      opeText = '取消订单';
      break;
    default:
      opeText = '';
  }

  return opeText;
}
