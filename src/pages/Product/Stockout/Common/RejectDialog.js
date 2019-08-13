import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal } from 'antd';
import router from 'umi/router';

@Form.create()
class RejectDialog extends React.Component {
  static defaultProps = {
    visible: false,
  };

  handleSubmit = () => {
    const {
      form: { validateFields },
      dispatch,
      rejectData,
      onClose,
    } = this.props;
    const { id } = rejectData;
    validateFields((err, values) => {
      if (!err) {
        dispatch({ type: 'stockout/approvalOrReject', payload: { ...values, id, outboundStatus: 2 } });
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
      <Modal title="请填写驳回的原因" visible={visible} onOk={this.handleSubmit} onCancel={onClose}>
        <Form.Item>
          {getFieldDecorator('dismissReason', {
            rules: [{ required: true, message: '驳回原因不能为空!' }, { min: 6, message: '驳回原因不少于6个字!' }],
          })(<Input.TextArea placeholder="请输入驳回原因" style={{ width: 474, height: 164 }} />)}
        </Form.Item>
      </Modal>
    );
  }
}

export default connect(({ stockout, loading }) => ({
  stockout,
  submitting: loading.effects['stockout/addOrEditStockinOrder'],
}))(RejectDialog);
