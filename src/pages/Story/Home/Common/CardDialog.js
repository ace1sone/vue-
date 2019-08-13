import React from 'react';
import { Table, Modal, Spin, Input } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';

const { Search } = Input;

const addSpusColumns = (id, title, createdAt, selectDatas = [], addHandle) => {
  const columns = [
    {
      title: id,
      dataIndex: 'id',
      width: 100,
    },
    {
      title,
      dataIndex: 'title',
      width: 752,
    },
    {
      title: createdAt,
      dataIndex: 'createdAt',
      width: 152,
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
          disabled={_.find(selectDatas, x => text.id === x.id)}
        >
          {_.find(selectDatas, x => text.id === x.id) ? '已添加' : '添加'}
        </a>
      ),
    },
  ];
  return columns;
};

class CardDialog extends React.Component {
  allCards = [];

  componentDidUpdate(preProps) {
    const { visible } = this.props;
    if (visible && !preProps.visible) {
      this.loadList();
    }
  }

  loadList = async (current = 1, size = 10, searchWord) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'story/getCards',
      payload: {
        current,
        size,
        req: searchWord,
      },
    });
    this.allCards = res.data;
    this.forceUpdate();
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  render() {
    const { loading, visible, lists, onAdd } = this.props;
    const { total, current } = this.allCards || {};
    let { records } = this.allCards || {};
    const pagination = {
      onChange: this.loadList,
      total: +total,
      current,
    };

    records = _.map(records, v => {
      const {createdAt, ...others} = v;
      const createTime = moment(createdAt).format('YYYY-MM-DD HH:mm:ss');
      return {createdAt: createTime, ...others};
    });

    const spuListLoading = loading.effects['story/getCards'];
    return (
      <Modal
        footer={null}
        title="添加卡片"
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
                placeholder="请输⼊ ID或名称"
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
                columns={addSpusColumns('卡片ID', '卡片标题', '创建时间', lists, data => {
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
}))(CardDialog);
