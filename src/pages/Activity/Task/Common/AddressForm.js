import React from 'react';
import { Form, DatePicker, Row, Col, Select } from 'antd';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';
import moment from 'moment';

import styles from './Address.less';
import { formItemLayout } from './FormLayout';

const { Option } = Select;

@Form.create()
class AddressForm extends React.Component {
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

  getAddrName(id) {
    const { addressData } = this.props;
    if (!_.isEmpty(addressData)) {
      const addr = addressData.find(ele => ele.id === id);
      return !_.isEmpty(addr) ? addr.address : '';
    }
    return '';
  }

  chooseAndress = (v, name) => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (v) {
      newData[name] = v;
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData);
    }
  };

  handleGainTime = date => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (date) {
      newData.offlineDrawTime = moment(date);
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData);
    }
  };

  addrDetailName = id => {
    const { addressData } = this.props;
    if (!_.isEmpty(addressData)) {
      const addr = addressData.find(ele => ele.id === id);
      return !_.isEmpty(addr) ? addr.name : '';
    }
    return '';
  };

  render() {
    const {
      form: { getFieldDecorator },
      addressData,
      action,
      index,
    } = this.props;

    const { data } = this.state;
    return (
      <div>
        <div className={styles['address-bg']}>
          <div className={styles['address-index']}>地址0{index + 1}</div>
          <Row gutter={24}>
            <Col lg={12} md={12} sm={24}>
              <Form.Item {...formItemLayout} label="店铺名称">
                {action !== '1' ? (
                  <Select value={data.storeAddressId || ''} onChange={e => this.chooseAndress(e, 'storeAddressId')} style={{ width: 300 }}>
                    {addressData.map(ele => (
                      <Option key={ele.id} value={ele.id}>
                        {ele.name}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <span>{this.addrDetailName(data.storeAddressId)}</span>
                )}
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <Form.Item {...formItemLayout} label="线下抽签时间">
                {action !== '1' ? (
                  getFieldDecorator('offlineDrawTime', {
                    initialValue: data.offlineDrawTime ? moment(data.offlineDrawTime) : null,
                    rules: [{ required: true, message: '不能为空' }],
                  })(<DatePicker showToday={false} showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss" onChange={this.handleGainTime} />)
                ) : (
                  <span>{moment(data.offlineDrawTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12} md={12} sm={24}>
              <Form.Item {...formItemLayout} label="详细地址">
                <span>{this.getAddrName(data.storeAddressId)}</span>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default AddressForm;
