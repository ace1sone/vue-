import React from 'react';
import { Table } from 'antd';
import { getImgSrc } from '@/utils/utils';
import router from 'umi/router';

class TableContent extends React.Component {
  constructor() {
    super();
    this.renderColumns = [];
    this.state = {};
  }

  componentWillMount = () => {
    this.loadColumns();
  };

  loadColumns = () => {
    const list = [
      {
        title: '商品图片',
        width: 100,
        key: 'goods',
        render: item => (
          <div style={{ width: 40, height: 40 }}>
            {item.goods.map(items => (
              <img key={items.name} style={{ width: 40, height: 40 }} src={getImgSrc(items.pic)} alt={items.name} />
            ))}
          </div>
        ),
      },
      {
        title: '商品名称',
        key: 'name',
        render: item => (
          <div style={{ width: 40 }}>
            {item.goods.map(items => (
              <div style={{ width: 200 }}>
                <p>{items.name}</p>
                {items.spec.map(_ => (
                  <span>
                    {_.basisName}：{_.basisValue}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ),
      },
      {
        title: '品牌',
        key: 3,
      },
      {
        title: '分类',
        key: 4,
      },
      {
        title: '商品状态',
        key: 5,
      },
      {
        title: '是否映射',
        key: 6,
      },
      {
        title: 'SPU库存总数',
        key: 7,
      },
      {
        title: '吊牌价',
        dataIndex: 'orderNo',
      },
      {
        title: '操作',
        key: 9,
        render: item => (
          <div style={{ width: 60 }}>
            <a onClick={() => router.push(`/alterGoods/alterFliter/detail/${item.orderNo}`)}>添加映射</a>
            <a>商品详情</a>
          </div>
        ),
      },
    ];
    this.renderColumns = list;
  };

  render() {
    const { data, pagination, loading } = this.props;
    return (
      <div>
        <Table loading={loading} pagination={pagination} rowKey="orderNo" columns={this.renderColumns} dataSource={data} />
      </div>
    );
  }
}

export default TableContent;
