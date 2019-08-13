import React from 'react';
import { Tag, Divider } from 'antd';
import moment from 'moment';

export function getColumns(handleAddRecommend = () => {}, handleDeleteRecommend = () => {}, handleTop = () => {}) {
  return [
    {
      title: '前端排序',
      dataIndex: 'order',
    },
    {
      title: 'ID',
      dataIndex: 'recommendationId',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: curr => (
        <p>
          <Tag color="blue">已推荐</Tag>
          {curr === 'ACTIVITY' ? '活动' : '剧情'}
        </p>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '上线状态',
      dataIndex: 'onlineStatus',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: ({ recommended, data }) => {
        if (recommended) {
          return (
            <span>
              <a style={{ color: '1890FF' }} onClick={() => handleTop(data)}>
                置顶
              </a>
              <Divider type="vertical" />
              <a disabled={recommended} onClick={() => handleAddRecommend(data)}>
                取消推荐
              </a>
            </span>
          );
        }
        return (
          <span>
            <a style={{ color: 'red' }} onClick={() => handleDeleteRecommend(data)}>
              删除
            </a>
            <Divider type="vertical" />
            <a disabled={recommended} onClick={() => handleAddRecommend(data)}>
              设为推荐
            </a>
          </span>
        );
      },
    },
  ];
}

export const mapDataToCols = (data = []) =>
  data.map(item => ({
    key: item.recommendationId,
    order: item.order,
    recommendationId: item.recommendationId,
    name: item.name,
    type: item.type,
    startTime: item.startTime ? moment(item.startTime).format('YYYY-MM-DD HH:mm') : '',
    status: item.status,
    onlineStatus: item.onlineStatus,
    endTime: item.endTime ? moment(item.endTime).format('YYYY-MM-DD HH:mm') : '',
    actions: { recommended: item.recommended },
  }));
