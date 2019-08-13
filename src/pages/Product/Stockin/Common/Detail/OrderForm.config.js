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

const associatedColumns = (serial, picture, spuName, spuId, averageWdth, selectDatas, addHandle, baseIndex) => [
  {
    title: serial,
    dataIndex: '',
    width: '10%',
    render: (value, record, index) => <span>{baseIndex + index + 1}</span>,
  },
  {
    title: picture,
    dataIndex: 'blackUrl',
    width: averageWdth,
    render(blackUrl) {
      return <img src={blackUrl} alt="SPU图片" style={{ width: 40 }} />;
    },
  },
  {
    title: spuName,
    dataIndex: 'englishName',
    width: averageWdth,
  },
  {
    title: spuId,
    dataIndex: 'spuId',
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
        name="delete"
        disabled={_.find(selectDatas, x => text.spuId === x.spuId)}
      >
        {_.find(selectDatas, x => text.spuId === x.spuId) ? '已添加' : '添加'}
      </a>
    ),
  },
];
const addSpusColumns = (serial, picture, spuName, spuId, selectDatas = [], addHandle, baseIndex) => {
  const averageWdth = '31.5%';

  const columns = associatedColumns(serial, picture, spuName, spuId, averageWdth, selectDatas, addHandle, baseIndex);
  return columns;
};
export { stockinInfoColumns, addSpusColumns };
