import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal } from 'antd';
import router from 'umi/router';

@Form.create()
class InvalidDialog extends React.Component {
  static defaultProps = {
    visible: false,
  };

  handleSubmit = () => {
    const {
      form: { validateFields },
      dispatch,
      invalidData,
      onClose,
    } = this.props;
    const { id } = invalidData;
    validateFields((err, values) => {
      if (!err) {
        dispatch({ type: 'stockout/approvalOrReject', payload: { ...values, id, outboundStatus: 4 } });
        onClose();
        router.goBack();
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      onClose,
    } = this.props;
    return (
      <Modal title="请填写作废的原因" visible={visible} onOk={this.handleSubmit} onCancel={onClose}>
        <Form.Item>
          {getFieldDecorator('invalidReason', {
            rules: [{ required: true, message: '作废原因不能为空!' }],
          })(<Input.TextArea placeholder="请输入作废原因" style={{ width: 474, height: 164 }} />)}
        </Form.Item>
      </Modal>
    );
  }
}

export default connect(({ stockout, loading }) => ({
  stockout,
  submitting: loading.effects['stockout/addOrEditStockinOrder'],
}))(InvalidDialog);
