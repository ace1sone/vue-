import React from 'react';
import { Table, Modal, Spin, Input } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';

const { Search } = Input;

const addSpusColumns = (spuName, spuId, selectDatas = [], addHandle) => [
  {
    title: spuName,
    dataIndex: 'spuName',
  },
  {
    title: spuId,
    dataIndex: 'spuId',
  },
  {
    title: '操作',
    dataIndex: '',
    render: text => (
      <a
        onClick={() => {
          addHandle(text);
        }}
        style={{ opacity: '1' }}
        name="delete"
        disabled={_.find(selectDatas, x => text.spuId === x.spuId)}
      >
        {_.find(selectDatas, x => text.spuId === x.spuId) ? '已添加' : '添加'}
      </a>
    ),
  },
];
class SpuDialog extends React.Component {
  allSpuTableDatas = [];

  componentDidUpdate(preProps) {
    const { visible } = this.props;
    if (visible && !preProps.visible) {
      this.loadValidSpus();
    }
  }

  loadValidSpus = async (current = 1, size = 10) => {
    const { dispatch, activityId } = this.props;
    const res = await dispatch({
      type: 'material/getActivitySpus',
      payload: {
        current,
        size,
        id: activityId,
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
    const { loading, visible, spuDatas, onAdd } = this.props;
    const { total, current } = this.allSpuTableDatas || {};
    let records = this.allSpuTableDatas || [];
    const pagination = {
      onChange: this.loadValidSpus,
      total: +total,
      current,
    };

    records = _.map(records, v => ({ canDel: true, ...v }));

    const spuListLoading = loading.effects['material/getActivitySpus'];
    return (
      <Modal
        footer={null}
        title="添加商品"
        visible={visible}
        onOk={this.handleCancel}
        centered
        width={1128}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Spin spinning={spuListLoading}>
          <div style={{ height: 583, overflowY: 'scroll' }}>
            <div>
              <Search
                placeholder="请输⼊入 SPU ID或商品名称"
                onSearch={value => {
                  this.loadValidSpus(1, 10, value);
                  this.forceUpdate();
                }}
                enterButton="搜索"
                style={{ width: 300 }}
                allowClear
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <Table
                size="middle"
                rowKey="spuId"
                pagination={pagination}
                columns={addSpusColumns('商品名称', 'SPU ID', spuDatas, data => {
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
  loading,
}))(SpuDialog);
