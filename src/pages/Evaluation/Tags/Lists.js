import React from 'react';
import { Card, Button, Modal, Select, Form, Input, Table, Popconfirm, notification } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Lists.less';

const FormItem = Form.Item;

@Form.create()
class Lists extends React.Component {
  state = {
    showModal: false,
    disable: null,
  };

  componentDidMount() {
    this.handleLoadTags();
  }

  handleLoadTags = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'tags/searchTags',
      payload: {
      },
    });
  };

  handleDelete = async item => {
    const { dispatch } = this.props;
    if (!item) return;
    const { name, id } = item;
    await dispatch({ type: 'tags/saveTag', payload: { mark: { deleted: true, name, id } } });
    await dispatch({ type: 'tags/searchTags' });
  };

  handleFreeze = async item => {
    const { dispatch } = this.props;
    if (!item) return;
    const { status, name, id } = item;
    const statusCode = status.code === '1' ? 2 : 1
    await dispatch({ type: 'tags/saveTag', payload: { mark: { status: statusCode, name, id } } });
    await dispatch({ type: 'tags/searchTags' });
  };

  handleChangeStatus = val => {
    const { dispatch } = this.props;
    this.setState({ disable: val });
    dispatch({
      type: 'tags/searchTags',
      payload: {
        disable: val,
      },
    });
  };

  showTagModal = () => {
    this.setState({ showModal: true });
  };

  handleOk = e => {
    const {
      form: { validateFieldsAndScroll ,resetFields},
      dispatch,
    } = this.props;


    validateFieldsAndScroll(async (error, values) => {
      if (error) return;

      await dispatch({
        type: 'tags/saveTag',
        payload: {
          mark: {
            ...values,
            status: 1
          }
        },
        success: res => {
          notification.info({ message: res.header.msg });
          this.setState({ showTag: false });
        }
      });
      this.handleLoadTags();
      this.setState({
        showModal: false,
      });

      // 清空输入
      resetFields()
    });
  };

  handleCancel = e => {
    this.setState({
      showModal: false,
    });
  };

  renderSimpleForm() {
    return (
      <div>
        <Form layout="inline">
          <Form.Item>
            <Select
              placeholder="选择状态"
              style={{ width: '100px' }}
              value={this.state.disable}
              onChange={this.handleChangeStatus}
            >
              <Select.Option value={null}>所有状态</Select.Option>
              <Select.Option value={false}>启用</Select.Option>
              <Select.Option value={true}>禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.showTagModal}>
              新增标签
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  render() {
    const {
      form: { getFieldDecorator },
      tags,
    } = this.props;
    const { data, loading } = tags;
    const { marks } = data;
    return (
      <PageHeaderWrapper title="标签管理">
        <Card>
          <div className={styles.header}>{this.renderSimpleForm()}</div>
          <Table
            dataSource={marks}
            loading={loading}
            rowKey="id"
            onChange={this.handleTableChange}
            pagination={false}
          >
            <Table.Column title="编号" dataIndex="id" key="id" />
            <Table.Column title="标签名称" dataIndex="name" key="name" />
            <Table.Column
              title="操作"
              key="hasUsed"
              render={(text, record) => (
                <span>
                  {record.status.code === '1' ? (
                    <Popconfirm title="确认要禁用吗？" onConfirm={() => this.handleFreeze(record)}>
                      <a href="javascript:;">禁用</a>
                    </Popconfirm>
                  ) : (
                      <div>
                        <Popconfirm
                          title="确认要启用吗？"
                          onConfirm={() => this.handleFreeze(record)}
                        >
                          <a href="javascript:;">启用</a>
                        </Popconfirm>{' '}
                        <Popconfirm
                          title="确认要删除吗？"
                          onConfirm={() => this.handleDelete(record)}
                        >
                          <a href="javascript:;">删除</a>
                        </Popconfirm>
                      </div>
                    )}
                </span>
              )}
            />
          </Table>
        </Card>
        <Modal
          title="新增标签"
          visible={this.state.showModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form hideRequiredMark>
            <FormItem label="标签名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '名称为必填' }],
              })(<Input placeholder="请输入标签名称" />)}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ tags }) => ({
  tags,
}))(Lists);
