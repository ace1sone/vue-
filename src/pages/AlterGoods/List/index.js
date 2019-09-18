import React from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card } from 'antd';
import { connect } from 'dva';
import TableHeader from './TableHeader';
import TableContent from './TableContent';

class List extends React.Component {
  constructor() {
    super();
    this.goodsRoute = '';
    this.state = {
      titletext: '',
      current: 1,
      name: '',
    };
  }

  componentWillMount = () => {
    this.getLocationName();
    this.getPageTitle();
    this.loadList(1);
  };

  componentWillReceiveProps = nextProps => {
    const { location } = this.props;
    if (location.pathname !== nextProps.location.pathname) {
      this.getLocationName(nextProps.location);
      this.getPageTitle();
    }
  };

  loadList = async page => {
    const { dispatch } = this.props;
    this.setState({ current: page });
    await dispatch({
      type: 'orderData/getOrder',
      payload: {
        current: page,
        size: 10,
      },
    });
  };

  getLocationName = l => {
    const { location } = this.props;
    const newName = location || l;
    const locationName = newName.pathname.split('/').pop();
    this.goodsRoute = locationName;
  };

  getPageTitle = () => {
    let text = '';
    switch (this.goodsRoute) {
      case 'alterFliter':
        text = '商品筛选';
        break;
      case 'alterMap':
        text = '商品映射';
        break;
      default:
        text = '';
        break;
    }
    this.setState({ titletext: text });
  };

  goSearch = () => {
    const { dispatch } = this.props;
    const { name } = this.state;
    console.log(name);
    if (name === '') {
      dispatch({
        type: 'orderData/getOrder',
        payload: {
          current: 1,
          size: 10,
        },
      });
    } else {
      dispatch({
        type: 'orderData/getOrder',
        payload: {
          current: 1,
          size: 10,
          name,
        },
      });
    }
  };

  getInputValue = (value, text) => {
    switch (text) {
      case 'name':
        this.state.name = value;
        break;
      default:
        break;
    }
    console.log(111111, value, text);
  };

  render() {
    const { orderData, loading } = this.props;
    const { total } = orderData;
    const { titletext, current } = this.state;
    const pagination = {
      onChange: this.loadList,
      current,
      total,
    };
    return (
      <PageHeaderWrapper title={titletext}>
        <Card>
          <TableHeader getInputValue={this.getInputValue} search={this.goSearch} />
          <TableContent loading={loading} pagination={pagination} data={orderData.records} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = ({ orderData, loading }) => ({
  orderData,
  loading: loading.models.orderData,
});

export default connect(mapStateToProps)(List);
