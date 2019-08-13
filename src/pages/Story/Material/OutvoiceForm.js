import React, { Fragment } from 'react';
import { Input, Form, Select, Button, Table, message } from 'antd';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';
import { PropTypes } from 'prop-types';

import EvenlySplitRow from '@/components/EvenlySplitRow';
import UploadAction from '@/common/UploadAction';
import TaskDialog from './TaskDialog';
import { taskTableColumns } from './TableColumns';
import { renderContent } from '@/pages/Activity/Sale/Common/common';

const { TextArea } = Input;

@Form.create()
class OutvoiceForm extends React.Component {
  static propTypes = {
    mode: PropTypes.string,
  };

  static defaultProps = {
    mode: 'edit',
  };

  cacheOriginData = {};

  englishSeriesInput = [];

  state = {
    taskModal: false,
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
    const { type, sortNumber } = data;
    const newData = name === 'contentType' ? { type, sortNumber } : _.cloneDeep(data);
    if (v && !_.isEmpty(v)) {
      newData[name] = v;
      if (name === 'images') {
        newData[name] = v.map(ele => ele.url);
      }
      if (name === 'videoCover' || name === 'videoSrc' || name === 'voiceSrc') {
        const [first] = v.map(ele => ele.url);
        newData[name] = first;
      }
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData);
    }
  };

  getDefaultVal = (arr = []) => {
    if (!_.isEmpty(arr)) return arr;
    return null;
  };

  getChildData = () => {
    const { data } = this.state;
    return data || {};
  };

  // 增加
  addTaskTable = item => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (!newData.taskList) newData.taskList = [];
    if (newData.taskList.length > 0) {
      message.error('只能添加一个任务');
      return;
    }
    const { id } = item;
    newData.taskList.push({ taskId: id, ...item });

    this.setState({ data: newData });
    const { onChange } = this.props;
    onChange(newData);
  };

  // 删除
  removeTaskTable = async row => {
    const { id } = row;

    const { data } = this.state;
    const newData = _.cloneDeep(data);
    newData.taskList = newData.taskList.filter(item => item.id !== id);

    this.setState({ data: newData });
    const { onChange } = this.props;
    onChange(newData);
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
      ids,
      activityId,
    } = this.props;
    const { data, taskModal, disabled } = this.state;

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

    getFieldDecorator('sortNumber', {
      initialValue: index + 1,
    });

    return (
      <Fragment>
        <div style={{ padding: '5px 0', fontSize: 16, fontWeight: 'bold' }}>对话{index + 1}</div>
        <EvenlySplitRow minCols={1}>
          <Form.Item label="内容归属：" labelCol={{ span: 6 }}>
            画外音
          </Form.Item>
          <Form.Item label="内容ID：" {...updloadFormItemLayout}>
            {data.id}
          </Form.Item>
        </EvenlySplitRow>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="内容类型：" {...updloadFormItemLayout}>
            {getFieldDecorator('contentType', {
              initialValue: data.contentType || '',
              rules: [{ required: true, message: '类型不能为空' }],
            })(
              <Select style={{ width: '200px' }} placeholder="请选择" onChange={e => this.changeDynamic(e, 'contentType')}>
                <Select.Option value="">请选择类型</Select.Option>
                <Select.Option value="TEXT" key="TEXT">
                  纯文本
                </Select.Option>
                <Select.Option value="IMAGE" key="IMAGE">
                  图片
                </Select.Option>
                <Select.Option value="VIDEO" key="VIDEO">
                  视频
                </Select.Option>
                {/** <Select.Option value="TASK" key="TASK">
                  任务
                  </Select.Option> */}
              </Select>
            )}
          </Form.Item>
        </EvenlySplitRow>

        <div style={{ display: data.contentType === 'TEXT' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label="  " {...updloadFormItemLayout}>
              {getFieldDecorator('content', {
                initialValue: data.content || '',
                rules: [{ required: true, message: '内容不能为空' }],
              })(<TextArea placeholder="请输入内容" style={{ width: 480, height: 88 }} onChange={e => this.changeAndSave(e, 'content')} />)}
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.contentType === 'IMAGE' ? 'block' : 'none' }}>
          {/* {renderContent(data, getFieldDecorator, e => this.changeAndSave(e, 'content'))} */}
          <EvenlySplitRow minCols={1}>
            <Form.Item label="  " {...updloadFormItemLayout}>
              {getFieldDecorator('content', {
                initialValue: data.content || '',
              })(
                <TextArea
                  placeholder="请输入图片名称，前端不展示"
                  maxLength="30"
                  style={{ width: 480, height: 88 }}
                  onChange={e => this.changeAndSave(e, 'content')}
                />
              )}
            </Form.Item>
          </EvenlySplitRow>
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...updloadFormItemLayout}>
              {getFieldDecorator('images', {
                initialValue: (data.images && data.images.map(ele => ({ url: ele }))) || [],
                rules: [{ required: data.contentType === 'IMAGE', message: '内容不能为空' }],
              })(<UploadAction onChange={v => this.changeDynamic(v, 'images')} />)}
              <p>支持.jpg .png 格式，大小≤1M</p>
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.contentType === 'VIDEO' ? 'block' : 'none' }}>
          {/* {renderContent(data, getFieldDecorator, e => this.changeAndSave(e, 'content'))} */}
          <EvenlySplitRow minCols={1}>
            <Form.Item label="  " {...updloadFormItemLayout}>
              {getFieldDecorator('content', {
                initialValue: data.content || '',
              })(
                <TextArea
                  placeholder="请输入图片名称，前端不展示"
                  maxLength="30"
                  style={{ width: 480, height: 88 }}
                  onChange={e => this.changeAndSave(e, 'content')}
                />
              )}
            </Form.Item>
          </EvenlySplitRow>
          <EvenlySplitRow minCols={1}>
            <Form.Item label="封面图" {...updloadFormItemLayout}>
              {getFieldDecorator('videoCover', {
                initialValue: data.videoCover || [],
                rules: [{ required: data.contentType === 'VIDEO', message: '内容不能为空' }],
              })(<UploadAction onChange={v => this.changeDynamic(v, 'videoCover')} maxCount={1} />)}
              <p>尺寸比例与视频保持一致，支持.jpg .png 格式，大小≤1M</p>
            </Form.Item>
          </EvenlySplitRow>
          <EvenlySplitRow minCols={1}>
            <Form.Item label="视频" {...updloadFormItemLayout}>
              {getFieldDecorator('videoSrc', {
                initialValue: data.videoSrc || [],
                rules: [{ required: data.contentType === 'VIDEO', message: '内容不能为空' }],
              })(
                <UploadAction
                  onChange={v => this.changeDynamic(v, 'videoSrc')}
                  supportTypes={['video/mp4']}
                  maxSize={1024 * 1024 * 50}
                  timeout={600000}
                  maxCount={1}
                />
              )}
              <p>支持 .mp4格式，图片大小≤50M</p>
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.contentType === 'TASK' ? 'block' : 'none' }}>
          {renderContent(data, getFieldDecorator, e => this.changeAndSave(e, 'content'))}
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...updloadFormItemLayout}>
              <Table
                columns={taskTableColumns({ removeTable: this.removeTaskTable }, disabled)}
                rowKey="taskId"
                dataSource={data.taskList || []}
                pagination={false}
              />
              <Button
                icon="plus"
                onClick={() => this.setState({ taskModal: true })}
                disabled={(data.taskList && data.taskList.length > 0) || !activityId}
              >
                添加任务
              </Button>
              <TaskDialog
                visible={taskModal}
                ids={ids}
                activityId={activityId}
                onCancel={() => this.setState({ taskModal: false })}
                onAdd={this.addTaskTable}
                taskDatas={data.taskList || []}
              />
            </Form.Item>
          </EvenlySplitRow>
        </div>
      </Fragment>
    );
  }
}

export default OutvoiceForm;
