import React from 'react';
import { Popconfirm, Divider } from 'antd';
import moment from 'moment';
import router from 'umi/router';

export const columns = deleteService => {
  return [
    {
      title: '序号',
      dataIndex: 'index',
    },
    {
      title: '商品服务ID',
      dataIndex: 'id',
    },
    {
      title: '规格图标',
      dataIndex: 'icon',
      render: val => (!val ? null : <img src={val} alt="" style={{ width: 40, height: 40 }} />),
    },
    {
      title: '服务名称',
      dataIndex: 'name',
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: item => (
        <div>
          <a onClick={() => router.push(`/product/skuservice/service/detail/${item.id}`)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确认要删除吗？" onConfirm={() => deleteService(item.id)}>
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ];
};

export const mapDataToCols = data =>
  data.map((item, i) => ({
    key: item.id,
    index: i + 1,
    id: item.id,
    icon: item.icon,
    isUsed: item.isUsed,
    name: item.name,
    createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm'),
    createdBy: item.createdBy,
    actions: { index: i, id: item.id },
  }));
