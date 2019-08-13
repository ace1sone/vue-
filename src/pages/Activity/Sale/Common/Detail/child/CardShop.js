import React, { Component, Fragment } from 'react';
import { Button, Table, message } from 'antd';

import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import CardDialog from '@/pages/Activity/Sale/Common/CardDialog';

const getColumns = (lists, onDelete, showbtn) => {
  const columns = [
    {
      title: '卡片ID',
      key: 1,
      dataIndex: 'id',
    },
    {
      title: '卡片标题',
      key: 2,
      dataIndex: 'title',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 3,
    },
    {
      title: '操作',
      key: '4',
      render: (text, record, index) =>
        showbtn && (
          <a
            style={{ color: '#F5222D' }}
            onClick={() => {
              onDelete(index);
            }}
          >
            删除
          </a>
        ),
    },
  ];

  return columns;
};

class CardShop extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    isView: PropTypes.bool,
  };

  static defaultProps = {
    onChange: () => {},
    isView: false,
  };

  constructor(props) {
    super(props);
    const { value } = props;

    this.state = {
      cardModal: false,
      lists: value && value.length > 0 ? value : [],
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }

    return {
      lists: nextProps.value,
    };
  }

  addTable = item => {
    const { lists } = this.state;
    if (lists.length >= 2) {
      message.info('只能添加两个卡片');
      return;
    }
    this.setSpuTable([...lists, item]);
  };

  delCard = index => {
    const { lists: oldLists } = this.state;
    const lists = [...oldLists];
    lists.splice(index, 1);
    this.setSpuTable(lists);
  };

  setSpuTable = lists => {
    const { onChange } = this.props;
    this.setState({ lists });
    onChange(lists);
  };

  render() {
    const { loading, isView } = this.props;
    const { cardModal, lists } = this.state;

    return (
      <Fragment>
        <Table
          columns={getColumns(lists, this.delCard, !isView)}
          dataSource={lists}
          align="center"
          loading={loading}
          pagination={false}
          rowKey="id"
        />
        {lists.length < 2 && !isView && (
          <Button
            icon="plus"
            onClick={() => this.setState({ cardModal: true })}
            style={{ width: '100%', background: '#FFFBE6', color: '#FAAD14', marginTop: 10 }}
          >
            添加卡片
          </Button>
        )}

        <CardDialog visible={cardModal} onCancel={() => this.setState({ cardModal: false })} onAdd={this.addTable} lists={lists || []} />
      </Fragment>
    );
  }
}

export default CardShop;
