import React from 'react';
import _ from 'lodash';
import { taskExchangeType } from './SwitchForm';

const addSpusColumns = (picture, spuName, spuId, selectDatas, addHandle) => {
  const averageWdth = '31.5%';

  return [
    {
      title: picture,
      dataIndex: 'skuImg',
      width: averageWdth,
      render(skuImg) {
        return <img src={skuImg} alt="SPU图片" style={{ width: 40 }} />;
      },
    },
    {
      title: spuName,
      dataIndex: 'spuName',
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
};

const addSellColumns = (sellId, sellTitle, actStartTime, actEndTime, actInfo, addHandle) => {
  return [
    {
      title: sellId,
      dataIndex: 'id',
      width: '20%',
    },
    {
      title: sellTitle,
      dataIndex: 'title',
      width: '31.5%',
    },
    {
      title: actStartTime,
      dataIndex: 'start',
      width: '20%',
    },
    {
      title: actEndTime,
      dataIndex: 'end',
      width: '20%',
    },
    {
      title: '操作',
      dataIndex: '',
      width: '20%',
      render: text => {
        return (
          <a
            onClick={() => {
              addHandle(text);
            }}
            style={{ opacity: '1' }}
            name="delete"
            disabled={_.find(actInfo, x => text.id === x)}
          >
            {_.find(actInfo, x => text.id === x) ? '已选择' : '选择'}
          </a>
        );
      },
    },
  ];
};

const addTaskColumns = (taskId, name, type, startTime, endTime, taskInfo, addHandle) => {
  return [
    {
      title: taskId,
      dataIndex: 'id',
      width: '16%',
    },
    {
      title: name,
      dataIndex: 'name',
      width: '16%',
    },
    {
      title: type,
      dataIndex: 'type',
      width: '16%',
      render: item => taskExchangeType(item),
    },
    {
      title: startTime,
      dataIndex: 'startTime',
      width: '16%',
    },
    {
      title: endTime,
      dataIndex: 'endTime',
      width: '16%',
    },
    {
      title: '操作',
      dataIndex: '',
      render: text => {
        return (
          <a
            onClick={() => {
              addHandle(text);
            }}
            style={{ opacity: '1' }}
            name="delete"
            disabled={taskInfo && taskInfo.id === text.id}
          >
            {taskInfo && taskInfo.id === text.id ? '已选择' : '选择'}
          </a>
        );
      },
    },
  ];
};

const awardsColumns = (UId, name, phone, cardType, cardNumber, addressDraw, drawCode) => {
  return [
    {
      title: UId,
      dataIndex: 'userId',
      width: '16%',
    },
    {
      title: name,
      dataIndex: 'name',
      width: '16%',
    },
    {
      title: phone,
      dataIndex: 'phone',
      width: '16%',
    },
    {
      title: cardType,
      dataIndex: 'idType',
      width: '16%',
    },
    {
      title: cardNumber,
      dataIndex: 'idNum',
      width: '16%',
    },
    {
      title: addressDraw,
      dataIndex: 'address',
    },
    {
      title: drawCode,
      dataIndex: 'winningCode',
    },
  ];
};

export { addSellColumns, addSpusColumns, addTaskColumns, awardsColumns };
