import React from 'react';
import { Popconfirm } from 'antd';

export default function spuColumns({ removeSpuTable = () => { } }, disabled) {

  return [
    {
      title: 'SPU图片',
      dataIndex: 'blackUrl',
      width: '15%',
      render(blackUrl) {
        return <img src={blackUrl} alt="SPU图片" style={{ width: 40 }} />;
      },
    },
    {
      title: 'SPU名称',
      dataIndex: 'englishName',
      width: '15%',
    },
    {
      title: 'SPU ID',
      dataIndex: 'spuId',
      width: '15%',
    },
    {
      title: '品牌名称（英文）',
      dataIndex: 'brandName',
      width: '15%',
    },
    {
      title: '系列名称（英文）',
      dataIndex: 'seriesName',
      width: '15%',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, item) => (
        <span>
          <Popconfirm title="是否要删除此行？" onConfirm={() => removeSpuTable(item)}>
            <a style={{color: '#F5222D'}} disabled={disabled}>删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ]
};
