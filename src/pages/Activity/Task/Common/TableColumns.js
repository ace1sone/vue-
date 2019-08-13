import React from 'react';
import { Popconfirm, Divider, Checkbox } from 'antd';
import { taskExchangeType } from './SwitchForm';

function spuColumns(removeSpuTable, showSkuDialog, handleSwitchChange, action) {
  return [
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
      width: '26%',
    },

    {
      title: 'SPU ID',
      dataIndex: 'spuId',
      width: '15%',
    },

    {
      title: '任务完成前',
      width: '20%',
      children: [
        {
          title: '可见',
          dataIndex: 'visibility',
          width: '10%',
          render: (value, record) => (
            <span>
              <Checkbox
                checked={value === undefined ? true : !!value}
                onClick={() => {
                  handleSwitchChange(record, 'visibility');
                }}
                style={{ color: '#faad14' }}
                disabled={action === '1'}
              />
            </span>
          ),
        },
        {
          title: '可买',
          dataIndex: 'buyAbility',
          width: '10%',
          render: (value, record) => (
            <span>
              <Checkbox
                checked={false}
                onClick={() => {
                  handleSwitchChange(record, 'buyAbility');
                }}
                style={{ color: '#faad14' }}
                disabled
              />
            </span>
          ),
        },
      ],
    },
    {
      title: '发售可售库存',
      dataIndex: 'initSkuStock',
      width: '15%',
    },

    {
      title: '操作',
      key: 'action',
      render: (text, item) => (
        <span>
          <a onClick={() => showSkuDialog(item)}>{action !== '1' ? '编辑' : '查看'}</a>
          {action !== '1' && (
            <span>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => removeSpuTable(item)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          )}
        </span>
      ),
    },
  ];
}

function taskColumns(removeTaskTable, action) {
  const { origin, pathname } = window.location;
  const prefix = `${origin}${pathname}#`;
  return [
    {
      title: '任务ID',
      dataIndex: 'id',
      width: '16%',
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      width: '16%',
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      width: '16%',
      render: item => taskExchangeType(item),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: '16%',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: '16%',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, item) => {
        let type = '';
        switch (text.type) {
          case 'INVITATION':
            type = 'invited';
            break;
          case 'PUZZLE':
            type = 'puzzle';
            break;
          case 'DRAW':
            type = 'randomdraw';
            break;
          default:
        }
        return (
          <span>
            {action !== '1' && (
              <span>
                <Popconfirm title="是否要删除此行？" onConfirm={() => removeTaskTable(item)}>
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
              </span>
            )}
            <a target="_blank" rel="noopener noreferrer" href={`${prefix}/activity/task/${type}/list/detail?id=${item.id}&action=1`}>
              查看
            </a>
          </span>
        );
      },
    },
  ];
}

export { spuColumns, taskColumns };
