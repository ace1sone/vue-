import React from 'react';
import { DatePicker, Modal, Form } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

@Form.create()
class TimeDialog extends React.Component {
  static defaultProps = {};

  state = {
    visible: false,
  };

  showModal = state => {
    this.setState({ visible: state });
  };

  handleCancel = () => {
    this.showModal(false);
  };

  onEdit = async () => {
    const {
      dispatch,
      id,
      activityId,
      form: { validateFields },
    } = this.props;
    validateFields(async (err, values) => {
      if (!err) {
        const { startAt, endAt } = values;
        const params = {
          activityId,
          id,
          startAt: moment(startAt).format('YYYY-MM-DD HH:mm:ss'),
          endAt: moment(endAt).format('YYYY-MM-DD HH:mm:ss'),
        };
        await dispatch({ type: 'homemgmt/saveSaleTab', payload: params });
        this.showModal(false);
      }
    });
  };

  render() {
    const {
      // loading,
      form: { getFieldDecorator },
    } = this.props;
    const { visible } = this.state;
    return (
      <>
        <a onClick={() => this.setState({ visible: true })}>设置时间</a>
        <Modal
          title="资源位占用时间"
          onOk={this.onEdit}
          visible={visible}
          style={{ height: 264 }}
          centered
          maskClosable={false}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          {/* <Spin spinning={loading}> */}
          <div>
            <Form layout="vertical">
              <Form.Item {...formItemLayout} label="占用开始时间">
                {getFieldDecorator('startAt', { rules: [{ required: true, message: '占用开始时间不能为空' }] })(
                  <DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="占用结束时间">
                {getFieldDecorator('endAt', { rules: [{ required: true, message: '占用结束时间不能为空' }] })(
                  <DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
                )}
              </Form.Item>
            </Form>
          </div>
          {/* </Spin> */}
        </Modal>
      </>
    );
  }
}

export default connect(({ homemgmt, loading }) => ({
  homemgmt,
  loading: loading.effects['homemgmt/addActTab'],
}))(TimeDialog);
