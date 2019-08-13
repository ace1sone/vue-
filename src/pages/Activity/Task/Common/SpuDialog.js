import React from 'react';
import { Table, Modal, Spin } from 'antd';
import { connect } from 'dva';

import _ from 'lodash';
import { addSpusColumns } from './Dialog.config';

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

  loadValidSpus = async () => {
    const { dispatch, actInfo } = this.props;
    if (!_.isEmpty(actInfo)) {
      const { id } = actInfo;
      const res = await dispatch({
        type: 'task/getValidSpus',
        payload: {
          id,
        },
      });
      this.allSpuTableDatas = res;
      this.forceUpdate();
    }
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  render() {
    const { loading, actInfo, spuDatas, onAdd, visible } = this.props;
    const { data: list } = this.allSpuTableDatas || [];
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
            <div>关联活动名称:{actInfo.title}</div>
            <div style={{ marginTop: 20 }}>
              <Table
                bordered
                rowKey="spuId"
                pagination={false}
                columns={addSpusColumns('商品图片', '商品名称', 'SPU ID', spuDatas, data => {
                  onAdd(data);
                })}
                dataSource={list}
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
}))(SpuDialog);
