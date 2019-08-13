import React from 'react';
import { Table, Modal, Spin, Input } from 'antd';
import { connect } from 'dva';
import { recomSpusColumns } from './Detail/ActivityForm.config';

const { Search } = Input;

class SpuDialog extends React.Component {
  allSpuTableDatas = [];

  componentDidUpdate(preProps) {
    const { visible } = this.props;

    if (visible && !preProps.visible) {
      this.loadValidSpus();
    }
  }

  loadValidSpus = async spuSearchWord => {
    const { dispatch, activityId } = this.props;
    const res = await dispatch({
      type: 'activity/getRecomSpus',
      payload: {
        spu: spuSearchWord,
        id: activityId,
      },
    });
    if (spuSearchWord) {
      let filterData = [];
      filterData = res.data.filter(function(item) {
        return item.spuName == spuSearchWord || item.spuId == spuSearchWord;
      });
      this.allSpuTableDatas = filterData;
    } else {
      this.allSpuTableDatas = res.data;
    }
    this.forceUpdate();
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  render() {
    const { loading, visible, spuDatas, onAdd } = this.props;
    const pagination = {
      onChange: this.loadValidSpus,
    };

    const spuListLoading = loading.effects['activity/getRecomSpus'];
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
                  this.loadValidSpus(value);
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
                columns={recomSpusColumns('商品图片', '商品名称', 'SPU ID', spuDatas, data => {
                  onAdd(data);
                })}
                dataSource={this.allSpuTableDatas || []}
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
}))(SpuDialog);
