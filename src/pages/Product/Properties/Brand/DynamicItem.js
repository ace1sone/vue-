import React from 'react';
import { Input, Col, Row, Form, Radio, Select } from 'antd';
import _ from 'lodash';
import { PropTypes } from 'prop-types';

@Form.create()
class DynamicItem extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    options: PropTypes.object,
    placeholder: PropTypes.string,
    official: PropTypes.bool,
    type: PropTypes.string,
    allItems: PropTypes.array,
  };

  static defaultProps = {
    index: 0,
    options: {},
    placeholder: '',
    official: true,
    type: 'input',
    allItems: [],
  };

  constructor(props) {
    super(props);
    if (props.val) {
      this.state = {
        data: props.val,
      };
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { value } = props;
    const { data } = state;
    if (!_.isEqual(value, data)) {
      return {
        data: value,
      };
    }
    return null;
  }

  changeSelect = (v, op, a, b) => {
    const { index } = this.props;
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (v) {
      newData[a] = v;
      newData[b] = op.props.children;
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData, index);
    }
  };

  changeAndSave(e, name) {
    const { index } = this.props;
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (e.target) {
      newData[name] = e.target.value;
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData, index);
    }
  }

  remove(i) {
    const { onDelete } = this.props;
    onDelete(i);
  }

  render() {
    const {
      form: { getFieldDecorator },
      index,
      options,
      placeholder,
      official,
      type,
      allItems,
    } = this.props;

    const formItemLayout = {
      labelAlign: 'left',
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
    };

    const { data } = this.state;

    return (
      <Row gutter={24} style={{display: data.delFlag === 1 ? 'none' : 'block'}}>
        {type === 'input' && (
          <Col lg={11} md={11} sm={24}>
            <Form.Item {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: data.name || '',
                ...options,
              })(<Input placeholder={placeholder} disabled={data.spuBinded} onChange={e => this.changeAndSave(e, 'name')} />)}
            </Form.Item>
          </Col>
        )}

        {type === 'select' && (
          <Col lg={11} md={11} sm={24}>
            <Form.Item {...formItemLayout}>
              {getFieldDecorator('id', {
                initialValue: data.jointId || '',
                ...options,
              })(
                <Select placeholder={placeholder} onChange={(v, op) => this.changeSelect(v, op, 'jointId', 'jointName')}>
                  {allItems.map($ => (
                    <Select.Option value={$.id} key={$.id}>
                      {$.englishName || $.chineseName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        )}

        <Col lg={11} md={11} sm={24} style={{ display: 'flex' }}>
          {official && (
            <Form.Item label="是否为官方名称：" style={{ flex: 2 }} labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
              {getFieldDecorator('isOfficial', {
                initialValue: data.isOfficial || 0,
              })(
                <Radio.Group disabled={index === 0 ? true : false} onChange={e => this.changeAndSave(e, 'isOfficial')}>
                  <Radio value={0}>是</Radio>
                  <Radio value={1}>否</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          )}
          {index > 0 && (
            <Form.Item style={{ flex: 1 }}>
              <a onClick={() => this.remove(index)}>删除</a>
            </Form.Item>
          )}
        </Col>
      </Row>
    );
  }
}

export default DynamicItem;
