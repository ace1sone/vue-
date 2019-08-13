import React from 'react';
import { Select, Form, Row, Col, Input } from 'antd';
import { get } from 'lodash';
import styles from './WaybillDetail.less';

const { Option } = Select;
const { TextArea } = Input;
const fieldStyle = {
  width: '264px',
  height: '32px',
};

class DetailForm extends React.Component {
  handleSelectChange = value => {
    const { form } = this.props;
    form.setFieldsValue({
      paymentMethod: value,
    });
  };

  render() {
    const { status } = this.props;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const expressCompanies = Object.entries(get(this.props, ['waybill', 'expressCompanies'])).map(v => (
      <Option key={`${v[0]}`} value={`${v[0]}`}>
        {v[1]}
      </Option>
    ));
    const waybill = get(this.props, ['waybill', 'waybillDetail']);
    const { paymentMethod } = form.getFieldsValue();
    const fee = get(waybill, ['fee']);
    const paymentMethodName = get(waybill, ['paymentMethodName']);

    return (
      <Form>
        <Row>
          <Col span={12}>
            {expressCompanies && (
              <Form.Item label="快递公司">
                {getFieldDecorator(`expressCompany`, {
                  rules: [
                    {
                      required: true,
                      message: '请选择快递公司!',
                    },
                  ],
                })(
                  <Select style={fieldStyle} placeholder="选择快递公司">
                    {expressCompanies}
                  </Select>
                )}
              </Form.Item>
            )}
          </Col>
          <Col span={12}>
            <Form.Item label="快递单号">
              {getFieldDecorator(`expressNumber`, {
                rules: [
                  {
                    required: true,
                    message: '请填写快递单号!',
                  },
                ],
              })(<Input style={fieldStyle} placeholder="快递单号" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            {status === 'shipping' && (
              <Form.Item label="结算方式">
                {getFieldDecorator(`paymentMethod`, {
                  rules: [
                    {
                      required: true,
                      message: '请选择结算方式!',
                    },
                  ],
                })(
                  <Select style={fieldStyle} placeholder="选择结算方式" onChange={this.handleSelectChange}>
                    <Option value="1">单次</Option>
                    <Option value="2">月结</Option>
                  </Select>
                )}
              </Form.Item>
            )}
            {status !== 'shipping' && (
              <div className="description">
                <span className="title">结算方式: </span>
                <span className="detail">{paymentMethodName}</span>
              </div>
            )}
          </Col>
          <Col span={12}>
            {status === 'shipping' && paymentMethod === '1' && (
              <Form.Item label="运费（元）">
                {getFieldDecorator(`fee`, {
                  rules: [
                    {
                      // type: 'number',
                      required: true,
                      message: '请输入运费！',
                    },
                  ],
                })(<Input style={fieldStyle} placeholder="运费" />)}
              </Form.Item>
            )}
            {status === 'shipping' && paymentMethod === '2' && (
              <div className="description">
                <span className="title">运费（元）: </span>
                <span className="detail">{fee}</span>
              </div>
            )}
            {status === 'editing' && (
              <div className="description">
                <span className="title">运费: </span>
                <span className="detail">{fee}</span>
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={24} className={styles.textArea}>
            {/* {status === 'shipping' && <Form.Item label="操作备注">{getFieldDecorator(`remark`, {})(<TextArea placeholder="操作备注" />)}</Form.Item>}
            {status !== 'shipping' && (
              <div className="description">
                <span className="title">操作备注: </span>
                <span className="detail">{remark}</span>
              </div>
            )} */}
            <Form.Item label="操作备注">{getFieldDecorator(`remark`, {})(<TextArea placeholder="操作备注" />)}</Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default DetailForm;
