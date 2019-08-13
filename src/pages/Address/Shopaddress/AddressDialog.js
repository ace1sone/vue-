import React from 'react';
import { Form, Modal, Spin, Input } from 'antd';
import { connect } from 'dva';
import styles from './Address.less';

const { Item } = Form;
const { TextArea } = Input;
const InputGroup = Input.Group;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

@Form.create()
class Address extends React.Component {
  componentDidUpdate(preProps) {
    const { visible, id, dispatch } = this.props;
    if (visible && !preProps.visible) {
      dispatch({ type: 'address/clearDetail', payload: {} });
      if (id) {
        this.loadDetail(id);
      }
    }
  }

  handSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      onCancel,
      id,
    } = this.props;
    validateFields(async (err, values) => {
      if (!err) {
        if (id) {
          await dispatch({ type: 'address/update', payload: { ...values, id } });
        } else {
          await dispatch({ type: 'address/addAddress', payload: values });
        }
        onCancel();
      }
    });
  };

  loadDetail = async id => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'address/detail',
      payload: { id },
    });
  };

  render() {
    const {
      loading,
      visible,
      form: { getFieldDecorator },
      onCancel,
      address: { detail },
    } = this.props;

    return (
      <Modal
        title="新增地址"
        visible={visible}
        style={{ width: 576 }}
        onOk={this.handSubmit}
        onOkText="保存"
        centered
        maskClosable={false}
        onCancel={onCancel}
        destroyOnClose
      >
        <Spin spinning={loading === undefined ? false : !!loading}>
          <div style={{ height: 218 }}>
            <Form layout="vertical">
              <Item {...formItemLayout} label="店铺名称">
                {getFieldDecorator('name', {
                  initialValue: detail.name || '',
                  rules: [{ required: true, message: '店铺名称必填的哦！' }],
                })(<Input placeholder="请输入店铺名称" />)}
              </Item>
              <Item {...formItemLayout} label="详细地址">
                {getFieldDecorator('address', {
                  initialValue: detail.address || '',
                  rules: [{ required: true, message: '详细地址必填！' }],
                })(<TextArea placeholder="请输入详细地址，如街道名称、门牌号等信息" />)}
              </Item>
              <InputGroup compact>
                <Item
                  {...{
                    labelCol: { span: 10 },
                    wrapperCol: { span: 14 },
                  }}
                  label="联系方式"
                  className={styles.area}
                >
                  {getFieldDecorator('phoneArea', {
                    initialValue: detail.phoneArea || '',
                  })(<Input placeholder="请输区号" type="number" />)}
                </Item>
                <Item className={styles.number}>
                  {getFieldDecorator('phoneNumber', {
                    initialValue: detail.phoneNumber || '',
                  })(<Input placeholder="请输入座机" type="number" />)}
                </Item>
              </InputGroup>
            </Form>
          </div>
        </Spin>
      </Modal>
    );
  }
}

export default connect(({ address, loading }) => ({
  address,
  loading: loading.models.address,
}))(Address);
