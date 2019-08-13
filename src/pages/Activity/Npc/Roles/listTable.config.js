import React from 'react';
import { Badge, Divider } from 'antd';
import Link from 'umi/link';
import moment from 'moment';

export function getColumns(handleAction) {
  return [
    {
      title: 'NPC ID',
      dataIndex: 'npcId',
      width: '15%',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      width: '6%',
      render(avatar) {
        return <img src={avatar} alt="头像" style={{ width: 50 }} />;
      },
    },
    {
      title: 'NPC名称',
      dataIndex: 'name',
      width: '39%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: status => {
        let style = '';
        let text = '';
        if (status === 'ENABLE') {
          text = '启用';
          style = 'success';
        }
        if (status === 'DISABLE') {
          text = '禁用';
          style = 'error';
        }
        return <Badge status={style} text={text} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: item => {
        let text = '';
        let color = '';
        if (item.status === 'ENABLE') {
          text = '禁用';
          color = 'red';
        }
        if (item.status === 'DISABLE') {
          text = '启用';
          color = 'green';
        }
        return (
          <div>
            <a
              style={{ color }}
              onClick={() => {
                handleAction(item);
              }}
            >
              {text}
            </a>
            <Divider type="vertical" />
            <Link to={`/activity/npc/roles/list/detail?id=${item.npcId}`}>编辑</Link>
          </div>
        );
      },
    },
  ];
}

export const mapDataToCols = (data = []) =>
  data.map(item => ({
    key: item.id,
    npcId: item.npcId,
    name: item.name,
    status: item.status,
    avatar: item.avatar,
    createdTime: item.createdTime ? moment(item.createdTime).format('YYYY-MM-DD HH:mm') : '',
    actions: item,
  }));
