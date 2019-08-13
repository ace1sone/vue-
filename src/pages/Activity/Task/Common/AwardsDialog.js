import React from 'react';
import { Table, Modal, Spin } from 'antd';
import { connect } from 'dva';

import { awardsColumns } from './Dialog.config';

class AwardsDialog extends React.Component {
  awardsTable = {
    records: [],
  };

  componentDidUpdate(preProps) {
    const { visible } = this.props;
    if (visible && !preProps.visible) {
      this.loadAwards();
    }
  }

  loadAwards = async (current = 1, size = 10) => {
    const { dispatch, id } = this.props;
    const res = await dispatch({
      type: 'task/getAwards',
      payload: { id, current, size },
    });
    if (res.data) {
      this.awardsTable = res.data;
    }
    this.forceUpdate();
  };

  handleGiveOut = async () => {
    const { onClose, dispatch, id, onRefrech } = this.props;
    await dispatch({ type: 'task/giveOut', payload: { id, type: 'DRAW' } });
    onClose();
    onRefrech();
  };

  render() {
    const { loading, visible, onClose } = this.props;
    const { records, total, current } = this.awardsTable || [];
    const pagination = {
      onChange: this.loadAwards,
      total,
      current,
    };

    return (
      <Modal
        title="中奖名单"
        visible={visible}
        onOk={this.handleGiveOut}
        okText="发放线下抽签资格"
        centered
        width={1128}
        maskClosable={false}
        onCancel={onClose}
      >
        <Spin spinning={loading === undefined ? false : !!loading}>
          <div style={{ height: 638 }}>
            <div>共 {records ? records.length : 0}位获奖者</div>
            <div style={{ marginTop: 20 }}>
              <Table
                bordered
                rowKey="userId"
                pagination={pagination}
                columns={awardsColumns('UID', '姓名', '手机号', '证件类型', '证件号码', '抽签地点', '抽签码')}
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
  loading: loading.effects['task/getSkus'],
}))(AwardsDialog);
