import React from 'react';
import _ from 'lodash';

function activtyColumns(id, name, selectDatas, addHandle) {
  return [
    {
      title: id,
      dataIndex: 'id',
      width: '16%',
    },
    {
      title: name,
      dataIndex: 'name',
      width: '16%',
    },
    {
      title: '上线时间',
      dataIndex: 'onlineAt',
      width: '16%',
    },
    {
      title: '下线时间',
      dataIndex: 'offlineAt',
      width: '16%',
    },

    {
      title: '发售开始时间',
      dataIndex: 'start',
      width: '16%',
    },

    {
      title: '发售结束时间',
      dataIndex: 'end',
      width: '16%',
    },
    {
      title: '操作',
      dataIndex: '',
      width: '9%',
      render: text => (
        <a
          onClick={() => {
            addHandle(text);
          }}
          style={{ opacity: '1' }}
          disabled={_.find(selectDatas, x => text.spuId === x.spuId)}
        >
          {_.find(selectDatas, x => text.spuId === x.spuId) ? '已添加' : '添加'}
        </a>
      ),
    },
  ];
}

function plotColumns(id, name, selectDatas, addHandle) {
  return [
    {
      title: id,
      dataIndex: 'id',
      width: '16%',
    },
    {
      title: name,
      dataIndex: 'name',
      width: '16%',
    },
    {
      title: '上线时间',
      dataIndex: 'onlineAt',
      width: '16%',
    },
    {
      title: '下线时间',
      dataIndex: 'offlineAt',
      width: '16%',
    },
    {
      title: '操作',
      dataIndex: '',
      width: '9%',
      render: text => (
        <a
          onClick={() => {
            addHandle(text);
          }}
          style={{ opacity: '1' }}
          disabled={_.find(selectDatas, x => text.spuId === x.spuId)}
        >
          {_.find(selectDatas, x => text.spuId === x.spuId) ? '已添加' : '添加'}
        </a>
      ),
    },
  ];
}

export { activtyColumns, plotColumns };
