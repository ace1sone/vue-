import React, { Fragment } from 'react';
import { Input, Form, Select, Table, Button, Radio, message } from 'antd';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';
import { PropTypes } from 'prop-types';
import TaskDialog from './TaskDialog';
import { spuColumns, taskTableColumns, activityTableColumns } from './TableColumns';
import SpuDialog from './SpuDialog';
import NpcShop from './NpcShop';
import ActivityDialog from './ActivityDialog';

import EvenlySplitRow from '@/components/EvenlySplitRow';
import UploadAction from '@/common/UploadAction';

const { TextArea } = Input;

@Form.create()
class IntroContentForm extends React.Component {
  static propTypes = {
    mode: PropTypes.string,
  };

  static defaultProps = {
    mode: 'edit',
  };

  cacheOriginData = {};

  state = {
    data: {},
    value: {},
    taskModal: false,
    spuModal: false,
    activityModal: false,
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
    const { type } = data;
    const newData = name === 'type' ? { type } : _.cloneDeep(data);
    if (name === 'npc') {
      newData.npcId = !_.isEmpty(v) ? v[0].npcId : null;
      newData.npcName = !_.isEmpty(v) ? v[0].name : null;
    }
    if (v && !_.isEmpty(v)) {
      newData[name] = v;
      if (name === 'image') {
        newData[name] = v.map(ele => ele.url).join();
      }
      if (name === 'videoCoverUrl' || name === 'videoUrl' || name === 'voiceCoverUrl' || name === 'voiceUrl' || name === 'imageUrl') {
        const [first] = v.map(ele => ele.url);
        newData[name] = first;
      }
    }
    this.setState({ data: newData });
    const { onChange } = this.props;
    onChange(newData);
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
  addSpuTable = item => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (newData.productId) {
      message.error('只能添加一个商品');
      return;
    }

    newData.productId = item.spuId;
    newData.productName = item.spuName;

    this.setState({ data: newData });
    const { onChange } = this.props;
    onChange(newData);
  };

