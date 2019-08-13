const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 12 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
    md: { span: 14, offset: 8 },
  },
};

const registerData = [
  { label: '姓名', value: 'NAME' },
  { label: '手机号', value: 'PHONE' },
  { label: '证件类型(身份证&港澳台护照)', value: 'ID_TYPE' },
  { label: '证件号码', value: 'ID_NUMBER' },
  { label: '线下抽签地址', value: 'OFFLINE_DRAW_ADDRESS' },
];

const formItemFillRow = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export { formItemLayout, formItemLayoutWithOutLabel, registerData, formItemFillRow };
