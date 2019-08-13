import React from 'react';
import { Table } from 'antd';
import { get } from 'lodash';

const columns = [
  {
    title: '商品',
    dataIndex: 'product',
    key: 'product',
    render: v => (
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <img style={{ display: 'inline-block', width: '40px', height: '40px' }} src={get(v, ['pic'])} alt="product-img" />
        <span>{v.name}</span>
      </div>
    ),
  },
  {
    title: '规格',
    dataIndex: 'spec',
    key: 'spec',
    render: v => (
      <div>
        {v.map(v => (
          <div key={v.basisID + `${Math.random()}`}>
            <span>{v.basisName}: </span>
            <span>{v.basisValue}</span>
            <br />
          </div>
        ))}
      </div>
    ),
  },
  {
    title: '单价',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
  },
  {
    title: '数量',
    key: 'num',
    dataIndex: 'num',
  },
  {
    title: 'SPU ID',
    key: 'spuId',
    dataIndex: 'spuId',
  },
  {
    title: '卖家ID',
    key: 'sellerId',
    dataIndex: 'sellerId',
  },
];

function mapDataToCols(data) {
  return data.map(v => ({
    product: v,
    spec: get(v, ['spec']),
    unitPrice: get(v, ['unitPrice']),
    num: get(v, ['num']),
    spuId: get(v, ['spuId']),
    sellerId: get(v, ['sellerId']),
    key: get(v, ['proId'])
  }));
}

export default class ProductInfoTable extends React.PureComponent {
  render() {
    const { data } = this.props;
    return <Table columns={columns} dataSource={mapDataToCols(data)} pagination={false} />;
  }
}
