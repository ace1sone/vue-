import React from 'react';
import { connect } from 'dva';
import { Card, Table, Input, Button, Select } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { columns, mapDataToCols } from './table.config';


class List extends React.Component {
  state = {
    brandName: '',
    sellingStatus: '',
    spu: '',
  };

  componentDidMount() {
    this.goToPage(0, 20);
  }

  goToPage = (page, s) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shelve/getShelves',
      payload: {
        size: s,
        current: page,
        pageBar: {
          pageIndex: page,
          pageSize: s,
        },
      },
    });
  };

  search = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shelve/getShelves',
      payload: {
        req: value || '',
        size: 20,
        current: 1,
        pageBar: {
          pageIndex: 1,
          pageSize: 20,
        },
      },
    });
  };

  handleChangeBrandName = e => {
    this.setState({ brandName: e.target.value });
  };

  handleChangeSpu = e => {
    this.setState({ spu: e.target.value });
  };

  handleChangeSellingStatus = v => {
    this.setState({ sellingStatus: v });
  };

  handleSearch = () => {
    const { dispatch } = this.props;
    const { brandName, sellingStatus, spu } = this.state;

    const payload = {
      brandName,
      sellingStatus,
      spu,
      size: 20,
      current: 1,
      pageBar: {
        pageIndex: 0,
        pageSize: 20,
      },
    };

    dispatch({
      type: 'shelve/getShelves',
      payload,
    });
  };

  handleClear = () => {
    this.setState({
      brandName: '',
      sellingStatus: '',
      spu: '',
    });
  };

  renderSimpleForm = () => {
    const { brandName, spu, sellingStatus } = this.state;
    return (
      <div>
        <div style={{ marginTop: 10, marginBottom: 10, display: 'flex' }}>
          <Input
            placeholder="请输入所属品牌"
            style={{ width: '560px', marginRight: '20px' }}
            value={brandName}
            onChange={this.handleChangeBrandName}
          />

          <Input placeholder="请输入SPU名称或 SPU ID" style={{ width: '560px', marginRight: '20px' }} value={spu} onChange={this.handleChangeSpu} />

          <Select
            placeholder="选择商品状态"
            style={{ width: '220px', marginRight: '20px' }}
            value={sellingStatus}
            onChange={this.handleChangeSellingStatus}
          >
            <Select.Option value="">选择商品状态</Select.Option>
            <Select.Option value={1}>售卖中</Select.Option>
            <Select.Option value={2}>已下架</Select.Option>
          </Select>

          <Button onClick={this.handleSearch} type="primary" icon="search" style={{ marginRight: '20px' }}>
            搜索
          </Button>

          <Button onClick={this.handleClear}>清空</Button>
        </div>
      </div>
    );
  };

  render() {
    const { specdata, loading } = this.props;
    const { total = 0, current = 1, size = 20 } = specdata || {};

    return (
      <PageHeaderWrapper title="商品上下架">
        <Card bordered={false}>
          <div>{this.renderSimpleForm()}</div>

          <Table
            pagination={{
              total: total ? parseInt(total, 10) : 0,
              current: current || 1,
              onChange: this.goToPage,
              onShowSizeChange: this.goToPage,
              pageSize: size,
            }}
            rowKey="spuId"
            columns={columns()}
            dataSource={mapDataToCols(specdata.records || [])}
            align="center"
            loading={loading}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = ({ shelve, loading }) => ({
  specdata: shelve.data,
  loading: loading.models.shelve,
});

export default connect(mapStateToProps)(List);
