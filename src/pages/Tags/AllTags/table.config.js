import React from 'react';

export const columns = ({ showTagsList = () => {} }) => [
  {
    title: '标签名称',
    dataIndex: 'name',
    width: '70%',
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
  },
  {
    title: '操作',
    dataIndex: 'action',
    render: (id, name) => (
      <div>
        <a onClick={() => showTagsList(id, name.name)}>编辑</a>
      </div>
    ),
  },
];

export const mapDataToCols = data =>
  data.map(item => ({
    key: item.id,
    id: item.id,
    name: item.name,
    createdAt: item.createdAt,
    action: item.id,
  }));
