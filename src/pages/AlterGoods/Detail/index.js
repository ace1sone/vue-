import React from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card } from 'antd';
// import { connect } from 'dva';

class DetailPage extends React.Component {
  constructor() {
    super();
    this.goodsRoute = '';
    this.state = {};
  }

  render() {
    return (
      <PageHeaderWrapper title="添加映射">
        <Card>11111</Card>
      </PageHeaderWrapper>
    );
  }
}

// const mapStateToProps = ({ orderData, loading }) => ({
// //   orderData,
// //   loading: loading.models.orderData,
// });

export default DetailPage;
