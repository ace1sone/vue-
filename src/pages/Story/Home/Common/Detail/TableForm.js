import React, { Fragment } from 'react';
import { Input, Form, Radio, Select } from 'antd';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';

import EvenlySplitRow from '@/components/EvenlySplitRow';
import UploadAction from '@/common/UploadAction';
import DynamicInput from './DynamicInput';
import { country } from '@/constant/form.config';

const { Option } = Select;
const { TextArea } = Input;

@Form.create()
class TableForm extends React.Component {
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
        <div style={{ padding: '5px 0', fontSize: 16, fontWeight: 'bold' }}>系列{index + 1}</div>

        <div>
          {getFieldDecorator('shortName', {
            initialValue: this.getDefaultVal(data.seriesAttachList.filter(ele => ele.fieldCode === '5')) || [
              { isOfficial: 0, isDefault: 0, fieldCode: '5', fieldName: '简称' },
            ],
          })(
            <DynamicInput
              label="系列简称："
              placeholder="请输入系列简称"
              basic={{
                fieldCode: '5',
                fieldName: '简称',
              }}
              onChange={v => this.changeDynamic(v, 'shortName')}
            />
          )}
        </div>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="简介：" {...updloadFormItemLayout}>
            {getFieldDecorator('desc')(
              <TextArea placeholder="请输入简介" style={{ width: 480, height: 88 }} onChange={e => this.changeAndSave(e, 'desc')} />
            )}
          </Form.Item>
        </EvenlySplitRow>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="Logo大图" {...updloadFormItemLayout}>
            {getFieldDecorator('big_logo', {
              initialValue: data.big_logo || [],
              rules: [{ required: true, message: '图片不能为空' }],
            })(<UploadAction onChange={v => this.changeDynamic(v, 'big_logo')} />)}
          </Form.Item>
        </EvenlySplitRow>
      </Fragment>
    );
  }
}

export default TableForm;
