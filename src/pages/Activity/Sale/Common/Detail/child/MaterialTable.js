import React, { Fragment } from 'react';
import { Table, Divider, message } from 'antd';

import { connect } from 'dva';
import _ from 'lodash';
import isEqual from 'lodash/isEqual';
import router from 'umi/router';

const getColumns = (setStart, mode) => {
  const columns = [
    {
      title: '素材ID',
      dataIndex: 'id',
    },
    {
      title: '素材名称',
      dataIndex: 'name',
    },
    {
      title: '跳转数量',
      dataIndex: 'skipCount',
    },
    {
      title: '前置素材ID',
      dataIndex: 'beforeSceneIDs',
      width: 250,
    },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 260,
      render: ({ type, beforeSceneIDs, id }) => (
        <div>
          {type === 'ROOT' && '当前素材为起点 '}
          {mode !== 'view' && (
            <span>
              {_.isEmpty(beforeSceneIDs) && type !== 'ROOT' && <a onClick={() => setStart(id)}>设为起点</a>}
              {((_.isEmpty(beforeSceneIDs) && type !== 'ROOT') || type === 'ROOT') && <Divider type="vertical" />}
              <a onClick={() => router.push(`/activity/material/all/edit/${id}`)}>编辑</a>
              <Divider type="vertical" />
            </span>
          )}
          <a onClick={() => router.push(`/activity/material/all/detail/${id}`)}>查看</a>
        </div>
      ),
    },
  ];

  return columns;
};

const mapDataToCols = (records = []) =>
  records.map((item, i) => ({
    key: item.id,
    index: i + 1,
    id: item.id,
    activityName: item.activity ? item.activity.name : '',
    activityStatus: item.activity ? item.activity.status : '',
    beforeSceneIDs: !_.isEmpty(item.beforeSceneIDs) ? item.beforeSceneIDs.join(',') : '',
    name: item.name,
    skipCount: item.skipCount,
    type: item.type,
    actions: { status: item.activity ? item.activity.status : '', type: item.type, beforeSceneIDs: item.beforeSceneIDs, id: item.id },
  }));

class MaterialTable extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;

    this.state = {
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

  setStartMater = async id => {
    const { dispatch, onChange } = this.props;
    const { lists } = this.state;
    const temps = _.cloneDeep(lists).map(ele => {
      const ele1 = ele;
      if (ele1.id === id) {
        ele1.type = 'ROOT';
      }
      if (ele1.id !== id && ele1.type === 'ROOT') {
        ele1.type = '';
      }
      return ele1;
    });

    const res = await dispatch({
      type: 'activity/setSceneStart',
      payload: {
        id,
      },
    });

    if (res.header && res.header.code === 2000) {
      this.setState({
        lists: temps,
      });
      onChange(temps);
      message.info('设置成功');
    }
  };

  render() {
    const { lists } = this.state;
    const { mode } = this.props;

    return (
      <Fragment>
        <Table columns={getColumns(this.setStartMater, mode)} dataSource={mapDataToCols(lists)} align="center" pagination={false} rowKey="id" />
      </Fragment>
    );
  }
}

export default connect(({ activity, loading }) => ({
  activity,
  loading,
}))(MaterialTable);
