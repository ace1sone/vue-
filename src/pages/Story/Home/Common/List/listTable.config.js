import React from 'react';
import { Badge, Divider } from 'antd';
import moment from 'moment';
import _ from 'lodash';

import styles from './List.less';
import { ACTIVITY_SCOPE } from '@/constants';

export function getColumns() {
  const { origin, pathname } = window.location;
  const prefix = `${origin}${pathname}#`;
  return [
    {
      title: '剧情ID',
      dataIndex: 'id',
      className: styles.wrap,
    },
    {
      title: '展示渠道',
      dataIndex: 'scope',
    },
    {
      title: '剧情名称',
      dataIndex: 'name',
    },
    {
      title: '集数',
      dataIndex: 'episode',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: status => {
        let statusStr = '';
        let text = '';
        if (status === 'WAITING_FOR_ONLINE') {
          text = '待上线';
          statusStr = 'warning';
        }
        if (status === 'ONLINE') {
          text = '已上线';
          statusStr = 'success';
        }
        if (status === 'OFFLINE') {
          text = '已下线';
          statusStr = 'default';
        }
        if (status === 'DRAFT') {
          text = '草稿';
          statusStr = 'default';
        }
        return <Badge status={statusStr} text={text} />;
      },
    },
    {
      title: '上线时间',
      dataIndex: 'onlineAt',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: ({ status, id }) => (
        <div>
          {status !== 'ONLINE' && (
            <a target="_blank" rel="noopener noreferrer" href={`${prefix}/story/home/all/edit/${id}`}>
              编辑
            </a>
          )}
          {status !== 'ONLINE' && <Divider type="vertical" />}
          <a target="_blank" rel="noopener noreferrer" href={`${prefix}/story/home/all/detail/${id}`}>
            查看
          </a>
        </div>
      ),
    },
  ];
}

export const mapDataToCols = (data = []) =>
  data.map((item, i) => ({
    key: item.id,
    index: i + 1,
    id: item.id,
    episode: item.episode,
    createdAt: item.createdAt,
    isOnline: item.isOnline,
    start: moment(item.start).format('YYYY-MM-DD HH:mm'),
    status: item.status,
    end: moment(item.end).format('YYYY-MM-DD HH:mm'),
    onlineAt: item.onlineAt ? moment(item.onlineAt).format('YYYY-MM-DD HH:mm') : '',
    offlineAt: item.offlineAt ? moment(item.offlineAt).format('YYYY-MM-DD HH:mm') : '',
    title: item.title,
    name: item.name,
    scope: item.scope
      ? item.scope
          .map(ele => {
            const obj = ACTIVITY_SCOPE.find(ele2 => ele2.value === ele);
            if (!_.isEmpty(obj)) return obj.label;
            return '';
          })
          .join(',')
      : [],
    actions: { status: item.status, id: item.id, isOnline: item.isOnline, displayRange: item.displayRange, scope: item.scope },
  }));
