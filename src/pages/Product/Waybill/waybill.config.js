import React from 'react';
import Link from 'umi/link';
import { get } from 'lodash';

const genetateLink = v => {
  if (v.shippingStatus === 1 && v.reverse) return <span style={{ color: '#cccccc', cursor: 'not-allowed' }}>前往发货</span>;
  if (v.shippingStatus === 1 && !v.reverse) return <Link to={`/order/b2cOrder/waybills/detail?id=${v.id}`}>前往发货</Link>;
  if (v.shippingStatus > 1) return <Link to={`/order/b2cOrder/waybills/detail?id=${v.id}`}>编辑</Link>;
};

export const tableColumns = [
  {
    title: '运单号',
    dataIndex: 'code',
    key: 'code',
    width: 136,
  },
  {
    title: '订单号',
    dataIndex: 'orderCode',
    key: 'orderCode',
    width: 136,
  },
  {
    title: '下单时间',
    dataIndex: 'orderTime',
    key: 'orderTime',
    width: 96,
  },
  {
    title: '收货人',
    dataIndex: 'consignee',
    key: 'consignee',
    width: 88,
  },
  {
    title: '发货时间',
    dataIndex: 'shippingTime',
    key: 'shippingTime',
    width: 96,
  },
  {
    title: '发货状态',
    dataIndex: 'shippingStatusName',
    key: 'shippingStatusName',
    width: 96,
  },
  {
    title: '快递公司',
    dataIndex: 'expressCompanyName',
    key: 'expressCompanyName',
    width: 80,
  },
  {
    title: '快递单号',
    dataIndex: 'expressNumber',
    key: 'expressNumber',
    width: 136,
  },
  {
    title: '售后方式',
    dataIndex: 'reverse',
    key: 'reverse',
    render: v => {
      const reverseType = {
        'ONLY_REFUND': '仅退款',
        'RETURN_NOT_REFUND': '退货不退款',
        'RETURN_REFUND': '退货退款',
        'TIME_OUT': '超时自动取消',
        'BUYER': '买家取消',
        'SELLER': '卖家取消',
      }
     return (v && v.reverseType ? <span style={{ color: 'red' }}>{reverseType[v.reverseType]}</span> : null)
    },
    width: 72,
  },
  {
    title: '操作',
    dataIndex: 'operator',
    key: 'operator',
    width: 144,
    render: v => <React.Fragment>{genetateLink(v)}</React.Fragment>,
  },
].map(v => ({
  ...v,
  height: 54,
  render: v.render ? v.render : (text) => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>,
}));

export const mapDataToCols = (records = []) =>
  records.map(v => {
    const { code, orderCode, orderTime, consignee, shippingTime, shippingStatusName, expressCompanyName, expressNumber, reverse } = v;
    return {
      code,
      orderCode,
      orderTime,
      consignee,
      shippingTime,
      shippingStatusName,
      expressCompanyName,
      expressNumber,
      reverse,
      key: code,
      operator: v,
    };
  });
