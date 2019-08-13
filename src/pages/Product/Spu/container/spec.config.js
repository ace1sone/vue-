import { Switch } from 'antd';
import React from 'react';

export function getAddSpecColumns(onAdd = () => {}) {
  return [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 72,
    },
    {
      title: '规格ID',
      dataIndex: 'id',
      key: 'id',
      width: 192,
    },
    {
      title: '规格名称(中文)',
      dataIndex: 'chineseName',
      key: 'chineseName',
      width: 144,
    },
    {
      title: '规格名称(英文)',
      dataIndex: 'englishName',
      key: 'englishName',
      width: 144,
    },
    {
      title: '规格标准数量',
      dataIndex: 'ssNum',
      key: 'ssNum',
      width: 144,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 96,
      render(action, item) {
        return (
          <span
            style={{ cursor: 'pointer', color: '#3B99FD' }}
            onClick={() => {
              onAdd(item);
            }}
          >
            添加
          </span>
        );
      },
    },
  ];
}

export const mapSpecStateToColumns = (l = []) => l.map((__, i) => ({ ...__, key: i, index: i + 1, jointId: __.id }));

export function getColumns() {
  return [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: '属性',
      dataIndex: 'attributes',
      key: 'attributes',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: checked => <Switch size="small" defaultChecked={!!checked} disabled />,
    },
  ];
}
export const mapDataToCols = (data = []) =>
  data.map((item, i) => ({
    key: item.id,
    index: i + 1,
    id: item.id,
    attributes: item.attributes,
    status: item.status,
  }));
