import React from 'react';
import { Table } from 'antd';
import { getImgSrc } from '@/utils/utils';

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
        key: 8,
      },
      {
        title: '操作',
        key: 9,
        render: () => (
          <div style={{ width: 60 }}>
            <a>添加映射</a>
            <a>商品详情</a>
          </div>
        ),
      },
    ];
    this.renderColumns = list;
  };

  render() {
    const { data } = this.props;
    return (
      <div>
        <Table rowKey="orderNo" columns={this.renderColumns} dataSource={data} />
      </div>
    );
  }
}

export default TableContent;
