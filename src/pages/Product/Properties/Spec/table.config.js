import React from 'react';
import { Popconfirm, Divider, Badge } from 'antd';
import moment from 'moment';
import router from 'umi/router';

export const columns = handleFreeze => {
  return [
    {
      title: '序号',
      dataIndex: 'index',
    },
    {
      title: '规格ID',
      dataIndex: 'id',
    },
    {
      title: '规格名称（中文）',
      dataIndex: 'chineseName',
    },
    {
      title: '规格名称（英文）',
      dataIndex: 'englishName',
    },
    {
      title: '规格标准数量',
      dataIndex: 'ssNum',
      align: 'right',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: status => {
        let text = ' 禁用中';
        let type = 'error';
        if (status === 0 || status === '0') {
          text = ' 启用中';
          type = 'success';
        }
        return (
          <React.Fragment>
            <Badge status={type} />
            <span>{text}</span>
          </React.Fragment>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: item => (
        <div>
          <a onClick={() => router.push(`/product/properties/spec/edit/${item.id}`)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => router.push(`/product/properties/spec/detail/${item.id}`)}>查看</a>
          <Divider type="vertical" />
          {Number(item.status) === 0 ? (
            <Popconfirm title="确认要禁用吗？" onConfirm={() => handleFreeze(item)}>
              <a style={{color: '#f5222d'}}>禁用</a>
            </Popconfirm>
          ) : (
            <Popconfirm title="确认要启用吗？" onConfirm={() => handleFreeze(item)}>
              <a>启用</a>
            </Popconfirm>
          )}
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
    chineseName: item.chineseName,
    englishName: item.englishName,
    ssNum: item.ssNum,
    createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm'),
    status: item.status,
    actions: { index: i, id: item.id, status: item.status },
  }));
