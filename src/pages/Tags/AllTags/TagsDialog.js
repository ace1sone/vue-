import React from 'react';
import { Form, Modal, Spin, Input } from 'antd';
import { connect } from 'dva';

const { Item } = Form;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

@Form.create()
class TagsDialog extends React.Component {
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
          await dispatch({ type: 'tags/editTags', payload: { ...values, id } });
        } else {
          await dispatch({ type: 'tags/createTags', payload: values });
        }
        onCancel();
      }
    });
  };

  render() {
    const {
      loading,
      visible,
      form: { getFieldDecorator },
      onCancel,
      name,
      title,
    } = this.props;

    return (
      <Modal
        title={title}
        visible={visible}
        style={{ width: 576, height: 320 }}
        onOk={this.handSubmit}
        onOkText="保存"
        centered
        maskClosable={false}
        onCancel={onCancel}
        destroyOnClose
      >
        <Spin spinning={!!loading}>
          <div>
            <Form layout="vertical">
              <Item {...formItemLayout} label="标签名称" style={{ paddingLeft: 30, paddingTop: 30 }}>
                {getFieldDecorator('name', {
                  rules: [
                    { required: true, message: '标签名称必填的哦！' },
                    { max: 20, message: '最大长度20' },
                    { whitespace: true, message: '空格不可以哦！' },
                  ],
                  initialValue: name || '',
                })(<Input placeholder="请输入标签名称" allowClear />)}
              </Item>
            </Form>
          </div>
        </Spin>
      </Modal>
    );
  }
}

export default connect(({ tags, loading }) => ({
  tags,
  loading: loading.models.tags,
}))(TagsDialog);
