import React from 'react';
import { Divider, Badge } from 'antd';
import router from 'umi/router';

export const columns = () => [
  {
    title: '序号',
    dataIndex: 'index',
  },
  {
    title: 'SPU ID',
    dataIndex: 'spuId',
  },
  {
    title: '商品图片',
    dataIndex: 'skuImg',
    render: val => (!val ? null : <img src={val} alt="" style={{ width: 40, height: 40 }} />),
  },
  {
    title: 'SPU名称（英文）',
    dataIndex: 'spuName',
  },
  {
    title: '所属品牌',
    dataIndex: 'brandName',
  },
  {
    title: '状态',
    dataIndex: 'sellingStatus',
    render: status => {
      let text = ' 已下架';
      let type = 'error';
      if (status === 1 || status === '1') {
        text = ' 售卖中';
        type = 'success';
      }
      return (
        <React.Fragment>
          <Badge status={type} />
          <span>{text}</span>
        </React.Fragment>
      );
    },
  },
  {
    title: 'SKU上架总数',
    dataIndex: 'shelfNum',
  },
  {
    title: '操作',
    dataIndex: 'actions',
    render: item => (
      <div>
        <a onClick={() => router.push(`/product/shelve/prdshelve/invdetail/${item.spuId||11}`)}>库存详情</a>
        <Divider type="vertical" />
        <a onClick={() => router.push(`/product/shelve/prdshelve/prddetail/${item.spuId}`)}>商品详情</a>
      </div>
    ),
  },
];

export const mapDataToCols = data =>
  data.map((item, i) => ({
    key: item.id,
    index: i + 1,
    id: item.id,
    brandName: item.brandName,
    sellingStatus: item.sellingStatus,
    seriesName: item.seriesName,
    shelfNum: item.shelfNum,
    skuImg: item.skuImg,
    spuId: item.spuId,
    spuName: item.spuName,
    actions: { index: i, spuId: item.spuId, sellingStatus: item.sellingStatus },
  }));
