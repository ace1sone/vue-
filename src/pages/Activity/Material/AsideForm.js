import React, { Fragment } from 'react';
import { Input, Form, Select } from 'antd';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';
import { PropTypes } from 'prop-types';

import EvenlySplitRow from '@/components/EvenlySplitRow';
import { RenderDialogText } from '@/pages/Activity/Sale/Common/common';

const { TextArea } = Input;

@Form.create()
class AsideForm extends React.Component {
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

  changeDynamic = (v, name) => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (v) {
      newData[name] = v;
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData);
    }
  };

  getDefaultVal = (arr = []) => {
    if (!_.isEmpty(arr)) return arr;
    return null;
  };

  changeAndSave(e, name) {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (e.target) {
      newData[name] = e.target.value;
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData);
    }
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
          <Form.Item label="内容归属：" labelCol={{ span: 6 }}>
            旁白
          </Form.Item>
          <Form.Item label="内容ID：" {...updloadFormItemLayout}>
            {data.id}
          </Form.Item>
        </EvenlySplitRow>
        <EvenlySplitRow minCols={1}>
          <Form.Item label="内容类型：" {...updloadFormItemLayout}>
            {getFieldDecorator('contentType', {
              initialValue: data.contentType || 'TEXT',
              rules: [{ required: true, message: '类型不能为空' }],
            })(
              <Select style={{ width: '200px' }} placeholder="请选择" onChange={e => this.changeDynamic(e, 'contentType')}>
                <Select.Option value="">请选择类型</Select.Option>
                <Select.Option value="TEXT" key="TEXT">
                  纯文本
                </Select.Option>
              </Select>
            )}
          </Form.Item>
        </EvenlySplitRow>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="  " {...updloadFormItemLayout}>
            {getFieldDecorator('content', {
              initialValue: data.content || '',
              rules: [{ required: true, message: '内容不能为空' }],
            })(<TextArea placeholder="请输入内容" style={{ width: 480, height: 88 }} onChange={e => this.changeAndSave(e, 'content')} />)}
          </Form.Item>
        </EvenlySplitRow>
      </Fragment>
    );
  }
}

export default AsideForm;
