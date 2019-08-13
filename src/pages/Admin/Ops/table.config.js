import React from 'react';
import { Popconfirm, Divider } from 'antd';
import moment from 'moment';
import router from 'umi/router';

export const columns = deleteService => [
  {
    title: '渠道',
    dataIndex: 'channel',
  },
  {
    title: '版本',
    dataIndex: 'version',
  },
  {
    title: '图片',
    dataIndex: 'imgUrl',
    render: val => (!val ? null : <img src={val} alt="" style={{ width: 40, height: 40 }} />),
  },
  {
    title: '开始时间',
    dataIndex: 'startAt',
  },
  {
    title: '结束时间',
    dataIndex: 'endAt',
  },
  {
    title: '操作',
    dataIndex: 'actions',
    render: item => (
      <div>
        <a onClick={() => router.push(`/admin/ops/all/detail/${item.id}`)}>编辑</a>
        <Divider type="vertical" />
        <Popconfirm title="确认要删除吗？" onConfirm={() => deleteService(item.id)}>
          <a>删除</a>
        </Popconfirm>
      </div>
    ),
  },
];

export const mapDataToCols = data =>
  data.map((item, i) => ({
    key: item.id || i,
    index: i + 1,
    id: item.id,
    version: item.version,
    channel: item.channel === 11 ? '鉴定师' : '发售剧场',
    startAt: moment(item.startAt).format('YYYY-MM-DD HH:mm'),
    endAt: moment(item.endAt).format('YYYY-MM-DD HH:mm'),
    imgUrl: item.imgUrl,
    status: item.status,
    actions: { index: i, id: item.id },
  }));
