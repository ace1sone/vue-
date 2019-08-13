import React from 'react';
import { Table, Modal, Spin, Input } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';

const { Search } = Input;

class MaterialDialog extends React.Component {
  tableDatas = [];

  componentDidUpdate(preProps) {
    const { visible } = this.props;
    if (visible && !preProps.visible) {
      this.loadList();
    }
  }

  loadList = async (current = 1, size = 10, keyword) => {
    const { dispatch, plotId } = this.props;
    const res = await dispatch({
      type: 'story/getMaters',
      payload: {
        current,
        size,
        keyword,
        plotId,
      },
    });
    this.tableDatas = res.data || [];
    this.forceUpdate();
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  addColumns = (id, name, createAt, selectDatas = [], addHandle) => [
    {
      title: id,
      dataIndex: 'id',
      width: '10%',
    },
    {
      title: name,
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: createAt,
      dataIndex: 'createAtString',
      width: '16%',
    },
    {
      title: '操作',
      dataIndex: '',
      width: '6%',
      render: text => (
        <a
          onClick={() => {
            addHandle(text);
          }}
          style={{ opacity: '1' }}
          name="delete"
          disabled={_.find(selectDatas, x => text.id === x.id)}
        >
          {_.find(selectDatas, x => text.id === x.id) ? '已添加' : '添加'}
        </a>
      ),
    },
  ];

  render() {
    const { loading, visible, materDatas, onAdd, currentId } = this.props;
    const { total, current } = this.tableDatas || {};
    let { records } = this.tableDatas || [];
    const pagination = {
      onChange: this.loadList,
      total: +total,
      current,
    };

    records = records ? records.filter(ele => ele.type !== 'ROOT' && ele.id !== currentId).map(ele => ({ canDel: true, ...ele })) : [];

    const listloading = loading.effects['story/getMaters'];
    return (
      <Modal
        footer={null}
        title="添加素材"
        visible={visible}
        onOk={this.handleCancel}
        centered
        width={1128}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Spin spinning={listloading}>
          <div style={{ height: 583, overflowY: 'scroll' }}>
            <div>
              <Search
                placeholder="请输⼊素材ID 或素材名称"
                onSearch={value => {
                  this.loadList(1, 10, value);
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
                rowKey="id"
                pagination={pagination}
                columns={this.addColumns('素材ID', '素材名称', '创建时间', materDatas, data => {
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

export default connect(({ story, loading }) => ({
  story,
  loading,
}))(MaterialDialog);
