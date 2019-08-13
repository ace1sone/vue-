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
      allBrands,
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

    console.log(data);
    return (
      <Fragment>
        <div style={{ padding: '5px 0', fontSize: 16, fontWeight: 'bold' }}>系列{index + 1}</div>
        <EvenlySplitRow>
          <Form.Item label="系列ID">
            {getFieldDecorator('id', {
              initialValue: data.id || '',
            })(<Input disabled />)}
          </Form.Item>
        </EvenlySplitRow>

        <div>
          {getFieldDecorator('englishNames', {
            initialValue: this.getDefaultVal(data.seriesAttachList.filter(ele => ele.fieldCode === '1')) || [
              { isOfficial: 0, isEnglish: 0, isDefault: 0, fieldCode: '1', fieldName: '名称_英文' },
            ],
          })(
            <DynamicInput
              ref={ele => {
                this.englishSeriesInput = ele;
              }}
              label="系列名称（英文）："
              placeholder="请输入系列名称（英文）"
              basic={{
                fieldCode: '1',
                fieldName: '名称_英文',
              }}
              options={{
                required: true,
                rules: [
                  {
                    required: true,
                    message: '系列名称不能为空',
                  },
                ],
              }}
              onChange={v => this.changeDynamic(v, 'englishNames')}
            />
          )}
        </div>

        <div>
          {getFieldDecorator('chineseNames', {
            initialValue: this.getDefaultVal(data.seriesAttachList.filter(ele => ele.fieldCode === '2')) || [
              { isOfficial: 0, isChinese: 0, isDefault: 0, fieldCode: '2', fieldName: '名称_中文' },
            ],
          })(
            <DynamicInput
              label="系列名称（中文）："
              placeholder="请输入系列名称（中文）"
              basic={{
                fieldCode: '2',
                fieldName: '名称_中文',
              }}
              onChange={v => this.changeDynamic(v, 'chineseNames')}
            />
          )}
        </div>

        <div>
          {getFieldDecorator('englishAlias', {
            initialValue: this.getDefaultVal(data.seriesAttachList.filter(ele => ele.fieldCode === '3')) || [
              { isOfficial: 0, isDefault: 0, fieldCode: '3', fieldName: '别名_英文' },
            ],
          })(
            <DynamicInput
              label="系列别名（英文）："
              placeholder="请输入系列别名（英文）"
              basic={{
                fieldCode: '3',
                fieldName: '别名_英文',
              }}
              onChange={v => this.changeDynamic(v, 'englishAlias')}
            />
          )}
        </div>

        <div>
          {getFieldDecorator('chineseAlias', {
            initialValue: this.getDefaultVal(data.seriesAttachList.filter(ele => ele.fieldCode === '4')) || [
              { isOfficial: 0, isDefault: 0, fieldCode: '4', fieldName: '别名_中文' },
            ],
          })(
            <DynamicInput
              label="系列别名（中文）："
              placeholder="请输入系列别名（中文）"
              basic={{
                fieldCode: '4',
                fieldName: '别名_中文',
              }}
              onChange={v => this.changeDynamic(v, 'chineseAlias')}
            />
          )}
        </div>

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

        <EvenlySplitRow>
          <Form.Item label="所属国家">
            {getFieldDecorator('country', {
              initialValue: data.country,
            })(
              <Select
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={e => this.changeDynamic(e, 'country')}
              >
                {country.map($ => (
                  <Option value={$.value} key={$.value}>
                    {$.label}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </EvenlySplitRow>

        <EvenlySplitRow>
          <Form.Item {...formItemLayout} label="是否联名">
            {getFieldDecorator('isJoint', {
              initialValue: data.isJoint === 0 ? data.isJoint : 1,
            })(
              <Radio.Group onChange={e => this.changeAndSave(e, 'isJoint')}>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </EvenlySplitRow>

        <div style={{ display: data.isJoint === 0 ? 'block' : 'none' }}>
          {getFieldDecorator('jointList', {
            initialValue: this.getDefaultVal(data.jointList) || [{ isDefault: 0, createdBy: 1, updatedBy: 1 }],
          })(
            <DynamicInput
              label="联名品牌："
              placeholder="请选择联名品牌"
              official={false}
              basic={{
                seriesId: data.seriesId || '',
              }}
              type="select"
              allItems={allBrands}
              onChange={v => this.changeDynamic(v, 'jointList')}
            />
          )}
        </div>

        <div>
          {getFieldDecorator('contacters', {
            initialValue: this.getDefaultVal(data.seriesAttachList.filter(ele => ele.fieldCode === '6')) || [
              { isDefault: 0, fieldCode: '6', fieldName: '相关人' },
            ],
          })(
            <DynamicInput
              label="主理人/相关人："
              placeholder="请输入主理人/相关人"
              official={false}
              basic={{
                fieldCode: '6',
                fieldName: '相关人',
              }}
              onChange={v => this.changeDynamic(v, 'contacters')}
            />
          )}
        </div>

        <div>
          {getFieldDecorator('designers', {
            initialValue: this.getDefaultVal(data.seriesAttachList.filter(ele => ele.fieldCode === '7')) || [
              { isDefault: 0, fieldCode: '7', fieldName: '设计师' },
            ],
          })(
            <DynamicInput
              label="设计师："
              placeholder="请输入设计师"
              official={false}
              basic={{
                fieldCode: '7',
                fieldName: '设计师',
              }}
              onChange={v => this.changeDynamic(v, 'designers')}
            />
          )}
        </div>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="简介：" {...updloadFormItemLayout}>
            {getFieldDecorator('desc',{
              initialValue: data.desc || '',
            })(
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

        <EvenlySplitRow minCols={1}>
          <Form.Item label="Logo白底图" {...updloadFormItemLayout}>
            {getFieldDecorator('blank_log', {
              initialValue: data.blank_log || [],
              rules: [{ required: true, message: '图片不能为空' }],
            })(<UploadAction onChange={v => this.changeDynamic(v, 'blank_log')} />)}
          </Form.Item>
        </EvenlySplitRow>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="其他" {...updloadFormItemLayout}>
            {getFieldDecorator('other', {
              initialValue: data.other || [],
            })(<UploadAction onChange={v => this.changeDynamic(v, 'other')} />)}
          </Form.Item>
        </EvenlySplitRow>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="海报" {...updloadFormItemLayout}>
            {getFieldDecorator('poster', {
              initialValue: data.poster || [],
            })(<UploadAction onChange={v => this.changeDynamic(v, 'poster')} />)}
          </Form.Item>
        </EvenlySplitRow>

        <EvenlySplitRow minCols={1}>
          <Form.Item label="视频" {...updloadFormItemLayout}>
            {getFieldDecorator('video', {
              initialValue: data.video || [],
            })(
              <UploadAction supportTypes={['video/mp4']} maxSize={1024 * 1024 * 10} timeout={60000} onChange={v => this.changeDynamic(v, 'video')} />
            )}
          </Form.Item>
        </EvenlySplitRow>
      </Fragment>
    );
  }
}

export default TableForm;
