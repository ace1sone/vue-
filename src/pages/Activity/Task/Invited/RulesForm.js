import React from 'react';
import { Card, Input, Form, Col, Row, Select, DatePicker, message, Radio, Icon, Button, InputNumber } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import { completedResult } from '../Common/SwitchForm';
import { formItemLayout, formItemLayoutWithOutLabel } from '../Common/FormLayout';
import styles from '../Common/RulesForm.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

@Form.create()
class RulesForm extends React.Component {
  addTip = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat('');
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  removeTip = (k, index) => {
    const { form } = this.props;
    const keys = [...form.getFieldValue('keys')];
    const inviteesNumbers = [...form.getFieldValue('inviteesNumbers')];
    if (keys.length === 1) {
      return;
    }
    keys.splice(index, 1);
    inviteesNumbers.splice(index, 1);
    form.setFieldsValue({
      keys,
      inviteesNumbers,
    });
  };

  handleGetReward = current => {
    const { chooesResult, relatedTask } = this.props;
    let result = current;
    if (current === 'DRAW_CODE' && relatedTask.type !== 'DRAW') {
      result = 'NONE';
    }
    chooesResult(result);
  };

  render() {
    const {
      detail,
      form: { getFieldDecorator, setFieldsValue, getFieldValue },
      disabled,
      actInfo,
      relatedTask,
    } = this.props;
    const { action, inviteDetail } = detail;

    getFieldDecorator('reward', { initialValue: !_.isEmpty(inviteDetail.reward) ? inviteDetail.reward : 'NONE' });
    getFieldDecorator('keys', { initialValue: !_.isEmpty(inviteDetail.inviteesNumbers) ? inviteDetail.inviteesNumbers : [''] });
    const keys = getFieldValue('keys');
    return (
      <Card title="规则信息" bordered={false}>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="任务时间设置">
              {action !== '1' ? (
                getFieldDecorator('syncActivityTime', {
                  initialValue: inviteDetail.syncActivityTime || false,
                  getValueFromEvent: val => {
                    if (val && actInfo.id) {
                      setFieldsValue({ time: [moment(actInfo.start), moment(actInfo.end)] });
                    } else {
                      message.error('尚未关联发售，无法同步时间!');
                      return !val;
                    }
                    return val.target.value;
                  },
                })(
                  <Radio.Group>
                    <Radio value>同步关联活动</Radio>
                    <Radio value={false}>单独设置</Radio>
                  </Radio.Group>
                )
              ) : (
                <span className="ant-form-text">{inviteDetail.syncActivityTime ? '同步关联活动' : '单独设置'}</span>
              )}
            </Form.Item>
            <Form.Item {...formItemLayoutWithOutLabel}>
              {action !== '1' ? (
                getFieldDecorator('time', {
                  initialValue: inviteDetail.time || undefined,
                  rules: [
                    {
                      required: !getFieldValue('syncActivityTime'),
                      message: '时间必填的哦！',
                    },
                  ],
                })(<RangePicker mode="month" showTime allowClear disabled={getFieldValue('syncActivityTime')} />)
              ) : (
                <div>
                  <span className="ant-form-text">{inviteDetail.time && moment(inviteDetail.time[0]).format('YYYY-MM-DD HH:mm:ss')}</span>
                  <span className="ant-form-text">{inviteDetail.time && moment(inviteDetail.time[1]).format('YYYY-MM-DD HH:mm:ss')}</span>
                </div>
              )}

              <p style={{ color: 'red', fontSize: 16, lineHeight: '20px' }}>
                任务结束时间一到，任务所关联的商品将变成不可购买的状态，请谨慎设置结束时间。
              </p>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="邀请类型">
              {action !== '1' ? (
                getFieldDecorator('invitationType', {
                  initialValue: inviteDetail.invitationType || '',
                  rules: [
                    {
                      required: true,
                      message: '邀请类型必填的哦！',
                    },
                  ],
                })(
                  <Select style={{ width: 264 }}>
                    <Option value="">请选择</Option>
                    <Option value="NEWUSER">邀请新伙伴</Option>
                    <Option value="NEWUSERANDOLDUSER">告知新老朋友</Option>
                  </Select>
                )
              ) : (
                <span className="ant-form-text">{inviteDetail.invitationType === 'NEWUSER' ? '邀请新伙伴' : '告知新老朋友'}</span>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="设置阶梯邀请人数">
              <div>
                {keys &&
                  keys.map((k, index) => (
                    <Form.Item required={false} key={k || index}>
                      <span className={styles.index}>0{index + 1}</span>
                      {getFieldDecorator(`inviteesNumbers[${index}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        initialValue: k || [],
                        rules: [
                          {
                            required: true,
                            message: '必填！',
                          },
                        ],
                      })(<Input className={styles['input-field']} type="number" min={1} disabled={disabled} />)}
                      {keys.length > 1 && !disabled ? (
                        <Icon className="dynamic-delete-button" type="delete" onClick={() => this.removeTip(k, index)} />
                      ) : null}
                    </Form.Item>
                  ))}
                {!disabled && (
                  <Button type="dashed" onClick={this.addTip} className={styles['add-btn']}>
                    <Icon type="plus" />
                    添加
                  </Button>
                )}
                <p style={{ color: 'red', fontSize: 16, lineHeight: '20px' }}>除了抽签码可设置多阶梯，其他都不要设置多阶梯</p>
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="完成结果">
              {action !== '1' ? (
                getFieldDecorator('reward', {
                  initialValue: inviteDetail.reward || 'NONE',
                  getValueFromEvent: val => {
                    if (val.target.value === 'DRAW_CODE') {
                      if (relatedTask.type !== 'DRAW') {
                        message.error('请先关联抽签任务');
                        return 'NONE';
                      }
                    }
                    return val.target.value;
                  },
                })(
                  <Radio.Group onChange={e => this.handleGetReward(e.target.value)}>
                    <Radio value="NONE">无</Radio>
                    <Radio value="UNLOCK_PRODUCT_BUY_ABILITY">解锁商品购买资格</Radio>
                    <Radio value="DRAW_CODE">抽签码</Radio>
                  </Radio.Group>
                )
              ) : (
                <span className="ant-form-text">{inviteDetail && completedResult(inviteDetail)}</span>
              )}
            </Form.Item>
          </Col>
        </Row>
        {getFieldValue('reward') === 'UNLOCK_PRODUCT_BUY_ABILITY' ? (
          <Row gutter={24}>
            <Col lg={12} md={12} sm={24}>
              <Form.Item {...formItemLayout} label="购买资格数量限制">
                {action !== '1' ? (
                  getFieldDecorator('numberLimit', {
                    initialValue: _.toNumber(inviteDetail.issuanceNumber) > 0 ? 2 : 1,
                  })(
                    <Radio.Group onChange={e => e.target.value && setFieldsValue({ issuanceNumber: '' })}>
                      <Radio value={1}>无数量限制</Radio>
                      <Radio value={2}>手动输入数量</Radio>
                    </Radio.Group>
                  )
                ) : (
                  <span className="ant-form-text">{_.toNumber(inviteDetail.issuanceNumber) < 1 ? '无数量限制' : '手动输入数量'}</span>
                )}
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <Form.Item {...formItemLayout} label="购买资格发放数量">
                {action !== '1' ? (
                  getFieldDecorator('issuanceNumber', {
                    initialValue: inviteDetail.issuanceNumber || 0,
                    rules: [
                      {
                        required: getFieldValue('numberLimit') === 2,
                        message: '必填！',
                      },
                    ],
                  })(<InputNumber min={1} disabled={getFieldValue('numberLimit') === 1} />)
                ) : (
                  <span className="ant-form-text">{inviteDetail.issuanceNumber}</span>
                )}
              </Form.Item>
            </Col>
          </Row>
        ) : null}
        {getFieldValue('reward') === 'UNLOCK_PRODUCT_BUY_ABILITY' ? (
          <Row gutter={24}>
            <Col lg={12} md={12} sm={24}>
              <Form.Item {...formItemLayout} label="发放方式">
                {action !== '1' ? (
                  getFieldDecorator('issuanceMethod', {
                    initialValue: inviteDetail.issuanceMethod || 'TIMED',
                    rules: [
                      {
                        required: true,
                        message: '发放方式必填的哦！',
                      },
                    ],
                  })(
                    <Select style={{ width: 168 }} onChange={e => e === 'MANUAL' && setFieldsValue({ puzzleIssuanceTime: undefined })}>
                      <Option value="TIMED">定时发放</Option>
                      {/* <Option value="MANUAL">手动发放</Option> */}
                    </Select>
                  )
                ) : (
                  <span className="ant-form-text">{inviteDetail.issuanceMethod === 'TIMED' ? '定时发放' : '手动发放'}</span>
                )}
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <Form.Item {...formItemLayout} label="发放时间">
                {action !== '1' ? (
                  getFieldDecorator('issuanceTime', {
                    initialValue: inviteDetail.issuanceTime ? moment(inviteDetail.issuanceTime) : undefined,
                    rules: [
                      {
                        required: getFieldValue('issuanceMethod') === 'TIMED',
                        message: '发放时间必填的哦！',
                      },
                    ],
                  })(<DatePicker disabled={getFieldValue('issuanceMethod') === 'MANUAL'} showTime allowClear />)
                ) : (
                  <span className="ant-form-text">
                    {inviteDetail.issuanceTime ? moment(inviteDetail.issuanceTime).format('YYYY-MM-DD HH:mm:ss') : ''}
                  </span>
                )}
              </Form.Item>
            </Col>
          </Row>
        ) : null}
        {getFieldValue('reward') === 'DRAW_CODE' && (
          <Row gutter={24}>
            <Col lg={12} md={12} sm={24}>
              <Form.Item {...formItemLayout} label="发放方式">
                <span className="ant-form-text">自动发放</span>
              </Form.Item>
            </Col>
          </Row>
        )}
      </Card>
    );
  }
}

export default RulesForm;
