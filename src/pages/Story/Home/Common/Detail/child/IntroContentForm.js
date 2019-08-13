import React, { Fragment } from 'react';
import { Input, Form, Select } from 'antd';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';
import { PropTypes } from 'prop-types';

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
    const newData = name === 'type' ? { type, sortNumber } : _.cloneDeep(data);
    if (v && !_.isEmpty(v)) {
      newData[name] = v;
      if (name === 'image') {
        newData[name] = v.map(ele => ele.url).join();
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
      mode,
    } = this.props;
    const { data } = this.state;

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
        <div style={{ padding: '5px 0', fontSize: 16, fontWeight: 'bold' }}>内容类型</div>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="简介内容：" {...updloadFormItemLayout}>
            {getFieldDecorator('type', {
              initialValue: data.type || '',
              rules: [{ required: false, message: '类型不能为空' }],
            })(
              <Select style={{ width: '200px' }} placeholder="请选择" onChange={e => this.changeDynamic(e, 'type')} disabled={mode === 'view'}>
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
              </Select>
            )}
          </Form.Item>
        </EvenlySplitRow>

        <div style={{ display: data.type === 'TEXT' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label="  " {...updloadFormItemLayout}>
              {getFieldDecorator('content', {
                initialValue: data.content || '',
              })(
                <TextArea
                  placeholder="请输入内容"
                  style={{ width: 480, height: 88 }}
                  onChange={e => this.changeAndSave(e, 'content')}
                  disabled={mode === 'view'}
                />
              )}
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.type === 'IMAGE' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label="  " {...updloadFormItemLayout}>
              {getFieldDecorator('content', {
                initialValue: data.content || '',
              })(
                <TextArea
                  placeholder="请输入内容"
                  style={{ width: 480, height: 88 }}
                  onChange={e => this.changeAndSave(e, 'content')}
                  disabled={mode === 'view'}
                />
              )}
            </Form.Item>
          </EvenlySplitRow>
          <EvenlySplitRow minCols={1}>
            <Form.Item label="图片文件" {...updloadFormItemLayout}>
              {mode !== 'view' ? (
                getFieldDecorator('image', {
                  initialValue: data.image || [],
                  rules: [{ required: data.type === 'IMAGE', message: '内容不能为空' }],
                })(
                  <UploadAction onChange={v => this.changeDynamic(v, 'image')} maxCount={1} supportTypes={['image/jpeg', 'image/jpg', 'image/png']} />
                )
              ) : (
                <img src={data.image} style={{ width: 100 }} alt="" />
              )}
              {mode !== 'view' && <p>支持.jpg .png 格式，大小≤1M</p>}
            </Form.Item>
          </EvenlySplitRow>
        </div>

        <div style={{ display: data.type === 'VIDEO' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label="  " {...updloadFormItemLayout}>
              {getFieldDecorator('content', {
                initialValue: data.content || '',
              })(
                <TextArea
                  placeholder="请输入内容"
                  style={{ width: 480, height: 88 }}
                  onChange={e => this.changeAndSave(e, 'content')}
                  disabled={mode === 'view'}
                />
              )}
            </Form.Item>
          </EvenlySplitRow>
          <EvenlySplitRow minCols={1}>
            <Form.Item label="封面图" {...updloadFormItemLayout}>
              {mode !== 'view' ? (
                getFieldDecorator('videoCover', {
                  initialValue: data.videoCover || [],
                  rules: [{ required: data.type === 'VIDEO', message: '内容不能为空' }],
                })(
                  <UploadAction
                    onChange={v => this.changeDynamic(v, 'videoCover')}
                    maxCount={1}
                    supportTypes={['image/jpeg', 'image/jpg', 'image/png']}
                  />
                )
              ) : (
                <img src={data.videoCover} style={{ width: 100 }} alt="" />
              )}
              {mode !== 'view' && <p>尺寸比例与视频保持一致，支持.jpg .png 格式，大小≤1M</p>}
            </Form.Item>
          </EvenlySplitRow>
          <EvenlySplitRow minCols={1}>
            <Form.Item label="视频" {...updloadFormItemLayout}>
              {mode !== 'view' ? (
                getFieldDecorator('videoSrc', {
                  initialValue: data.videoSrc || [],
                  rules: [{ required: data.type === 'VIDEO', message: '内容不能为空' }],
                })(
                  <UploadAction
                    onChange={v => this.changeDynamic(v, 'videoSrc')}
                    supportTypes={['video/mp4']}
                    maxSize={1024 * 1024 * 50}
                    timeout={600000}
                    disabled={mode === 'view'}
                    maxCount={1}
                  />
                )
              ) : (
                /* eslint-disable */
                <video src={data.videoSrc} controls="controls" style={{ width: 200 }} />
              )}
              {mode !== 'view' && <p>支持 .mp4格式，大小≤50M</p>}
            </Form.Item>
          </EvenlySplitRow>
        </div>
      </Fragment>
    );
  }
}

export default IntroContentForm;
