import React, { Component, Fragment } from 'react';
import { Button, Table, Divider, Icon } from 'antd';

import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
// import router from 'umi/router';
import RecomSpuDialog from '@/pages/Activity/Sale/Common/RecomSpuDialog';
// import { addSpusColumns } from '@/pages/Activity/Sale/Common/Detail/ActivityForm.config';
import styles from '@/pages/Activity/Sale/Common/Detail/ActivityForm.less';

// const { origin, pathname } = window.location;
// const prefix = `${origin}${pathname}#`;

const getColumns = (lists, onDelete = () => {}, onUp = () => {}, onDown = () => {}, hasDelete = true) => {
  const columns = [
    {
      title: `前端展示顺序`,
      key: `__index`,
      width: 160,
      render: (text, record, index) => index + 1,
    },
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
      width: 160,
      render: (text, record, index) => (
        <Fragment>
          {hasDelete && (
            <Fragment>
              <a disabled={index === 0} onClick={() => onUp(index)}>
                <Icon className={styles.iconfont} type="arrow-up" />
              </a>
              <Divider className={styles.Divider} type="vertical" />
              <a disabled={index === lists.length - 1} onClick={() => onDown(index)}>
                <Icon className={styles.iconfont} type="arrow-down" />
              </a>
              <Divider className={styles.Divider} type="vertical" />
            </Fragment>
          )}

          {/* <a onClick={() => router.push(`/product/spu/new?id=${record.spuId}&action=2`)}>
            查看
          </a> */}
          {hasDelete && (
            <Fragment>
              {/* <Divider type="vertical" /> */}
              <a
                className={styles.red}
                onClick={() => {
                  onDelete(index);
                }}
              >
                删除
              </a>
            </Fragment>
          )}
        </Fragment>
      ),
      // return text.canDel && hasDelete ? (
      //   <a
      //     className={styles.red}
      //     onClick={() => {
      //       onDelete(index);
      //     }}
      //   >
      //     删除
      //   </a>
      // ) : null,
    },
  ];

  return columns;
};

class ActivityData extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    isView: PropTypes.bool,
    activityId: PropTypes.string,
  };

  static defaultProps = {
    onChange: () => {},
    isView: false,
    activityId: '',
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

  componentDidMount() {}

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

  onUp = index => {
    const { lists } = this.state;
    const lists1 = lists.slice();
    [lists1[index - 1], lists1[index]] = [lists1[index], lists1[index - 1]];

    this.setSpuTable(lists1);
  };

  onDown = index => {
    const { lists } = this.state;
    const lists1 = lists.slice();
    [lists1[index + 1], lists1[index]] = [lists1[index], lists1[index + 1]];

    this.setSpuTable(lists1);
  };

  render() {
    const { loading, isView, activityId } = this.props;
    const { spuModal, lists } = this.state;
    return (
      <Fragment>
        <Table
          columns={getColumns(lists, this.delSpuTable, this.onUp, this.onDown, !isView)}
          dataSource={lists}
          align="center"
          loading={loading}
          pagination={false}
          rowKey="spuId"
        />
        {!isView && activityId && (
          <Button className={styles['add-spu-btn']} icon="plus" onClick={() => this.setState({ spuModal: true })}>
            添加商品
          </Button>
        )}

        <RecomSpuDialog
          visible={spuModal}
          activityId={activityId}
          onCancel={() => this.setState({ spuModal: false })}
          onAdd={this.addSpuTable}
          spuDatas={lists || []}
        />
      </Fragment>
    );
  }
}

export default ActivityData;
