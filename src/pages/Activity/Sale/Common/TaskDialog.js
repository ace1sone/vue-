import React from 'react';
import { Table, Modal, Spin, Input, Form, Select, } from 'antd';
import { connect } from 'dva';
import { addTasksColumns } from './Detail/ActivityForm.config';

const { Search } = Input;

class TaskDialog extends React.Component {
  state = {
    type: 'INVITATION',
  };

  allSpuTableDatas = {};

  componentDidUpdate(preProps) {
    const { visible } = this.props;
    if (visible && !preProps.visible) {
      this.loadTasks();
    }
  }

  loadTasks = async (current = 1, size = 10, name) => {
    const { dispatch, activityId } = this.props;
    const { type } = this.state;
    const res = await dispatch({
      type: 'activity/getTasks',
      payload: {
        current,
        size,
        name,
        status: 'WAITING',
        type,
        activityId,
      },
    });
    this.allSpuTableDatas = res.data || {};
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

  getFilterList = (list = []) => list;

  render() {
    const { loading, visible, taskDatas, onAdd } = this.props;
    const { total = 0, current, records } = this.allSpuTableDatas;
    const pagination = {
      onChange: this.loadTasks,
      total,
      current,
    };

    const spuListLoading = loading.effects['activity/getTasks'];
    return (
      <Modal
        footer={null}
        title="添加任务"
        visible={visible}
        onOk={this.handleCancel}
        centered
        width={1128}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Spin spinning={spuListLoading}>
          <div style={{ height: 638 }}>
            <Form layout="inline">
              <Form.Item>
                <Select style={{ width: 168 }} defaultValue="INVITATION" onChange={v => this.handleChangeType(v)}>
                  <Select.Option value="">请选择类型</Select.Option>
                  <Select.Option value="INVITATION">转发邀请任务</Select.Option>
                  <Select.Option value="PUZZLE">解谜任务</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Search
                  placeholder="请输入任务名称"
                  onSearch={value => {
                    this.loadTasks(1, 10, value);
                    this.forceUpdate();
                  }}
                  enterButton="搜索"
                  style={{ width: 300 }}
                  allowClear
                />
              </Form.Item>
            </Form>

            <div style={{ marginTop: 20 }}>
              <Table
                size="middle"
                bordered
                rowKey="id"
                pagination={pagination}
                columns={addTasksColumns('任务 ID', '任务标题', '任务类型', '开始时间', '结束时间', taskDatas, data => {
                  onAdd(data);
                })}
                dataSource={this.getFilterList(records)}
              />
            </div>
          </div>
        </Spin>
      </Modal>
    );
  }
}

export default connect(({ activity, loading }) => ({
  activity,
  loading,
}))(TaskDialog);
