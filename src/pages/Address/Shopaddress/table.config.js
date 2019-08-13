import React from 'react';

export const columns = ({ showAddress = () => {} }) => {
  return [
    {
      title: '店铺ID',
      dataIndex: 'id',
    },
    {
      title: '店铺名称',
      dataIndex: 'name',
    },
    {
      title: '详细地址',
      dataIndex: 'address',
    },
    {
      title: '联系方式',
      dataIndex: 'num',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: id => (
        <div>
          <a onClick={() => showAddress(id)}>编辑</a>
        </div>
      ),
    },
  ];
};

export const mapDataToCols = data =>
  data.map(item => ({
    key: item.id,
    id: item.id,
    name: item.name,
    address: item.address,
    contact: item.contact,
    num: item.phoneNumber ? `${item.phoneArea}-${item.phoneNumber}` : '',
    action: item.id,
  }));
