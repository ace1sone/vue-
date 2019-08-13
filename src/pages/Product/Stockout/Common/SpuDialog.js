import React from 'react';
import { Table, Modal, Spin, Input } from 'antd';
import { connect } from 'dva';
import { addSpusColumns } from './Detail/OrderForm.config';


const { Search } = Input;

class SpuDialog extends React.Component {

  allSpuTableDatas = [];

  componentDidUpdate(preProps) {
    const { visible } = this.props;
    if (visible && !preProps.visible) {
      this.loadValidSpus();
    }
  }

  loadValidSpus = async (current = 1, size = 10, spuSearchWord) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'stockout/getValidSpus',
      payload: {
        current,
        size,
        spuSearchWord
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
    const { total, size, current, records } = this.allSpuTableDatas;
    const pagination = {
      onChange: this.loadValidSpus,
      total,
      current
    };
    const spuListLoading = loading.effects['stockout/getValidSpus'];
    const baseIndex = (current - 1) * size;

    return (
      <Modal title="添加进货SPU" visible={visible} onOk={this.handleCancel} centered width={1128} maskClosable={false} onCancel={this.handleCancel} style={{ height: '686px', overflow: 'hidden', boxSizing: 'border-box' }}>
        <Spin spinning={spuListLoading}>
          <div style={{ height: 500, overflowY: 'scroll' }}>
            <div>
              <Search
                placeholder="请输入SPU英文或SPU ID"
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
                bordered
                rowKey="id"
                pagination={pagination}
                columns={addSpusColumns('序号', '商品图片', 'SPU英文名(官方)', 'SPU ID', spuDatas, data => {
                  onAdd(data);
                }, baseIndex)}
                dataSource={records}
              />
            </div>
          </div>
        </Spin>
      </Modal>
    );
  }
}

export default connect(({ stockout, loading }) => ({
  stockout,
  loading,
  submitting: loading.effects['stockout/addOrEditStockinOrder'],
}))(SpuDialog);