export function getDialogContentType(v) {
  let value;

  switch (v) {
    case 'TEXT':
      value = '纯文本';
      break;
    case 'IMAGE':
      value = '图片';
      break;
    case 'VIDEO':
      value = '视频';
      break;
    case 'VOICE':
      value = '音频';
      break;
    case 'TASK':
      value = '任务';
      break;
    case 'PRODUCT':
      value = '商品';
      break;
    default:
      value = '文本';
  }

  return value;
}

export function getUserAnswerType(v) {
  let value;

  switch (v) {
    case 'OPTION_DEFAULT_TEXT':
      value = '纯文本';
      break;
    case 'OPTION_TEXT':
      value = '回复选项';
      break;
    case 'OPTION_INPUT':
      value = '用户回复-纯文本';
      break;
    case 'OPTION_IMAGE':
      value = '用户回复-图片';
      break;

    default:
      value = '无';
  }

  return value;
}
