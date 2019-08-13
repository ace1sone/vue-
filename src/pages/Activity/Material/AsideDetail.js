import React, { Fragment } from 'react';
import { Form, Input } from 'antd';
import isEqual from 'lodash/isEqual';
import { PropTypes } from 'prop-types';

import EvenlySplitRow from '@/components/EvenlySplitRow';
import { getDialogContentType } from './common';

const { TextArea } = Input;
@Form.create()
class AsideDetail extends React.Component {
  static propTypes = {
    mode: PropTypes.string,
  };

  static defaultProps = {
    mode: 'edit',
  };

  cacheOriginData = {};

  englishSeriesInput = [];

  state = {
    data: {},
    value: {},
  };

  constructor(props) {
    super(props);
    if (props.value) {
      this.state = {
        data: props.value,
        value: props.value,
      };
    }
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  render() {
    const {
      form: { getFieldDecorator },
      index,
    } = this.props;

    const formItemLayout = {
      labelAlign: 'left',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      colon: false,
    };

    const updloadFormItemLayout = {
      ...formItemLayout,
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };

    const { data } = this.state;

    return (
      <Fragment>
        <div style={{ padding: '5px 0', fontSize: 16, fontWeight: 'bold' }}>对话{index + 1}</div>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="内容归属：" labelCol={{ span: 6 }} labelAlign="left">
            旁白
          </Form.Item>
          <Form.Item label="内容ID：" {...updloadFormItemLayout}>
            {data.id}
          </Form.Item>
        </EvenlySplitRow>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="内容类型：" {...updloadFormItemLayout}>
            {getDialogContentType(data.contentType)}
          </Form.Item>
        </EvenlySplitRow>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="  " {...updloadFormItemLayout}>
            {getFieldDecorator('content', {
              initialValue: data.content || '',
            })(<TextArea placeholder="请输入内容" style={{ width: 480, height: 88 }} disabled />)}
          </Form.Item>
        </EvenlySplitRow>
      </Fragment>
    );
  }
}

export default AsideDetail;
