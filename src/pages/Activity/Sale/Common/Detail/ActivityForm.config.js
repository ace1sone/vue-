import React from 'react';
import _ from 'lodash';

const defaultColumns = (picture, spuName, spuId, brand, series) => [
  {
    title: picture,
    dataIndex: 'blackUrl',
    render(blackUrl) {
      return <img src={blackUrl} alt="SPU图片" style={{ width: 40 }} />;
    },
  },
  {
    title: spuName,
    dataIndex: 'englishName' || 'chineseName',
  },
  {
    title: spuId,
    dataIndex: 'spuId',
  },
  {
    title: brand,
    dataIndex: 'brandName',
  },
  {
    title: series,
    dataIndex: 'seriesName',
  },
];
const clickColumns = (picture, spuName, spuId, brand, series, deleteClick) => {
  const columns = defaultColumns(picture, spuName, spuId, brand, series);
  const deleteColumn = {
    title: '操作',
    dataIndex: '',
    key: 'operation',
    render: text => (
      <a
        onClick={() => {
          deleteClick(text);
        }}
        name="delete"
      >
        删除
      </a>
    ),
  };
  columns.push(deleteColumn);
  return columns;
};
const stockinInfoColumns = (picture, spuName, spuId, brand, series, deleteClick) => {
  const columns = deleteClick
    ? clickColumns(picture, spuName, spuId, brand, series, deleteClick)
    : defaultColumns(picture, spuName, spuId, brand, series);
  return columns;
};

const associatedColumns = (picture, spuNamee, spuId, averageWdth, selectDatas, addHandle) => [
  {
    title: picture,
    dataIndex: 'blackUrl',
    width: 100,
    render(blackUrl) {
      return <img src={blackUrl} alt="SPU图片" style={{ width: 40 }} />;
    },
  },
  {
    title: spuNamee,
    dataIndex: 'englishName',
    width: 752,
  },
  {
    title: spuId,
    dataIndex: 'spuId',
    width: 152,
  },
  {
    title: '操作',
    dataIndex: '',
    width: 80,
    render: text => (
      <a
        onClick={() => {
          addHandle(text);
        }}
        style={{ opacity: '1' }}
        name="delete"
        disabled={_.find(selectDatas, x => text.spuId === x.spuId)}
      >
        {_.find(selectDatas, x => text.spuId === x.spuId) ? '已添加' : '添加'}
      </a>
    ),
  },
];

const addSpusColumns = (picture, spuName, spuId, selectDatas = [], addHandle) => {
  const averageWdth = '31.5%';

  const columns = associatedColumns(picture, spuName, spuId, averageWdth, selectDatas, addHandle);
  return columns;
};

const addTasksColumns = (id, name, type, start, end, selectDatas = [], addHandle) => [
  {
    title: id,
    dataIndex: 'id',
  },
  {
    title: name,
    dataIndex: 'name',
  },
  {
    title: type,
    dataIndex: 'type',
    render: text => (text === 'INVITATION' ? '邀新' : '解谜'),
  },
  {
    title: start,
    dataIndex: 'startTime',
  },
  {
    title: end,
    dataIndex: 'endTime',
  },
  {
    title: '操作',
    dataIndex: '',
    render: text => (
      <a
        onClick={() => {
          addHandle(text);
        }}
        style={{ opacity: '1' }}
        name="delete"
        disabled={_.find(selectDatas, x => text.id === x.id)}
      >
        {_.find(selectDatas, x => text.id === x.id) ? '已添加' : '添加'}
      </a>
    ),
  },
];

const recomSpusColumns = (pic, name, spuId, selectDatas = [], addHandle) => [
  {
    title: pic,
    dataIndex: 'skuImg',
    render(skuImg) {
      return <img src={skuImg} alt="SPU图片" style={{ width: 40 }} />;
    },
  },
  {
    title: name,
    dataIndex: 'spuName',
  },
  {
    title: spuId,
    dataIndex: 'spuId',
  },
  {
    title: '操作',
    dataIndex: '',
    render: text => (
      <a
        onClick={() => {
          addHandle(text);
        }}
        style={{ opacity: '1' }}
        name="delete"
        disabled={_.find(selectDatas, x => text.spuId === x.spuId)}
      >
        {_.find(selectDatas, x => text.spuId === x.spuId) ? '已添加' : '添加'}
      </a>
    ),
  },
];

export { stockinInfoColumns, addSpusColumns, addTasksColumns, recomSpusColumns };
