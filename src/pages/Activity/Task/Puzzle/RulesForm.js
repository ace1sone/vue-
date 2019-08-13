import React from 'react';
import { Card, Input, Form, Col, Row, Select, DatePicker, message, Radio, Icon, Button, InputNumber } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { completedResult } from '../Common/SwitchForm';
import { formItemLayout, formItemLayoutWithOutLabel, formItemFillRow } from '../Common/FormLayout';
import styles from '../Common/RulesForm.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

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
    const puzzleTips = [...form.getFieldValue('puzzleTips')];
    if (keys.length === 1) {
      return;
    }
    keys.splice(index, 1);
    puzzleTips.splice(index, 1);
    form.setFieldsValue({
      keys,
      puzzleTips,
    });
  };

  handleGetReward = current => {
    const { chooesResult } = this.props;
    chooesResult(current);
  };

  render() {
    const {
      detail,
      form: { getFieldDecorator, setFieldsValue, getFieldValue },
      disabled,
      actInfo,
    } = this.props;
    const { action, puzzleDetail } = detail;

    getFieldDecorator('reward', { initialValue: !_.isEmpty(puzzleDetail.reward) ? puzzleDetail.reward : 'UNLOCK_PRODUCT_BUY_ABILITY' });
    getFieldDecorator('keys', { initialValue: _.isEmpty(puzzleDetail.puzzleTips) ? [''] : puzzleDetail.puzzleTips });
    const keys = getFieldValue('keys');
    return (
      <Card title="规则信息" bordered={false}>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="任务时间设置">
              {action !== '1' ? (
                getFieldDecorator('syncActivityTime', {
                  initialValue: puzzleDetail.syncActivityTime || false,
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
                <span className="ant-form-text">{puzzleDetail.syncActivityTime ? '同步关联活动' : '单独设置'}</span>
              )}
            </Form.Item>
            <Form.Item {...formItemLayoutWithOutLabel}>
              {action !== '1' ? (
                getFieldDecorator('time', {
                  initialValue: puzzleDetail.time || undefined,
                  rules: [
                    {
                      required: !getFieldValue('syncActivityTime'),
                      message: '时间必填的哦！',
                    },
                  ],
                })(<RangePicker mode="month" showTime allowClear disabled={getFieldValue('syncActivityTime')} />)
              ) : (
                <div>
                  <span className="ant-form-text">{puzzleDetail.time && moment(puzzleDetail.time[0]).format('YYYY-MM-DD HH:mm:ss')}</span>
                  <span className="ant-form-text">{puzzleDetail.time && moment(puzzleDetail.time[1]).format('YYYY-MM-DD HH:mm:ss')}</span>
                </div>
              )}

              <p style={{ color: 'red', fontSize: 16, lineHeight: '20px' }}>
                任务结束时间一到，任务所关联的商品将变成不可购买的状态，请谨慎设置结束时间。
              </p>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col sm={24}>
            <Form.Item {...formItemFillRow} label="解谜文案">
              {action !== '1' ? (
                getFieldDecorator('puzzleQuestion', {
                  initialValue: puzzleDetail.puzzleQuestion || '',
                  rules: [
                    {
                      required: true,
                      message: '解谜文案必填的哦！',
                    },
                    { max: 300, message: '解谜文案不能超过300个字!' },
                  ],
                })(<TextArea placeholder="添加解谜文案，限制300字以内" style={{ width: 960, height: 88 }} disabled={disabled} />)
              ) : (
                <span className="ant-form-text">{puzzleDetail.puzzleQuestion}</span>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="解谜提示">
              <div>
                {keys &&
                  keys.map((k, index) => (
                    <Form.Item required={false} key={k || index}>
                      {getFieldDecorator(`puzzleTips[${index}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        initialValue: k || '',
                        rules: [
                          {
                            required: true,
                            message: '必填！',
                          },
                          {
                            max: 30,
                            message: '解谜提示不能超过30个字！',
                          },
                        ],
                      })(<Input className={styles['puzzle-tips']} placeholder="请输入解谜提示，限制30字以内" disabled={disabled} />)}
                      {keys.length > 1 && !disabled ? (
                        <Icon className="dynamic-delete-button" type="delete" onClick={() => this.removeTip(k, index)} />
                      ) : null}
                    </Form.Item>
                  ))}
                {!disabled && (
                  <Button type="dashed" onClick={this.addTip} className={styles['puzzle-add-btn']}>
                    <Icon type="plus" />
                    添加
                  </Button>
                )}
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="正确答案">
              {action !== '1' ? (
                getFieldDecorator('puzzleAnswer', {
                  initialValue: puzzleDetail.puzzleAnswer || '',
                  rules: [
                    {
                      required: true,
                      message: '正确答案必填的哦！',
                    },
                    { max: 30, message: '正确答案不能超过30个字!' },
                  ],
                })(<Input placeholder="请输入正确答案，限制30字以内" disabled={disabled} />)
              ) : (
                <span className="ant-form-text">{puzzleDetail.puzzleAnswer}</span>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="完成结果">
              {action !== '1' ? (
                getFieldDecorator('reward', {
                  initialValue: puzzleDetail.reward || 'UNLOCK_PRODUCT_BUY_ABILITY',
                })(
                  <Radio.Group onChange={e => this.handleGetReward(e.target.value)}>
                    {/* <Radio value="NONE">无</Radio> */}
                    <Radio value="UNLOCK_PRODUCT_BUY_ABILITY">解锁商品购买资格</Radio>
                  </Radio.Group>
                )
              ) : (
                <span className="ant-form-text">{puzzleDetail && completedResult(puzzleDetail)}</span>
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
                    initialValue: _.toNumber(puzzleDetail.issuanceNumber) > 0 ? 2 : 1,
                  })(
                    <Radio.Group onChange={e => e.target.value && setFieldsValue({ issuanceNumber: '' })}>
                      <Radio value={1}>无数量限制</Radio>
                      <Radio value={2}>手动输入数量</Radio>
                    </Radio.Group>
                  )
                ) : (
                  <span className="ant-form-text">{_.toNumber(puzzleDetail.issuanceNumber) < 1 ? '无数量限制' : '手动输入数量'}</span>
                )}
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <Form.Item {...formItemLayout} label="购买资格发放数量">
                {action !== '1' ? (
                  getFieldDecorator('issuanceNumber', {
                    initialValue: puzzleDetail.issuanceNumber || 0,
                    rules: [
                      {
                        required: getFieldValue('numberLimit') === 2,
                        message: '必填！',
                      },
                    ],
                  })(<InputNumber min={1} disabled={getFieldValue('numberLimit') === 1} />)
                ) : (
                  <span className="ant-form-text">{puzzleDetail.issuanceNumber}</span>
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
                    initialValue: puzzleDetail.issuanceMethod || 'MANUAL',
                    rules: [
                      {
                        required: true,
                        message: '发放方式必填的哦！',
                      },
                    ],
                  })(
                    <Select style={{ width: 168 }} onChange={e => e === 'MANUAL' && setFieldsValue({ issuanceTime: undefined })}>
                      <Option value="TIMED">定时发放</Option>
                      <Option value="MANUAL">手动发放</Option>
                    </Select>
                  )
                ) : (
                  <span className="ant-form-text">{puzzleDetail.issuanceMethod === 'TIMED' ? '定时发放' : '手动发放'}</span>
                )}
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <Form.Item {...formItemLayout} label="发放时间">
                {action !== '1' ? (
                  getFieldDecorator('issuanceTime', {
                    initialValue: puzzleDetail.issuanceTime ? moment(puzzleDetail.issuanceTime) : undefined,
                    rules: [
                      {
                        required: getFieldValue('issuanceMethod') === 'TIMED',
                        message: '发放时间必填的哦！',
                      },
                    ],
                  })(<DatePicker disabled={getFieldValue('issuanceMethod') === 'MANUAL'} showTime allowClear />)
                ) : (
                  <span className="ant-form-text">
                    {puzzleDetail.issuanceTime ? moment(puzzleDetail.issuanceTime).format('YYYY-MM-DD HH:mm:ss') : ''}
                  </span>
                )}
              </Form.Item>
            </Col>
          </Row>
        ) : null}
      </Card>
    );
  }
}

export default RulesForm;
