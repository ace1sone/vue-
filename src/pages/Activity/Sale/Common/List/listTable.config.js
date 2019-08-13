import React from 'react';
import { Badge, Divider } from 'antd';
import { Config } from '@/config';
import moment from 'moment';
import router from 'umi/router';
import { toNewTab } from '@/pages/Activity/Sale/Common/common';
import _ from 'lodash';

import styles from './List.less';
import { ACTIVITY_SCOPE } from '@/constants';

export function getColumns({ handleOnline = () => {}, handleOffline = () => {}, checkMiniProgrameQRCode = () => {} }) {
  const { origin, pathname } = window.location;
  const prefix = `${origin}${pathname}#`;
  return [
    {
      title: '发售ID',
      dataIndex: 'id',
      width: 80,
      className: styles.wrap,
    },
    {
      title: '发售名称',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '发售渠道',
      dataIndex: 'scope',
      width: 140,
    },
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
      render: ({ status, id, isOnline, displayRange, scope }) => {
        const showQRCode = scope ? (['dev', 'beta'].includes(Config.env) ? scope.includes(14) || scope.includes(15) : scope.includes(15)) : false;
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
            {status === 'NOT_STARTED' && (
              <a target="_blank" rel="noopener noreferrer" href={`${prefix}/activity/sale/all/edit/${id}`}>
                编辑
              </a>
            )}
            {(status === 'PROCESSING' || status === 'OVER') && <Divider type="vertical" />}
            {(status === 'PROCESSING' || status === 'OVER') && toNewTab(`数据`, `/activity/sale/all/data/${id}`)}
            <Divider type="vertical" />
            <a target="_blank" rel="noopener noreferrer" href={`${prefix}/activity/sale/all/detail/${id}`}>
              查看
            </a>
            {showQRCode && <Divider type="vertical" />}
            {showQRCode && <a onClick={() => checkMiniProgrameQRCode(id)}>小程序码</a>}
          </div>
        );
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
