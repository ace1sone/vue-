import React from 'react';
import { Table, Modal, Spin, Input, Form, Select } from 'antd';
import { connect } from 'dva';

import { addTaskColumns } from './Dialog.config';

const { Search } = Input;
@Form.create()
class TaskDialog extends React.Component {
  state = {
    type: '',
  };

  tasksTable = {
    records: [],
  };

  componentDidUpdate(preProps) {
    const { visible } = this.props;
    if (visible && !preProps.visible) {
      this.loadValidTasks();
    }
  }

  handleExchangeType = () => {
    const { type } = this.state;
    let currentType = '';
    switch (type) {
      case 'invited':
        currentType = 'INVITATION';
        break;
      case 'puzzle':
        currentType = 'PUZZLE';
        break;
      case 'randomdraw':
        currentType = 'DRAW';
        break;
      default:
        currentType = 'INVITATION';
    }
    return currentType;
  };

  loadValidTasks = async (current = 1, value) => {
    const { dispatch, actInfo } = this.props;
    const currentType = this.handleExchangeType();
    const params = {
      current,
      size: 10,
      name: value,
      type: currentType,
      activityId: actInfo.id,
    };
    const res = await dispatch({
      type: 'task/fetchList',
      payload: params,
    });
    if (res.data) {
      this.tasksTable = {
        records: res.data.records,
      };
    }
    this.forceUpdate();
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  handleChangeType = v => {
    if (v) {
      this.setState({ type: v });
    }
  };

  render() {
    const { loading, taskData, onAdd, visible } = this.props;
    const { total, current, records } = this.tasksTable || [];
    const pagination = {
      onChange: this.loadValidTasks,
      total,
      current,
    };
    return (
      <Modal
        title="添加任务"
        visible={visible}
        onOk={this.handleCancel}
        centered
        width={1128}
        maskClosable={false}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Spin spinning={loading === undefined ? false : !!loading}>
          <div style={{ height: 638 }}>
            <Form layout="inline">
              <Form.Item>
                <Search
                  placeholder="请输入 任务Id/任务名称"
                  onSearch={value => {
                    this.loadValidTasks(1, value);
                    this.forceUpdate();
                  }}
                  enterButton="搜索"
                  style={{ width: 300 }}
                  allowClear
                />
                <Form.Item>
                  <Select style={{ width: 168, marginLeft: 44 }} defaultValue="invited" onChange={v => this.handleChangeType(v)}>
                    <Select.Option value="invited">拉新任务</Select.Option>
                    <Select.Option value="puzzle">寻找真相</Select.Option>
                    <Select.Option value="randomdraw">抽签任务</Select.Option>
                  </Select>
                </Form.Item>
              </Form.Item>
            </Form>
            <div style={{ marginTop: 20 }}>
              <Table
                size="middle"
                bordered
                rowKey="id"
                pagination={pagination}
                columns={addTaskColumns('任务ID', '任务名称', '邀请类型', '开始时间', '结束时间', taskData, data => {
                  onAdd(data);
                })}
                dataSource={records}
              />
            </div>
          </div>
        </Spin>
      </Modal>
    );
  }
}

export default connect(({ task, loading }) => ({
  task,
  loading: loading.effects['task/fetchList'],
}))(TaskDialog);
