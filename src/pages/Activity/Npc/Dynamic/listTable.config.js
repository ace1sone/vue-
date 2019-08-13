import React from 'react';
import { Divider, Popconfirm } from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import { npcpublish, displayType, npcType } from '../SwitchForm';

export function getColumns(handleAction, handlePublish) {
  return [
    {
      title: '动态 ID',
      dataIndex: 'postCode',
      width: '10%',
    },
    {
      title: '动态名称',
      dataIndex: 'title',
      width: '15%',
    },
    {
      title: '类型',
      dataIndex: 'postType',
      width: '9%',
      render: item => npcType(item),
    },
    {
      title: 'NPC名称',
      dataIndex: 'npcName',
      width: '15%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '10%',
      render: status => npcpublish(status),
    },
    {
      title: '是否展示',
      dataIndex: 'displayType',
      width: '9%',
      render: show => displayType(show),
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: item => {
        return (
          <div>
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => {
                handleAction(item, 'remove');
              }}
            >
              <a style={{ color: 'red' }}>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={() => handleAction(item, 'display')}>{item.displayType === 'SHOW' ? '隐藏' : '展示'}</a>
            <Divider type="vertical" />
            <Link disabled={item.npcStatus === 'DISABLE'} to={`/activity/npc/dynamic/list/detail?id=${item.id}&type=${item.postType}`}>
              编辑
            </Link>
            <Divider type="vertical" />
            <a onClick={() => handlePublish(item)} disabled={item.status === 'PUBLISHED'}>
              发布
            </a>
          </div>
        );
      },
    },
  ];
}

export const mapDataToCols = (data = []) =>
  data.map(item => ({
    key: item.id,
    postCode: item.postCode,
    title: item.title,
    npcName: item.npcName,
    status: item.status,
    postType: item.postType,
    displayType: item.displayType,
    publishTime: item.publishTime ? moment(item.publishTime).format('YYYY-MM-DD HH:mm') : '',
    actions: item,
  }));