  removeSpuTable = () => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);

    delete newData.productId;
    delete newData.productName;

    this.setState({ data: newData });
    const { onChange } = this.props;
    onChange(newData);
  };

  // 增加
  addRelatedTask = item => {
    const { id, name, type, invitationType } = item;
    const { data } = this.state;
    const newData = _.cloneDeep(data);

    if (newData.taskId) {
      message.error('只能添加一个任务');
      return;
    }
    newData.taskId = id;
    newData.taskName = name;
    newData.taskType = type;
    if (type === 'INVITATION') {
      newData.invitationType = invitationType;
    }

    this.setState({ data: newData });
    const { onChange } = this.props;
    onChange(newData);
  };

  // 删除
  removeRelatedTask = () => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);

    delete newData.taskId;
    delete newData.taskName;
    delete newData.taskType;

    this.setState({ data: newData });
    const { onChange } = this.props;
    onChange(newData);
  };

  // 增加
  addActTable = item => {
    const { id, name } = item;
    const { data } = this.state;
    const newData = _.cloneDeep(data);

    if (newData.activityId) {
      message.error('只能添加一个活动');
      return;
    }
    newData.activityId = id;
    newData.activityName = name;

    this.setState({ data: newData });
    const { onChange } = this.props;
    onChange(newData);
  };

  // 删除
  removeActTable = () => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);

    delete newData.activityId;
    delete newData.activityName;

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
      activityId,
    } = this.props;
    const { data, taskModal, spuModal, activityModal } = this.state;

    const itemLayout = {
      labelAlign: 'left',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      colon: false,
    };

    const formItemLayout = {
      ...itemLayout,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    return (
      <Fragment>
        <div style={{ padding: '5px 0', fontSize: 16, fontWeight: 'bold' }}>热区{index + 1}</div>
        <EvenlySplitRow minCols={1}>
          <Form.Item label="热区气泡框文案:" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: data.name || '',
              rules: [{ required: true, message: '不能为空' }, { max: 10, message: '长度不超过10' }],
            })(<Input placeholder="请输入文案，长度不超过10个字" onChange={e => this.changeAndSave(e, 'name')} />)}
          </Form.Item>
        </EvenlySplitRow>
        <EvenlySplitRow minCols={1}>
          <Form.Item label="响应动作" {...formItemLayout}>
            弹出展示浮层
          </Form.Item>
        </EvenlySplitRow>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="内容类型:" {...formItemLayout}>
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
                <Select.Option value="VOICE" key="VOICE">
                  音频
                </Select.Option>
                {/** <Select.Option value="TASK" key="TASK">
                  任务
                </Select.Option> */}
                <Select.Option value="PRODUCT" key="PRODUCT">
                  商品
                </Select.Option>
                <Select.Option value="NPC" key="NPC">
                  NPC
                </Select.Option>
                <Select.Option value="ACTIVITY" key="ACTIVITY">
                  活动
                </Select.Option>
              </Select>
            )}
          </Form.Item>
        </EvenlySplitRow>

        <div style={{ display: data.contentType ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...formItemLayout}>
              {getFieldDecorator('contentTitle', {
                initialValue: data.contentTitle || '',
                rules: [
                  {
                    required: data.contentType !== 'ACTIVITY' && data.contentType !== 'NPC' && data.contentType !== 'PRODUCT',
                    message: '内容不能为空',
                  },
                  { max: 50, message: '长度不超过50' },
                ],
              })(<Input placeholder="请输入标题，限制50字以内" onChange={e => this.changeAndSave(e, 'contentTitle')} />)}
            </Form.Item>
          </EvenlySplitRow>
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...formItemLayout}>
              {getFieldDecorator('contentRemark', {
                initialValue: data.contentRemark || '',
              })(
                <TextArea
                  placeholder="请添加文字说明，限制1000字以内（选填）"
                  style={{ width: 480, height: 88 }}
                  onChange={e => this.changeAndSave(e, 'contentRemark')}
                />
              )}
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.contentType === 'IMAGE' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...formItemLayout}>
              {getFieldDecorator('imageUrl', {
                initialValue: data.imageUrl || [],
                rules: [{ required: data.contentType === 'IMAGE', message: '内容不能为空' }],
              })(<UploadAction onChange={v => this.changeDynamic(v, 'imageUrl')} maxCount={1} />)}
              <p>支持.jpg .png 格式,大小≤1M</p>
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.contentType === 'VIDEO' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label="封面图" {...formItemLayout}>
              {getFieldDecorator('videoCoverUrl', {
                initialValue: data.videoCoverUrl || [],
                rules: [{ required: data.contentType === 'VIDEO', message: '内容不能为空' }],
              })(<UploadAction onChange={v => this.changeDynamic(v, 'videoCoverUrl')} maxCount={1} />)}
              <p>尺寸：600X480，支持.jpg .png 格式，大小≤1M</p>
            </Form.Item>
          </EvenlySplitRow>
          <EvenlySplitRow minCols={1}>
            <Form.Item label="视频" {...formItemLayout}>
              {getFieldDecorator('videoUrl', {
                initialValue: data.videoUrl || [],
                rules: [{ required: data.contentType === 'VIDEO', message: '内容不能为空' }],
              })(
                <UploadAction
                  onChange={v => this.changeDynamic(v, 'videoUrl')}
                  supportTypes={['video/mp4']}
                  maxSize={1024 * 1024 * 50}
                  timeout={600000}
                />
              )}
              <p>支持 .mp4格式，大小≤50M</p>
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.contentType === 'VOICE' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label="封面图" {...formItemLayout}>
              {getFieldDecorator('voiceCoverUrl', {
                initialValue: data.voiceCoverUrl || [],
                rules: [{ required: data.contentType === 'VOICE', message: '内容不能为空' }],
              })(<UploadAction onChange={v => this.changeDynamic(v, 'voiceCoverUrl')} maxCount={1} />)}
              <p>尺寸：600X480，支持.jpg .png 格式，大小≤1M</p>
            </Form.Item>
          </EvenlySplitRow>
          <EvenlySplitRow minCols={1}>
            <Form.Item label="音频" {...formItemLayout}>
              {getFieldDecorator('voiceUrl', {
                initialValue: data.voiceUrl || [],
                rules: [{ required: data.contentType === 'VOICE', message: '内容不能为空' }],
              })(
                <UploadAction
                  supportTypes={['audio/mp3']}
                  maxSize={1024 * 1024 * 10}
                  onChange={v => this.changeDynamic(v, 'voiceUrl')}
                  timeout={60000}
                  maxCount={1}
                />
              )}
              <p>支持 .mp3格式，大小≤10M</p>
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.contentType === 'PRODUCT' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...formItemLayout}>
              <Table
                columns={spuColumns({ removeSpuTable: this.removeSpuTable }, false)}
                rowKey="spuId"
                dataSource={data.productId ? [{ spuId: data.productId, spuName: data.productName }] : []}
                pagination={false}
              />
              <Button icon="plus" onClick={() => this.setState({ spuModal: true })} disabled={data.productId}>
                添加商品
              </Button>
              <SpuDialog
                visible={spuModal}
                activityId={activityId}
                onCancel={() => this.setState({ spuModal: false })}
                onAdd={this.addSpuTable}
                spuDatas={data.productId ? [{ spuId: data.productId, spuName: data.productName }] : []}
              />
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.contentType === 'NPC' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...formItemLayout}>
              {getFieldDecorator('npcinfo', {
                initialValue: data.npcId ? [{ npcId: data.npcId, name: data.npcName }] : [],
              })(<NpcShop onChange={v => this.changeDynamic(v, 'npc')} />)}
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.contentType === 'ACTIVITY' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...formItemLayout}>
              <Table
                columns={activityTableColumns({ removeTable: this.removeActTable }, false)}
                rowKey="activityId"
                dataSource={data.activityId ? [{ activityId: data.activityId, activityName: data.activityName }] : []}
                pagination={false}
              />
              <Button icon="plus" onClick={() => this.setState({ activityModal: true })} disabled={data.activityId}>
                添加活动
              </Button>
              <ActivityDialog
                visible={activityModal}
                activityId={activityId}
                onCancel={() => this.setState({ activityModal: false })}
                onAdd={this.addActTable}
                mode="list"
                actInfo={data.activityId ? [{ activityId: data.activityId, activityName: data.activityName }] : []}
              />
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.contentType === 'TASK' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...formItemLayout}>
              <Table
                columns={taskTableColumns({ removeTable: this.removeTaskTable }, false)}
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
                activityId={activityId}
                onCancel={() => this.setState({ taskModal: false })}
                onAdd={this.addTaskTable}
                taskDatas={data.taskList || []}
              />
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="反馈可点条件:" {...formItemLayout}>
            {getFieldDecorator('condition', {
              initialValue: data.condition || 'DIRECT',
              rules: [{ required: true, message: '不能为空' }],
            })(
              <Radio.Group onChange={e => this.changeAndSave(e, 'condition')}>
                <Radio value="DIRECT">直接可点</Radio>
                <Radio value="INDIRECT">完成其他任务可点</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </EvenlySplitRow>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="关联任务:" {...formItemLayout}>
            {data.taskId && (
              <p style={{ lineHeight: '18px' }}>
                {data.taskName}
                <a onClick={this.removeRelatedTask} style={{ paddingLeft: 10 }}>
                  清空
                </a>
                <br />
                ID:{data.taskId}
              </p>
            )}
            <Button
              type="primary"
              onClick={() =>
                this.setState({
                  taskModal: true,
                })
              }
              disabled={data.taskId || data.condition === 'DIRECT'}
            >
              请选择
            </Button>
            <TaskDialog
              visible={taskModal}
              activityId={activityId}
              onCancel={() => this.setState({ taskModal: false })}
              onAdd={this.addRelatedTask}
              taskDatas={data.taskId ? [{ id: data.taskId, name: data.taskName, type: data.taskType }] : []}
            />
          </Form.Item>
        </EvenlySplitRow>
      </Fragment>
    );
  }
}

export default IntroContentForm;
