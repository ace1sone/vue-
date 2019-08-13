import React, { Fragment } from 'react';
import { Form, Button } from 'antd';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';
import { PropTypes } from 'prop-types';

import EvenlySplitRow from '@/components/EvenlySplitRow';
import UploadAction from '@/common/UploadAction';
import HotareaShop from './HotareaShop';

@Form.create()
class HotareaForm extends React.Component {
  static propTypes = {
    mode: PropTypes.string,
  };

  static defaultProps = {
    mode: 'edit',
  };

  cacheOriginData = {};

  englishSeriesInput = [];

  state = {
    hotModal: false,
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
      if (name === 'hotZoneImage' || name === 'videoCover' || name === 'videoSrc' || name === 'voiceSrc') {
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
  addHotarea = (item, obj) => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    newData.hotZoneList = item;
    newData.hotZoneHeight = obj.hotZoneHeight;
    newData.hotZoneWidth = obj.hotZoneWidth;

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
      activityId,
    } = this.props;
    const { data, hotModal } = this.state;

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
        <div style={{ padding: '5px 0', fontSize: 16, fontWeight: 'bold' }}>片段序号{0 + index + 1}</div>
        <EvenlySplitRow minCols={1}>
          <Form.Item label="对话归属：" labelCol={{ span: 6 }}>
            图片热区
          </Form.Item>
          <Form.Item label="内容ID：" {...updloadFormItemLayout}>
            {data.id}
          </Form.Item>
        </EvenlySplitRow>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="编辑热区" {...updloadFormItemLayout}>
            <HotareaShop
              visible={hotModal}
              img={data.hotZoneImage || ''}
              hotList={data.hotZoneList || []}
              activityId={activityId}
              onCancel={() => {
                this.setState({ hotModal: false });
                this.forceUpdate();
              }}
              onAdd={this.addHotarea}
            />

            {getFieldDecorator('hotZoneImage', {
              initialValue: data.hotZoneImage || [],
              rules: [{ required: true, message: '请先上传图片' }],
            })(
              <UploadAction
                maxCount={1}
                desc="尺寸:1080X1080，支持.jpg .png 格式，大小≤1MB"
                maxSize={1024 * 1024 * 1}
                onChange={v => this.changeDynamic(v, 'hotZoneImage')}
              />
            )}
            <Button
              type="primary"
              onClick={() =>
                this.setState({
                  hotModal: true,
                })
              }
              disabled={!data.hotZoneImage}
            >
              编辑热区
            </Button>
          </Form.Item>
        </EvenlySplitRow>
      </Fragment>
    );
  }
}

export default HotareaForm;
