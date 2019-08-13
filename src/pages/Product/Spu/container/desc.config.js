import { Switch } from 'antd';
import React from 'react';
import StatusToggle from '@/components/StatusToggle';

export function getAddDecColumns(onAdd = () => {}) {
  return [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 72,
    },
    {
      title: '描述ID',
      dataIndex: 'id',
      key: 'id',
      width: 192,
    },
    {
      title: '描述名称',
      dataIndex: 'name',
      key: 'name',
      width: 264,
    },
    {
      title: '描述子属性数量',
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

export const mapDescStateToColumns = (l = []) => l.map((__, i) => ({ ...__, key: __.id, index: i + 1, jointId: __.id }));

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

export function getSubDescColumns(onAdd = () => {}) {
  return [
    {
      title: '子属性Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '子属性名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'selected',
      key: 'selected',
      align: 'center',
      render: (selected, item) => (
        <StatusToggle onClick={isSelected => onAdd(isSelected, item)} disabledText="已添加" enabledText="添加" enabled={selected} />
      ),
    },
  ];
}

export const mapSubDataToCols = (data = []) =>
  data.map((item, i) => ({
    key: item.id,
    index: i + 1,
    id: item.id,
    name: item.name,
    selected: item.selected,
  }));
