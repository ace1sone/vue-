
import React from 'react';
import { autobind } from 'core-decorators';
import List from '../Common/List/List'

@autobind
class AllOrders extends React.Component {
  state = {
    title: '全部入库单'
  }

  render() {
    const { title } = this.state;
    return (
      <List title={title} addOrders />
    );
  }
}

export default AllOrders;
