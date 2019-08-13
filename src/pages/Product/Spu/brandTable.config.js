import React from 'react';
import StatusToggle from '@/components/StatusToggle';

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
  },
  {
    title: '品牌类目ID',
    dataIndex: 'id',
  },
  {
    title: '品牌名称(英文)',
    dataIndex: 'name',
  },
  {
    title: '状态',
    dataIndex: 'status',
    render(status) {
      return <StatusToggle enabled={+status === 1} />;
    },
  },
];

const mapDataToCols = (data = []) =>
  data.map((item, i) => ({
    key: item.id,
    index: i + 1,
    id: item.id,
    name: item.englishName,
    status: item.status,
  }));

export default { columns, mapDataToCols };
