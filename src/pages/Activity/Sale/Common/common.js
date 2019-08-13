import React from 'react';
import { notification, Form, Input } from 'antd';
import router from 'umi/router';
import EvenlySplitRow from '@/components/EvenlySplitRow';
import styles from '@/pages/Activity/Sale/Common/Detail/ActivityData.less';

const { TextArea } = Input;

export function noticeRes(res, successText, failText) {
  if (res.data) {
    notification.success({ message: res.header.msg || successText || '操作成功' });
    return;
  }

  notification.error({ message: res.header.msg || failText || '出错了，稍后再试' });
}

export function goBack() {
  router.goBack();
}

export const formItemLayout = {
  labelAlign: 'left',
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
  colon: false,
};

export const updloadFormItemLayout = {
  ...formItemLayout,
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

export const renderContent = (data, getFieldDecorator, onChange, placeholder = '请输入图片名称，前端不展示') => {
  const { content } = data;
  const canEdit = onChange && typeof onChange === 'function';

  return (
    <EvenlySplitRow minCols={1}>
      <Form.Item label=" " {...updloadFormItemLayout}>
        {getFieldDecorator('content', {
          initialValue: content || '',
        })(<TextArea placeholder={placeholder} disabled={!canEdit} style={{ width: 480, height: 88 }} onChange={canEdit ? onChange : () => {}} />)}
      </Form.Item>
    </EvenlySplitRow>
  );
};

export const toNewTab = (text, url, className) => {
  const { origin, pathname } = window.location;
  return (
    <a href={`${origin}${pathname}#${url}`} className={className} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  );
};

export const RenderDialogText = ({ text }) => (
  <EvenlySplitRow minCols={1}>
    <Form.Item label="对话归属：" {...updloadFormItemLayout}>
      {text}
    </Form.Item>
  </EvenlySplitRow>
);

/* eslint-disable */
export const RenderImg = ({ images = [] }) =>
  images.map((src, index) => <img key={index} className={styles['img-item']} src={src} alt="图片" style={{ width: 100, height: 100 }} />);
