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
      title: '品牌ID',
      dataIndex: 'id',
    },
    {
      title: 'LOGO',
      dataIndex: 'logo',
      render: val => {
        return !val ? null : <img src={val} alt="" style={{ width: 60, height: 60 }} />;
      },
    },
    {
      title: '品牌名（中文）',
      dataIndex: 'chineseName',
    },
    {
      title: '品牌名（英文）',
      dataIndex: 'englishName',
    },
    {
      title: '系列',
      dataIndex: 'seriesNum',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '状态',
      dataIndex: 'delFlag',
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
          <a onClick={() => router.push(`/product/properties/brand/edit/${item.id}`)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => router.push(`/product/properties/brand/detail/${item.id}`)}>查看</a>
          <Divider type="vertical" />
          {Number(item.delFlag) === 0 ? (
            <Popconfirm title="确认要禁用吗？" onConfirm={() => handleFreeze(item)}>
              <a type="danger">禁用</a>
            </Popconfirm>
          ) : (
            <Popconfirm title="确认要禁用吗？" onConfirm={() => handleFreeze(item)}>
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
    seriesNum: item.seriesNum,
    logo: item.logo,
    createdAt: item.createdAt ? moment(item.createdAt).format('YYYY-MM-DD HH:mm') : '',
    delFlag: item.delFlag,
    actions: { index: i, id: item.id, delFlag: item.delFlag },
  }));
