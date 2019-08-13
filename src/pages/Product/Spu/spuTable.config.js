import React from 'react';
import { Badge, Divider, Popconfirm } from 'antd';
import Link from 'umi/link';
import StatusToggle from '@/components/StatusToggle';
// import _ from 'lodash';

export function getColumns({ onStatusChange = () => {} }) {
  return [
    {
      title: '序号',
      dataIndex: 'index',
      width: 96,
    },
    {
      title: 'SPU ID',
      dataIndex: 'id',
      width: 96,
    },
    {
      title: '白底图',
      dataIndex: 'blackUrl',
      width: 96,
      render(blackUrl) {
        return <img src={blackUrl} alt="商品图" style={{ width: 96 }} />;
      },
    },
    {
      title: 'SPU（英文）',
      dataIndex: 'englishName',
      width: 120,
    },
    {
      title: '系列',
      dataIndex: 'seriesName',
      width: 120,
    },
    {
      title: '后台类目',
      dataIndex: 'backItemList',
      width: 144,
      render(backItemList) {
        const list = backItemList || [];
        return list.map(__ => __.name).join('>');
      },
    },
    {
      title: '前台类目',
      dataIndex: 'forClassList',
      width: 144,
      render(forClassList) {
        const forClassListArr = forClassList || [];
        forClassListArr.sort((pre, curr) => (pre.level < curr.level ? -1 : 1));
        return forClassListArr.map(__ => __.name).join('>');
      },
    },
    {
      title: '状态',
      dataIndex: 'delFlag',
      width: 120,
      render: status => (status ? <Badge status="error" text="禁用中" /> : <Badge status="success" text="启用中" />),
    },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 180,
      render: ({ delFlag, id }) => (
        <>
          <Link to={`/product/spu/new?id=${id}&action=1`}>编辑</Link>
          <Divider type="vertical" />
          <Link to={`/product/spu/new?id=${id}&action=2`}>查看</Link>
          <Divider type="vertical" />
          <Popconfirm
            title={`确认${delFlag === 0 ? '禁用' : '启用'}吗？`}
            onConfirm={() => {
              onStatusChange(delFlag !== 0, id);
            }}
          >
            <StatusToggle enabled={delFlag === 0} />
          </Popconfirm>
        </>
      ),
    },
  ];
}

export const mapDataToCols = (data = []) =>
  data.map((item, i) => ({
    key: item.spuId,
    index: i + 1,
    id: item.spuId,
    blackUrl: item.blackUrl,
    englishName: item.englishName,
    seriesName: item.seriesName,
    backItemList: item.backItemList,
    forClassList: item.forClassList,
    delFlag: item.delFlag,
    actions: { id: item.spuId, delFlag: item.delFlag },
  }));
