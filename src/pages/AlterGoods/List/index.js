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
    };
  }

  componentWillMount = () => {
    this.getLocationName();
    this.getPageTitle();
    this.loadList();
  };

  componentWillReceiveProps = nextProps => {
    const { location } = this.props;
    if (location.pathname !== nextProps.location.pathname) {
      this.getLocationName(nextProps.location);
      this.getPageTitle();
    }
  };

  loadList = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'orderData/getOrder',
      payload: {
        current: 1,
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

  render() {
    const { orderData } = this.props;

    const { titletext } = this.state;
    return (
      <PageHeaderWrapper title={titletext}>
        <Card>
          <TableHeader />
          <TableContent data={orderData.records} />
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
