import React from 'react';
import { Popconfirm, Divider, Badge, Icon } from 'antd';
import styles from '../Detail.less';

function spuColumns(removeSpuTable, upBlock, downBlock) {
  return [
    {
      title: '前端展示顺序',
      dataIndex: 'weight',
      width: '10%',
    },
    {
      title: '商品图片',
      dataIndex: 'skuImg',
      width: '10%',
      render(skuImg) {
        return <img src={skuImg} alt="SPU图片" style={{ width: 40 }} />;
      },
    },
    {
      title: '商品名称',
      dataIndex: 'spuName',
      width: '36%',
    },

    {
      title: 'SPU ID',
      dataIndex: 'spuId',
      width: '20%',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, item) => {
        return (
          <span>
            <a onClick={() => upBlock(item)}>
              <Icon className={styles.iconfont} type="arrow-up" />
            </a>
            <Divider className={styles.Divider} type="vertical" />
            <a onClick={() => downBlock(item)}>
              <Icon className={styles.iconfont} type="arrow-down" />
            </a>
            <Divider className={styles.Divider} type="vertical" />
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => {
                removeSpuTable(item);
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];
}

function activityColumns(removeActivity, action) {
  const { origin, pathname } = window.location;
  const prefix = `${origin}${pathname}#`;
  return [
    {
      title: '发售ID',
      dataIndex: 'id',
      width: '20%',
    },
    {
      title: '发售名称',
      dataIndex: 'name',
      width: '39%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '20%',
      render: status => {
        let statusStr = '';
        let text = '';
        if (status === 'NOT_STARTED') {
          text = '未开始';
          statusStr = 'warning';
        }
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
      title: '操作',
      key: 'action',
      render: (text, item) => {
        return (
          <span>
            {action !== '1' && (
              <span>
                <a onClick={() => removeActivity(item)}>删除</a>
                <Divider type="vertical" />
              </span>
            )}
            <a target="_blank" rel="noopener noreferrer" href={`${prefix}/activity/sale/all/detail/${item.id}`}>
              查看
            </a>
          </span>
        );
      },
    },
  ];
}

export { spuColumns, activityColumns };
