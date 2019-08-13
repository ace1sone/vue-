import React from 'react';
import { Badge, Divider, Icon, Modal } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import styles from './List.less';

const borderStyle = {};

export const columns = [
  {
    title: '素材ID',
    dataIndex: 'id',
  },
  {
    title: '素材名称',
    dataIndex: 'name',
    render: text => <div style={borderStyle}>{text}</div>,
  },
  {
    title: '关联发售名称',
    dataIndex: 'activityName',
  },
  {
    title: '发售状态',
    dataIndex: 'activityStatus',
    render: item => {
      let value = '';
      switch (item) {
        case 'NOT_STARTED':
          value = <Badge status="warning" text="未开始" />;
          break;
        case 'PROCESSING':
          value = <Badge status="success" text="进行中" />;
          break;
        case 'OVER':
          value = <Badge status="default" text="已结束" />;
          break;
        default:
          value = '';
      }
      return value;
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createAtString',
  },
  {
    title: '操作',
    dataIndex: 'actions',
    render: ({ status, id }) => {
      if (status === 'PROCESSING') {
        return (
          <div>
            <a onClick={() => router.push(`/activity/material/all/detail/${id}`)}>查看</a>
          </div>
        );
      }
      return (
        <div>
          <a onClick={() => router.push(`/activity/material/all/edit/${id}`)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => router.push(`/activity/material/all/detail/${id}`)}>查看</a>
        </div>
      );
    },
  },
];

export const mapDataToCols = (records = []) =>
  records.map((item, i) => ({
    key: item.id,
    index: i + 1,
    id: item.id,
    activityName: item.activity ? item.activity.name : '',
    activityStatus: item.activity ? item.activity.status : '',
    beforeSceneIDs: item.beforeSceneIDs,
    createAtString: moment(item.createAtString).format('YYYY-MM-DD HH:mm'),
    name: item.name,
    skipCount: item.skipCount,
    type: item.type,
    actions: { status: item.activity ? item.activity.status : '', id: item.id },
  }));
