import React from 'react';
import { Input, Select } from 'antd';
import { Button } from 'antd/lib/radio';

const { Option } = Select;

class TableHeader extends React.Component {
  state = {};

  render() {
    return (
      <div>
        <div style={{ marginTop: 12, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Input style={{ width: 200, marginRight: 24 }} placeholder="请输入商品名称" />
            <Input style={{ width: 200, marginRight: 24 }} placeholder="请输入品牌名称" />
            <Input style={{ width: 200, marginRight: 96 }} placeholder="请输入分类名称" />
            <span style={{ fontWeight: 700 }}>吊牌价：</span>
            <Input style={{ width: 144 }} placeholder="请输入价格" />
            <span> ~ </span>
            <Input style={{ width: 144 }} placeholder="请输入价格" />
          </div>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontWeight: 700 }}>是否映射：</span>
              <Select style={{ width: 144 }} defaultValue="全部" onChange={this.orderType}>
                <Option value="全部">全部</Option>
                <Option value="是">是</Option>
                <Option value="否">否</Option>
              </Select>
            </div>
            <div>
              <Button style={{ marginRight: 24, background: 'black', color: 'white', borderRadius: 5 }}>搜索</Button>

              <Button style={{ marginRight: 24, borderRadius: 6 }}>清空</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TableHeader;
