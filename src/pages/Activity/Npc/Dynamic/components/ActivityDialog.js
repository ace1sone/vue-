import React from 'react';
import _ from 'lodash';
import { Table, Modal, Spin, Input } from 'antd';
import { connect } from 'dva';

const { Search } = Input;

const activityColumns = (sellId, sellTitle, actStartTime, actEndTime, actInfo, addHandle) => [
  {
    title: sellId,
    dataIndex: 'id',
    width: '20%',
  },
  {
    title: sellTitle,
    dataIndex: 'name',
    width: '31.5%',
  },
  {
    title: actStartTime,
    dataIndex: 'start',
    width: '20%',
  },
  {
    title: actEndTime,
    dataIndex: 'end',
    width: '20%',
  },
  {
    title: '操作',
    dataIndex: '',
    width: '20%',
    render: text => (
      <a
        onClick={() => {
          addHandle(text);
        }}
        style={{ opacity: '1' }}
        name="delete"
        disabled={_.find(actInfo, x => text.id === x.id)}
      >
        {_.find(actInfo, x => text.id === x.id) ? '已选择' : '选择'}
      </a>
    ),
  },
];

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
      type: 'npc/getActs',
      payload: {
        current,
        size,
        keyword,
        isOnline: true,
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
                placeholder="请输入发售名称或发售 ID"
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
                columns={activityColumns('发售 ID', '发售名称', '发售开始时间', '发售结束时间', actInfo, data => {
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

export default connect(({ npc, loading }) => ({
  npc,
  loading: loading.effects['npc/getActs'],
}))(ActivityDialog);
