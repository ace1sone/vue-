import React from 'react';
import { Table, Modal, Spin } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';

const addSpusColumns = (selectDatas = [], addHandle) => {
  const columns = [
    {
      title: 'NPC ID',
      dataIndex: 'npcId',
      width: 100,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 100,
      render(avatar) {
        return <img src={avatar} alt="头像" style={{ width: 40 }} />;
      },
    },
    {
      title: 'NPC名称',
      dataIndex: 'name',
      width: 752,
    },
    {
      title: '操作',
      dataIndex: '',
      width: 80,
      render: text => (
        <a
          onClick={() => {
            addHandle(text);
          }}
          name="delete"
          disabled={_.find(selectDatas, x => text.npcId === x.npcId)}
        >
          {_.find(selectDatas, x => text.npcId === x.npcId) ? '已添加' : '添加'}
        </a>
      ),
    },
  ];
  return columns;
};

class NpcModal extends React.Component {
  allNpcs = [];

  componentDidUpdate(preProps) {
    const { visible } = this.props;
    if (visible && !preProps.visible) {
      this.loadList();
    }
  }

  loadList = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'activity/getNpclist',
      payload: {},
    });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  render() {
    const {
      loading,
      visible,
      lists,
      onAdd,
      activity: { npcDatas },
    } = this.props;
    const spuListLoading = loading.effects['activity/getNpclist'];
    return (
      <Modal
        footer={null}
        title="添加NPC"
        visible={visible}
        onOk={this.handleCancel}
        centered
        width={1128}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Spin spinning={spuListLoading}>
          <div style={{ height: 583, overflowY: 'scroll' }}>
            <div style={{ marginBottom: 40 }}>
              <Table
                size="middle"
                rowKey="npcId"
                pagination={false}
                columns={addSpusColumns(lists, data => {
                  onAdd(data);
                })}
                dataSource={npcDatas}
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
}))(NpcModal);
