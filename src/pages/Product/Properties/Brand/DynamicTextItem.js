import React from 'react';
import { Input, Col, Row, Form, Select } from 'antd';
import _ from 'lodash';
import { PropTypes } from 'prop-types';
import styles from './brandform.less';

@Form.create()
class DynamicTextItem extends React.Component {
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

  render() {
    const {
      form: { getFieldDecorator },
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
      <Row gutter={24} style={{ display: data.delFlag === 1 ? 'none' : 'block' }}>
        {type === 'input' && (
          <Col lg={11} md={11} sm={24}>
            <Form.Item {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: data.name || '',
                ...options,
              })(<Input readOnly className={styles.nobordInput} />)}
            </Form.Item>
          </Col>
        )}

        {type === 'select' && (
          <Col lg={11} md={11} sm={24}>
            <Form.Item {...formItemLayout}>
              {getFieldDecorator('id', {
                initialValue: data.id || '',
                ...options,
              })(
                <Select placeholder={placeholder} disabled className={styles.nobordInput}>
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
                initialValue: data.isOfficial === 0 ? '是' : '否',
              })(<Input readOnly className={styles.nobordInput} />)}
            </Form.Item>
          )}
        </Col>
      </Row>
    );
  }
}

export default DynamicTextItem;
