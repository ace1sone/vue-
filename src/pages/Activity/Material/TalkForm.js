import React, { Fragment } from 'react';
import { Input, Form, Select, Button, Table, message } from 'antd';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';
import { PropTypes } from 'prop-types';

import EvenlySplitRow from '@/components/EvenlySplitRow';
import UploadAction from '@/common/UploadAction';
import TaskDialog from './TaskDialog';
import SpuDialog from './SpuDialog';
import { spuColumns, taskTableColumns } from './TableColumns';
import DynamicInput from './DynamicInput';
import { renderContent } from '@/pages/Activity/Sale/Common/common';

const { TextArea } = Input;

@Form.create()
class TalkForm extends React.Component {
  static propTypes = {
    mode: PropTypes.string,
  };

  static defaultProps = {
    mode: 'edit',
  };

  cacheOriginData = {};

  childForm = null;

  englishSeriesInput = [];

  state = {
    taskModal: false,
    spuModal: false,
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
    const { type, sortNumber, options, npcId, content } = data;
    const newData = name === 'contentType' ? { type, sortNumber, options, npcId, content } : _.cloneDeep(data);
    if (v) {
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

  changeAnswerDynamic = (v, name) => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (!newData.options || newData.options.length === 0 || name === 'contentType') {
      newData.options = [{}];
    }
    if (v) {
      newData.options[0][name] = v;
    } else {
      newData.options = [];
    }
    this.setState({ data: newData });
    const { onChange } = this.props;
    onChange(newData);
  };

  changeAnswerSave = (v, name) => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (!newData.options || newData.options.length === 0 || name === 'contentType') newData.options = [{}];
    if (v.target) {
      newData.options[0][name] = v.target.value;
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData);
    }
  };

  changeOptionsDynamic = (v, name) => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (v && v.length > 0) {
      newData[name] = v.map(ele => ({ contentType: 'TEXT', ...ele }));
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData);
    }
  };

  getDefaultVal = (arr = []) => {
    if (!_.isEmpty(arr)) return arr;
    return null;
  };

  getTaskList = () => {
    const { data } = this.state;
    return data.taskList || [];
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
  };

  // 删除
  removeTaskTable = async row => {
    const { id } = row;

    const { data } = this.state;
    const newData = _.cloneDeep(data);
    newData.taskList = newData.taskList.filter(item => item.id !== id);

    this.setState({ data: newData });
  };

  // 增加
  addSpuTable = item => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (!newData.spuList) newData.spuList = [];
    if (newData.spuList.length > 0) {
      message.error('只能添加一个商品');
      return;
    }
    newData.spuList.push(item);

    this.setState({ data: newData });
  };

  // 删除
  removeSpuTable = async row => {
    const { id } = row;

    const { data } = this.state;
    const newData = _.cloneDeep(data);
    newData.spuList = newData.spuList.filter(item => item.id !== id);

    this.setState({ data: newData });
  };

  getChildData = () => {
    const { data } = this.state;
    return data || {};
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
      npclist,
      materialId,
    } = this.props;

    const { taskModal, spuModal, disabled } = this.state;

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
          <Form.Item label="对话归属：" labelCol={{ span: 6 }}>
            NPC
          </Form.Item>
          <Form.Item label="内容ID：" {...updloadFormItemLayout}>
            {data.id}
          </Form.Item>
        </EvenlySplitRow>
        <EvenlySplitRow minCols={1}>
          <Form.Item label="NPC:" {...updloadFormItemLayout}>
            {getFieldDecorator('npcId', {
              initialValue: data.npcId || '',
              rules: [{ required: true, message: 'npc不能为空' }],
            })(
              <Select style={{ width: '200px' }} placeholder="请选择" onChange={e => this.changeDynamic(e, 'npcId')}>
                <Select.Option value="">请选择NPC</Select.Option>
                {npclist &&
                  npclist.map(ele => (
                    <Select.Option value={ele.npcId} key={ele.npcId}>
                      {ele.name}
                    </Select.Option>
                  ))}
              </Select>
            )}
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
                <Select.Option value="IMAGE" key="IMAGE">
                  图片
                </Select.Option>
                <Select.Option value="VIDEO" key="VIDEO">
                  视频
                </Select.Option>
                {/** <Select.Option value="VOICE" key="VOICE">
                  音频
                </Select.Option>
                <Select.Option value="TASK" key="TASK">
                  任务
                </Select.Option>
                <Select.Option value="PRODUCT" key="PRODUCT">
                  商品
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
                rules: [{ required: true, message: '关联内容必填！' }],
              })(<TextArea placeholder="请输入内容" style={{ width: 480, height: 88 }} onChange={e => this.changeAndSave(e, 'content')} />)}
            </Form.Item>
          </EvenlySplitRow>
        </div>
        <div style={{ display: data.contentType === 'IMAGE' ? 'block' : 'none' }}>
          {renderContent(data, getFieldDecorator, e => this.changeAndSave(e, 'content'))}
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
          {renderContent(data, getFieldDecorator, e => this.changeAndSave(e, 'content'))}
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
        <div style={{ display: data.contentType === 'VOICE' ? 'block' : 'none' }}>
          {renderContent(data, getFieldDecorator, e => this.changeAndSave(e, 'content'))}
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...updloadFormItemLayout}>
              {getFieldDecorator('voiceSrc', {
                initialValue: data.voiceSrc || [],
                rules: [{ required: data.contentType === 'VOICE', message: '内容不能为空' }],
              })(
                <UploadAction
                  onChange={v => this.changeDynamic(v, 'voiceSrc')}
                  supportTypes={['audio/mp3']}
                  maxSize={1024 * 1024 * 5}
                  timeout={60000}
                />
              )}
              <p>支持 .mp3格式，大小≤5M</p>
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
        <div style={{ display: data.contentType === 'PRODUCT' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...updloadFormItemLayout}>
              <Table
                columns={spuColumns({ removeSpuTable: this.removeSpuTable }, disabled)}
                rowKey="spuId"
                dataSource={data.spuList || []}
                pagination={false}
              />
              <Button icon="plus" onClick={() => this.setState({ spuModal: true })} disabled={data.spuList && data.spuList.length > 0}>
                添加商品
              </Button>
              <SpuDialog
                visible={spuModal}
                onCancel={() => this.setState({ spuModal: false })}
                onAdd={this.addSpuTable}
                spuDatas={data.spuList || []}
              />
            </Form.Item>
          </EvenlySplitRow>
        </div>
        <EvenlySplitRow minCols={1}>
          <Form.Item label="对话归属：" {...updloadFormItemLayout}>
            用户
          </Form.Item>
        </EvenlySplitRow>

        {/** 用户区先遍历，再展示添加区 */}
        <EvenlySplitRow minCols={1}>
          <Form.Item label="内容类型：" {...updloadFormItemLayout}>
            {getFieldDecorator('userContentType', {
              initialValue: data.options && data.options.length > 0 ? data.options[0].contentType : '',
              rules: [{ required: false, message: '类型不能为空' }],
            })(
              <Select style={{ width: '200px' }} placeholder="请选择" onChange={e => this.changeAnswerDynamic(e, 'contentType')}>
                <Select.Option value="" key="">
                  请选择类型
                </Select.Option>
                <Select.Option value="OPTION_DEFAULT_TEXT" key="OPTION_DEFAULT_TEXT">
                  纯文本
                </Select.Option>
                <Select.Option value="OPTION_TEXT" key="OPTION_TEXT">
                  回复选项(至多5个)
                </Select.Option>
                <Select.Option value="OPTION_INPUT" key="OPTION_INPUT">
                  用户回复-纯文本
                </Select.Option>
                <Select.Option value="OPTION_IMAGE" key="OPTION_IMAGE">
                  用户回复-图片
                </Select.Option>
              </Select>
            )}
          </Form.Item>
        </EvenlySplitRow>

        <div style={{ display: data.options && data.options.length > 0 && data.options[0].contentType === 'OPTION_DEFAULT_TEXT' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...updloadFormItemLayout}>
              {getFieldDecorator('answerText', {
                initialValue: data.options && data.options.length > 0 ? data.options[0].content : '',
                rules: [
                  {
                    required: data.options && data.options.length > 0 && data.options[0].contentType === 'OPTION_DEFAULT_TEXT',
                    message: '内容不能为空',
                  },
                ],
              })(<TextArea placeholder="请输入内容" style={{ width: 480, height: 88 }} onChange={e => this.changeAnswerSave(e, 'content')} />)}
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.options && data.options.length > 0 && data.options[0].contentType === 'OPTION_TEXT' ? 'block' : 'none' }}>
          {getFieldDecorator('options', {
            initialValue: data.options || [{ title: '', content: '' }],
          })(
            <DynamicInput
              label="回复选项"
              placeholder="请输入回复选项，限制20字以内"
              placeholder2="请添加对话内容"
              wrappedComponentRef={ele => {
                this.childForm = ele;
              }}
              materialId={materialId}
              activityId={activityId || ''}
              isNeedValidate={_.get(data, `options[0].contentType`, '') === 'OPTION_TEXT'}
              basic={{ contentType: 'OPTION_TEXT', title: '' }}
              onChange={v => this.changeOptionsDynamic(v, 'options')}
            />
          )}
        </div>

        <div style={{ display: data.options && data.options.length > 0 && data.options[0].contentType === 'OPTION_IMAGE' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label="按钮文案：" {...updloadFormItemLayout}>
              {getFieldDecorator('title', {
                initialValue: data.options && data.options.length > 0 ? data.options[0].title : '',
                rules:
                  data.options && data.options.length > 0 && data.options[0].contentType === 'OPTION_IMAGE'
                    ? [{ required: true, message: '内容不能为空' }, { max: 10, message: '按钮文案最多10个字' }]
                    : [],
              })(<Input placeholder="请输入内容" style={{ width: 480 }} onChange={e => this.changeAnswerSave(e, 'title')} />)}
            </Form.Item>
          </EvenlySplitRow>
        </div>
      </Fragment>
    );
  }
}

export default TalkForm;
