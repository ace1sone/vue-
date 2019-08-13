import React from 'react';
import StatusToggle from '@/components/StatusToggle';

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
  },
  {
    title: '后台类目ID',
    dataIndex: 'id',
  },
  {
    title: '后台类目名称',
    dataIndex: 'name',
  },
  {
    title: '后台类目层级',
    dataIndex: 'level',
  },
  {
    title: '状态',
    dataIndex: 'status',
    render(status) {
      return <StatusToggle enabled={status === 1} />;
    },
  },
];

const mapDataToCols = (data = []) =>
  data.map((item, i) => ({
    key: item.id,
    index: i + 1,
    id: item.id,
    name: item.name,
    level: item.level,
    status: item.status,
  }));

export default { columns, mapDataToCols };
