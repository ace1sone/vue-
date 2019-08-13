import React, { Component, Fragment } from 'react';
import { Button, Table } from 'antd';

import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import SpuDialog from '@/pages/Activity/Sale/Common/SpuDialog';
import styles from '@/pages/Activity/Sale/Common/Detail/ActivityForm.less';
// import { mapDataToCols, getColumns, } from '@/pages/Activity/Task/Common/List/listTable.config';

const getColumns = (lists, onDelete, hasDelete) => {
  const columns = [
    {
      title: '商品图片',
      width: 100,
      key: 1,
      render: text => {
        if (!text) return <div />;
        const url = text.skuImg || text.blackUrl;
        return <img src={url} alt="商品图片" style={{ width: 40, height: 40 }} />;
      },
    },
    {
      title: '商品名称',
      key: 2,
      width: 752,
      render: text => <div>{text ? text.spuName || text.englishName : null}</div>,
    },
    {
      title: 'SPU ID',
      dataIndex: 'spuId',
      key: 3,
      width: 152,
    },
    {
      title: '操作',
      key: '4',
      width: 80,
      render: (text, record, index) =>
        text.canDel && hasDelete ? (
          <a
            className={styles.red}
            onClick={() => {
              onDelete(index);
            }}
          >
            删除
          </a>
        ) : null,
    },
  ];

  return columns;
};

class ActivityData extends Component {
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
      spuModal: false,
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

  componentDidMount() {
  }

  addSpuTable = item => {
    const { lists } = this.state;
    this.setSpuTable([...lists, item]);
  };

  delSpuTable = index => {
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
    const { spuModal, lists } = this.state;
    
    // console.log('state:', this.state)
    return (
      <Fragment>
        <Table
          columns={getColumns(lists, this.delSpuTable, !isView)}
          dataSource={lists}
          align="center"
          loading={loading}
          pagination={false}
          rowKey="spuId"
        />
        {!isView && (
          <Button className={styles['add-spu-btn']} icon="plus" onClick={() => this.setState({ spuModal: true })}>
            添加商品
          </Button>
        )}

        <SpuDialog visible={spuModal} onCancel={() => this.setState({ spuModal: false })} onAdd={this.addSpuTable} spuDatas={lists || []} />
      </Fragment>
    );
  }
}

export default ActivityData;
