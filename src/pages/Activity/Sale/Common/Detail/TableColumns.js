import React from 'react';
import { Popconfirm } from 'antd';

export default function spuColumns({ removeSpuTable = () => {} }, disabled) {
  return [
    {
      title: 'SPU图片',
      dataIndex: 'blackUrl',
      render(blackUrl) {
        return <img src={blackUrl} alt="SPU图片" style={{ width: 40 }} />;
      },
    },
    {
      title: 'SPU名称',
      dataIndex: 'englishName',
    },
    {
      title: 'SPU ID',
      dataIndex: 'spuId',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, item) => (
        <span>
          {!disabled && (
            <Popconfirm title="是否要删除此行？" onConfirm={() => removeSpuTable(item)}>
              <a disabled={disabled}>删除</a>
            </Popconfirm>
          )}
        </span>
      ),
    },
  ];
}
