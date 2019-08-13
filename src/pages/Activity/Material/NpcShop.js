import React, { Component, Fragment } from 'react';
import { Button, Table, message } from 'antd';

import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import NpcDialog from './NpcDialog';

const getColumns = (lists, onDelete, isView) => {
  const columns = [
    {
      title: 'NPC ID',
      key: 1,
      dataIndex: 'npcId',
    },
    {
      title: 'NPC名称',
      dataIndex: 'name',
      key: 2,
    },
    {
      title: '操作',
      key: 3,
      render: (text, record, index) => {
        if (!isView) {
          return (
            <a
              onClick={() => {
                onDelete(index);
              }}
            >
              删除
            </a>
          );
        }
      },
    },
  ];

  return columns;
};

class NpcShop extends Component {
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
      npcModal: false,
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
    if(lists.length>0){
        message.error('只能添加一个Npc')
        return;
    }
    this.setSpuTable([...lists, item]);
  };

  delNpc = index => {
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
    const { npcModal, lists } = this.state;
    return (
      <Fragment>
        <Table
          columns={getColumns(lists, this.delNpc, isView)}
          dataSource={lists}
          align="center"
          loading={loading}
          pagination={false}
          rowKey="npcId"
        />
        {!isView && (
          <Button
            icon="plus"
            onClick={() => this.setState({ npcModal: true })}
            style={{ width: '100%', background: '#FFFBE6', color: '#FAAD14', marginTop: 10 }}
          >
            添加NPC
          </Button>
        )}
        <NpcDialog visible={npcModal} onCancel={() => this.setState({ npcModal: false })} onAdd={this.addTable} lists={lists || []} />
      </Fragment>
    );
  }
}

export default NpcShop;
