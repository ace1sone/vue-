import React from 'react';
import { Badge } from 'antd';
import moment from 'moment';
import TimeDialog from './TimeDialog';

export function getColumns() {
  return [
    {
      title: '发售ID',
      dataIndex: 'activityId',
    },
    {
      title: '发售名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: status => {
        let statusStr = '';
        let text = '';
        if (status === 'NOT_STARTED') {
          text = '未开始';
          statusStr = 'warning';
        }
        if (status === 'PROCESSING') {
          text = '进行中';
          statusStr = 'success';
        }
        if (status === 'OVER') {
          text = '已结束';
          statusStr = 'default';
        }
        return <Badge status={statusStr} text={text} />;
      },
    },
    {
      title: '上线状态',
      dataIndex: 'isOnline',
      render: isOnline => <span>{isOnline ? '上线' : '下线'}</span>,
    },
    {
      title: '占用开始时间',
      dataIndex: 'startAt',
    },
    {
      title: '占用结束时间',
      dataIndex: 'endAt',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: ({ id, activityId }) => <TimeDialog id={id} activityId={activityId} />,
    },
  ];
}

export const mapDataToCols = (data = []) =>
  data.map(item => ({
    key: item.id,
    activityId: item.activityId,
    name: item.activity.name,
    startAt: item.startAt ? moment(item.startAt).format('YYYY-MM-DD HH:mm') : '',
    status: item.activity.status,
    endAt: item.endAt ? moment(item.endAt).format('YYYY-MM-DD HH:mm') : '',
    isOnline: item.activity.isOnline,
    actions: { id: item.id, activityId: item.activityId },
  }));
