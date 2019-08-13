import React from 'react';
import { Table, Modal, Spin, Input } from 'antd';
import { connect } from 'dva';
import { addSpusColumns } from '../../../Task/Common/Dialog.config';

const { Search } = Input;
class SpuDialog extends React.Component {
  allSpuTableDatas = {
    records: [],
  };

  componentDidUpdate(preProps) {
    const { visible } = this.props;
    if (visible && !preProps.visible) {
      this.loadValidSpus();
    }
  }

  loadValidSpus = async (current = 1, size = 10, spuData) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'npc/getSpus',
      payload: {
        current,
        size,
        spu: spuData,
        sellingStatus: 1,
      },
    });
    if (res.data) {
      this.allSpuTableDatas = res.data;
    }
    this.forceUpdate();
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  render() {
    const { loading, spuDatas, onAdd, visible } = this.props;
    const { records, total, current } = this.allSpuTableDatas || [];
    const pagination = {
      onChange: this.loadValidSpus,
      total,
      current,
    };
    return (
      <Modal
        title="添加商品"
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
            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 20 }}>
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
              <Table
                bordered
                rowKey="spuId"
                pagination={pagination}
                columns={addSpusColumns('商品图片', '商品名称', 'SPU ID', spuDatas, data => {
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
  loading: loading.effects['npc/getSpus'],
}))(SpuDialog);
