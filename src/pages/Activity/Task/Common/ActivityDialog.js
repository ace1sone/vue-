import React from 'react';
import { Table, Modal, Spin, Input } from 'antd';
import { connect } from 'dva';
import { addSellColumns } from './Dialog.config';

const { Search } = Input;

class ActivityDialog extends React.Component {
  allSpuTableDatas = {
    total: 0,
    current: 1,
    records: [],
  };

  componentDidUpdate(preProps) {
    const { visible } = this.props;
    if (visible && !preProps.visible) {
      this.loadValidActs();
    }
  }

  loadValidActs = async (current = 1, size = 10, keyword) => {
    const { dispatch } = this.props;

    const res = await dispatch({
      type: 'task/getActs',
      payload: {
        current,
        size,
        keyword,
        status: 'NOT_STARTED',
      },
    });
    this.allSpuTableDatas = res.data;
    this.forceUpdate();
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  render() {
    const { loading, visible, actInfo, onAdd } = this.props;
    const { total, current, records } = this.allSpuTableDatas || [];
    const pagination = {
      onChange: this.loadValidActs,
      total,
      current,
    };
    return (
      <Modal
        title="关联发售"
        visible={visible}
        onOk={this.handleCancel}
        centered
        width={1128}
        maskClosable={false}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Spin spinning={loading === undefined ? false : !!loading}>
          <div style={{ height: 638, overflowY: 'scroll' }}>
            <div>
              <Search
                placeholder="请输入发售标题或发售 ID"
                onSearch={value => {
                  this.loadValidActs(1, 10, value);
                  this.forceUpdate();
                }}
                enterButton="搜索"
                style={{ width: 300 }}
                allowClear
              />
            </div>
            <div style={{ marginTop: 20 }}>
              <Table
                bordered
                rowKey={item => item.id}
                pagination={pagination}
                columns={addSellColumns('发售 ID', '发售标题', '活动开始时间', '活动结束时间', actInfo, data => {
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
  loading: loading.effects['task/getValidSpus'],
}))(ActivityDialog);
