import React, { Fragment } from 'react';
import { Form, Table, Input } from 'antd';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';
import { PropTypes } from 'prop-types';

import EvenlySplitRow from '@/components/EvenlySplitRow';
// import UploadAction from '@/common/UploadAction';
import { taskTableColumns } from './TableColumns';
import { renderContent, RenderImg } from '@/pages/Activity/Sale/Common/common';
import { getDialogContentType } from './common';

const { TextArea } = Input;

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

@Form.create()
class OutvoiceDetail extends React.Component {
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

  getDefaultVal = (arr = []) => {
    if (!_.isEmpty(arr)) return arr;
    return null;
  };

  render() {
    const {
      form: { getFieldDecorator },
      index,
    } = this.props;
    const { data } = this.state;

    getFieldDecorator('sortNumber', {
      initialValue: index + 1,
    });

    return (
      <Fragment>
        <div style={{ padding: '5px 0', fontSize: 16, fontWeight: 'bold' }}>对话{index + 1}</div>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="内容归属：" labelCol={{ span: 6 }} labelAlign="left">
            画外音
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

        <div style={{ display: data.contentType === 'TEXT' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label="  " {...updloadFormItemLayout}>
              {getFieldDecorator('content', {
                initialValue: data.content || '',
              })(<TextArea placeholder="请输入内容" style={{ width: 480, height: 88 }} disabled />)}
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.contentType === 'IMAGE' ? 'block' : 'none' }}>
          {renderContent(data, getFieldDecorator)}
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...updloadFormItemLayout}>
              <RenderImg images={data.images || []} />
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.contentType === 'VIDEO' ? 'block' : 'none' }}>
          {renderContent(data, getFieldDecorator)}
          <EvenlySplitRow minCols={1}>
            <Form.Item label="封面图" {...updloadFormItemLayout}>
              <img src={data.videoCover} width={100} alt="" />
            </Form.Item>
          </EvenlySplitRow>
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...updloadFormItemLayout}>
              {/* eslint-disable */}
              <video src={data.videoSrc} controls style={{ width: 100, height: 100 }} />
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.contentType === 'TASK' ? 'block' : 'none' }}>
          {renderContent(data, getFieldDecorator)}
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...updloadFormItemLayout}>
              <Table
                columns={taskTableColumns({ removeTable: this.removeTaskTable }, true)}
                rowKey="taskId"
                dataSource={data.taskList || []}
                pagination={false}
              />
            </Form.Item>
          </EvenlySplitRow>
        </div>
      </Fragment>
    );
  }
}

export default OutvoiceDetail;
