import React from 'react';
import { Table, Modal, Spin, Input } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';

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
      type: 'material/getActs',
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

  addSellColumns = (sellId, sellTitle, actStartTime, actEndTime, actInfo, mode, addHandle) => [
    {
      title: sellId,
      dataIndex: 'id',
      width: '20%',
    },
    {
      title: sellTitle,
      dataIndex: 'title',
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
      render: text => {
        if (mode === 'list') {
          return (
            <a
              onClick={() => {
                addHandle(text);
              }}
              style={{ opacity: '1' }}
              name="delete"
              disabled={_.find(actInfo, x => text.id === x.activityId)}
            >
              {_.find(actInfo, x => text.id === x.activityId) ? '已选择' : '选择'}
            </a>
          );
        }

        return (
          <a
            onClick={() => {
              addHandle(text);
            }}
            style={{ opacity: '1' }}
            name="delete"
            disabled={_.find(actInfo, x => text.id === x)}
          >
            {_.find(actInfo, x => text.id === x) ? '已选择' : '选择'}
          </a>
        );
      },
    },
  ];

  render() {
    const { loading, visible, actInfo, onAdd, mode } = this.props;
    if (!this.allSpuTableDatas) return null;
    const { total, current, records } = this.allSpuTableDatas;
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
                columns={this.addSellColumns('发售 ID', '发售名称', '发售开始时间', '发售结束时间', actInfo, mode, data => {
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

export default connect(({ material, loading }) => ({
  material,
  loading: loading.effects['material/getActs'],
}))(ActivityDialog);
