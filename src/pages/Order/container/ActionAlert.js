import React, { PureComponent } from 'react'
import {Modal, Input, Form, Select} from 'antd'
import {connect} from "dva/index"

const {Option} = Select

@Form.create()
class ActionAlert extends PureComponent {
  constructor(props) {
    super(props)
    this.optionList = [
      {
        name: '仅退款',
        value: 'ONLY_REFUND'
      },
      {
        name: '退货不退款',
        value: 'RETURN_NOT_REFUND'
      },
      {
        name: '退款退货',
        value: 'RETURN_REFUND'
      }
    ]
    this.state = {
    }
  }

  setTitle = () => {
    const {type} = this.props
    let title = ''
    switch (type) {
      case 'cancel' :
        title = '取消订单'
      break
      case 'apply' :
        title = '申请售后'
      break
      case 'complete' :
        title = '申请售后'
      break
      default:
        title = ''

    }

    return title
  }

  check = () => {
    const {form, success, orderId, type, dispatch} = this.props

    form.validateFields((err, value) => {
      if (!err) {
        if (type === 'cancel') {
          const params = {
            orderNo: orderId,
            cancelRemark: value.cancelReason
          }
          dispatch({
            type: 'operating/cancel',
            payload: params
          }).then(() => {
            success('订单取消成功')
          })
        } else if (type === 'apply') {
          const params = {
            orderNo: orderId,
            reason: value.cancelReason,
            reverseType: value.afterSaleType
          }
          dispatch({
            type: 'operating/apply',
            payload: params
          }).then(() => {
            success('售后申请成功')
          })
        } else if (type === 'complete') {
          const params = {
            orderNo: orderId,
            reason: value.cancelReason,
            reverseType: value.afterSaleType
          }
          dispatch({
            type: 'operating/complete',
            payload: params
          }).then(() => {
            success('完成售后成功')
          })
        }
      }
    });
  };

  render(){
    const {show, hide, form, type, orderStatus} = this.props
    const {getFieldDecorator} = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    }
    let renderForm = ''

    if (type === 'cancel') {
      renderForm =
        <Form.Item label="取消原因" {...formItemLayout}>
          {getFieldDecorator('cancelReason', {
            rules: [
              {
                required: true,
                message: '请填写取消原因！',
              },
            ],
          })(<Input.TextArea maxLength={500} placeholder="请输入取消原因" />)}
        </Form.Item>
    } else if (type === 'apply' || type === 'complete') {
      renderForm =
        <span>
          <Form.Item label="售后方式" {...formItemLayout}>
            {getFieldDecorator('afterSaleType', {
              initialValue: 'ONLY_REFUND',
              rules: [
                {
                  required: true,
                  message: '请选择售后方式！',
                },
              ],
            })(
              <Select
                style={{ width: '216px' }}
                placeholder="请选择"
                disabled={orderStatus === 3}
              >
                {
                  this.optionList.map(item => (
                    <Option value={item.value} key={item.value}>{item.name}</Option>
                  ))
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item label="取消原因" {...formItemLayout}>
            {getFieldDecorator('cancelReason', {
              rules: [
                {
                  required: true,
                  message: '请填写取消原因！',
                },
              ],
            })(<Input.TextArea maxLength={500} placeholder="请输入取消原因" />)}
          </Form.Item>
        </span>
    }
    return(
      <Modal
        title={this.setTitle()}
        visible={show}
        onOk={this.check}
        onCancel={hide}
        maskClosable={false}
        keyboard={false}
      >
        {renderForm}
      </Modal>
    )
  }
}

export default connect(({operating}) => ({
  operating
}))(ActionAlert)
