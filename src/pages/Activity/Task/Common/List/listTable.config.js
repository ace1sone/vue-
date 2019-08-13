import React from 'react';
import { Badge, Divider } from 'antd';
import Link from 'umi/link';
import moment from 'moment';

export function getColumns(type) {
  return [
    {
      title: '任务ID',
      dataIndex: 'id',
    },
    {
      title: '任务名称',
      dataIndex: 'name',
    },
    {
      title: '关联活动名称',
      dataIndex: 'activity',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: status => {
        let style = '';
        let text = '';
        if (status === 'WAITING') {
          text = '待开始';
          style = 'warning';
        }
        if (status === 'STARTED') {
          text = '已开始';
          style = 'success';
        }
        if (status === 'ENDED') {
          text = '已结束';
          style = 'default';
        }
        return <Badge status={style} text={text} />;
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: ({ status, id }) => {
        if (status === 'WAITING') {
          return (
            <div>
              <Link to={`/activity/task/${type}/list/detail?id=${id}&action=2`}>编辑</Link>
              <Divider type="vertical" />
              <Link to={`/activity/task/${type}/list/detail?id=${id}&action=1`}>查看</Link>
            </div>
          );
        }
        return (
          <div>
            <Link to={`/activity/task/${type}/list/detail?id=${id}&action=1`}>查看</Link>
          </div>
        );
      },
    },
  ];
}

export const mapDataToCols = (data = []) =>
  data.map(item => ({
    key: item.id,
    id: item.id,
    name: item.name,
    startTime: item.startTime ? moment(item.startTime).format('YYYY-MM-DD HH:mm') : '',
    status: item.status,
    endTime: item.endTime ? moment(item.endTime).format('YYYY-MM-DD HH:mm') : '',
    activity: item.activity,
    actions: { status: item.status, id: item.id },
  }));
