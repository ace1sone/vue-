import React from 'react';
import { Badge, Divider, Popconfirm } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import styles from './List.less';

import { toNewTab } from '@/pages/Activity/Sale/Common/common';

export function getColumns({ handleOnline = () => {}, handleOffline = () => {} }) {
  return [
    {
      title: '发售ID',
      dataIndex: 'id',
      width: 80,
      className: styles.wrap,
    },
    {
      title: '发售标题',
      dataIndex: 'title',
      width: 120,
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createdAt',
    // },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: status => {
        let statusStr = '';
        let text = '';
        if (status === 'NOT_STARTED') {
          text = '未开始';
          statusStr = 'warning';
        }
        // if (status === 'PREHEATING') {
        //   text = '预热中';
        //   statusStr = 'processing';
        // }
        if (status === 'PROCESSING') {
          text = '进行中';
          statusStr = 'success';
        }
        if (status === 'OVER') {
          text = '已结束';
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
      title: '下线时间',
      dataIndex: 'offlineAt',
    },
    {
      title: '发售开始时间',
      dataIndex: 'start',
    },
    {
      title: '发售结束时间',
      dataIndex: 'end',
    },
    {
      title: '上线状态',
      dataIndex: 'isOnline',
      render: v => (v ? '上线' : '下线'),
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: ({ status, id, isOnline }) => {
        if (status === 'NOT_STARTED') {
          return (
            <div>
              {/* !isOnline && (
              <Popconfirm title="确认上线吗?" onConfirm={() => handleOnline(id)} okText="确定" cancelText="取消">
                <a>上线</a>
              </Popconfirm>
            ) */}
              {/* isOnline && (
              <Popconfirm title="确认下线吗?" onConfirm={() => handleOff(id)} okText="确定" cancelText="取消">
                <a className={styles.red}>下线</a>
              </Popconfirm>
            ) */}
              <a onClick={() => router.push(`/activity/sale/all/edit/${id}`)}>编辑</a>
              <Divider type="vertical" />
              {toNewTab(`数据`, `/activity/sale/all/data/${id}`)}
              <Divider type="vertical" />
              <a onClick={() => router.push(`/activity/sale/all/detail/${id}`)}>查看</a>
            </div>
          );
        }
        if (status === 'PREHEATING' || status === 'PROCESSING') {
          return (
            <div>
              {/* !isOnline && (
              <Popconfirm title="确认上线吗?" onConfirm={() => handleOnline(id)} okText="确定" cancelText="取消">
                <a>上线</a>
              </Popconfirm>
            ) */}
              {/* isOnline && (
              <Popconfirm title="确认下线吗?" onConfirm={() => handleOff(id)} okText="确定" cancelText="取消">
                <a className={styles.red}>下线</a>
              </Popconfirm>
            ) */}
              {toNewTab(`数据`, `/activity/sale/all/data/${id}`)}
              <Divider type="vertical" />
              <a onClick={() => router.push(`/activity/sale/all/detail/${id}`)}>查看</a>
            </div>
          );
        }
        if (status === 'OVER') {
          return (
            <div>
              {/* !isOnline && (
              <Popconfirm title="确认上线吗?" onConfirm={() => handleOnline(id)} okText="确定" cancelText="取消">
                <a>上线</a>
              </Popconfirm>
            ) */}
              {/* isOnline && (
              <Popconfirm title="确认下线吗?" onConfirm={() => handleOff(id)} okText="确定" cancelText="取消">
                <a className={styles.red}>下线</a>
              </Popconfirm>
            ) */}
              <a onClick={() => router.push(`/activity/sale/all/edit/${id}`)}>编辑</a>
              <Divider type="vertical" />
              {toNewTab(`数据`, `/activity/sale/all/data/${id}`)}
              <Divider type="vertical" />
              <a onClick={() => router.push(`/activity/sale/all/detail/${id}`)}>查看</a>
            </div>
          );
        }
        if (!status) {
          return (
            <div>
              {/* !isOnline && (
                <Popconfirm title="确认上线吗?" onConfirm={() => handleOnline(id)} okText="确定" cancelText="取消">
                  <a>上线</a>
                </Popconfirm>
              ) */}
              {/* isOnline && (
                <Popconfirm title="确认下线吗?" onConfirm={() => handleOff(id)} okText="确定" cancelText="取消">
                  <a className={styles.red}>下线</a>
                </Popconfirm>
              ) */}
              <a onClick={() => router.push(`/activity/sale/all/edit/${id}`)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => router.push(`/activity/sale/all/detail/${id}`)}>查看</a>
            </div>
          );
        }
        return null;
      },
    },
  ];
}

export const mapDataToCols = (data = []) =>
  data.map((item, i) => ({
    key: item.id,
    index: i + 1,
    id: item.id,
    createdAt: item.createdAt,
    isOnline: item.isOnline,
    start: moment(item.start).format('YYYY-MM-DD HH:mm'),
    status: item.status,
    end: moment(item.end).format('YYYY-MM-DD HH:mm'),
    onlineAt: moment(item.onlineAt).format('YYYY-MM-DD HH:mm'),
    offlineAt: moment(item.offlineAt).format('YYYY-MM-DD HH:mm'),
    title: item.title,
    actions: { status: item.status, id: item.id, isOnline: item.isOnline },
  }));
