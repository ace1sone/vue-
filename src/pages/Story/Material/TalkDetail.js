import React, { Fragment } from 'react';
import { Form, Table, Input } from 'antd';
import isEqual from 'lodash/isEqual';
import { PropTypes } from 'prop-types';
import _ from 'lodash';

import EvenlySplitRow from '@/components/EvenlySplitRow';
import UploadAction from '@/common/UploadAction';
import { spuColumns, taskTableColumns } from './TableColumns';
import DynamicInput from './DynamicInput';
import { renderContent, RenderImg } from '@/pages/Activity/Sale/Common/common';
import { getDialogContentType, getUserAnswerType } from './common';

const { TextArea } = Input;
@Form.create()
class TalkDetail extends React.Component {
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

  getType2 = v => (v === 'OPTION_DEFAULT_TEXT' ? '纯文本' : '回复选项');

  render() {
    const {
      form: { getFieldDecorator },
      index,
      npclist,
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
    const npc = npclist.find(ele => ele.npcId === data.npcId);

    return (
      <Fragment>
        <div style={{ padding: '5px 0', fontSize: 16, fontWeight: 'bold' }}>对话{index + 1}</div>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="对话归属：" labelCol={{ span: 6 }} labelAlign="left">
            NPC
          </Form.Item>
          <Form.Item label="内容ID：" {...updloadFormItemLayout}>
            {data.id}
          </Form.Item>
        </EvenlySplitRow>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="NPC:" {...updloadFormItemLayout}>
            {!_.isEmpty(npc) ? npc.name : ''}
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
              <TextArea value={data.content} placeholder="请输入内容" style={{ width: 480, height: 88 }} disabled />
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
              {getFieldDecorator('videoSrc', {
                initialValue: data.videoSrc || [],
              })(<UploadAction supportTypes={['video/mp4']} maxSize={1024 * 1024 * 10} timeout={60000} />)}
            </Form.Item>
          </EvenlySplitRow>
        </div>
        <div style={{ display: data.contentType === 'VOICE' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...updloadFormItemLayout}>
              {getFieldDecorator('voiceSrc', {
                initialValue: data.voiceSrc || [],
              })(<UploadAction supportTypes={['audio/mp3']} maxSize={1024 * 1024 * 5} timeout={60000} />)}
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
        <div style={{ display: data.contentType === 'PRODUCT' ? 'block' : 'none' }}>
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...updloadFormItemLayout}>
              <Table
                columns={spuColumns({ removeSpuTable: this.removeSpuTable }, true)}
                rowKey="spuId"
                dataSource={data.spuList || []}
                pagination={false}
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
            {data.options && data.options.length > 0 ? getUserAnswerType(data.options[0].contentType) : '无'}
          </Form.Item>
        </EvenlySplitRow>

        {data.options && data.options.length > 0 && data.options[0].contentType === 'OPTION_DEFAULT_TEXT' && (
          <EvenlySplitRow minCols={1}>
            <Form.Item label=" " {...updloadFormItemLayout}>
              {data.options[0].content && (
                <TextArea placeholder="请输入内容" value={data.options[0].content} style={{ width: 480, height: 88 }} disabled />
              )}
            </Form.Item>
          </EvenlySplitRow>
        )}

        <div style={{ display: data.options && data.options.length > 0 && data.options[0].contentType === 'OPTION_TEXT' ? 'block' : 'none' }}>
          {getFieldDecorator('options', {
            initialValue: data.options || [{ title: '', content: '' }],
          })(
            <DynamicInput
              label="回复选项"
              placeholder="请输入回复选项"
              basic={{}}
              onChange={v => this.changeOptionsDynamic(v, 'options')}
              mode="view"
            />
          )}
        </div>

        {data.options && data.options.length > 0 && data.options[0].contentType === 'OPTION_IMAGE' && (
          <EvenlySplitRow minCols={1}>
            <Form.Item label="按钮文案：" {...updloadFormItemLayout}>
              {data.options[0].title}
            </Form.Item>
          </EvenlySplitRow>
        )}
      </Fragment>
    );
  }
}

export default TalkDetail;
