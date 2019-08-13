import React from 'react';
import { Popconfirm } from 'antd';

export function spuColumns({ removeSpuTable = () => {} }, disabled) {
  return [
    {
      title: 'SPU名称',
      dataIndex: 'spuName',
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

export function taskTableColumns({ removeTable = () => {} }, disabled) {
  const { origin, pathname } = window.location;
  const prefix = `${origin}${pathname}#`;

  return [
    {
      title: '任务名称',
      dataIndex: 'name',
    },
    {
      title: '任务ID',
      dataIndex: 'taskId',
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      render: text => (text === 'INVITATION' ? '邀新' : '解谜'),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, item) => (
        <span>
          {!disabled && (
            <Popconfirm title="是否要删除此行？" onConfirm={() => removeTable(item)}>
              <a disabled={disabled}>删除</a>
            </Popconfirm>
          )}{' '}
          {item.type === 'INVITATION' && (
            <a target="_blank" rel="noopener noreferrer" href={`${prefix}/activity/task/invited/list/detail?id=${item.taskId}&action=1`}>
              查看
            </a>
          )}
          {item.type === 'PUZZLE' && (
            <a target="_blank" rel="noopener noreferrer" href={`${prefix}/activity/task/puzzle/list/detail?id=${item.taskId}&action=1`}>
              查看
            </a>
          )}
        </span>
      ),
    },
  ];
}

export function activityTableColumns({ removeTable = () => {} }, disabled) {
  return [
    {
      title: '活动名称',
      dataIndex: 'activityName',
      width: 100,
    },
    {
      title: '活动ID',
      dataIndex: 'activityId',
      width: 100,
      render: text => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (text, item) => (
        <span>
          {!disabled && (
            <Popconfirm title="是否要删除此行？" onConfirm={() => removeTable(item)}>
              <a disabled={disabled}>删除</a>
            </Popconfirm>
          )}
        </span>
      ),
    },
  ];
}
