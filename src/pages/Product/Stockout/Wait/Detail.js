import React from 'react';
import { autobind } from 'core-decorators';
import OrderForm from '../Common/Detail/OrderForm';

@autobind
class WaitDetail extends React.Component {
  render() {
    const { location } = this.props
    return (
      <OrderForm location={location.query} />
    );
  }
}

export default WaitDetail;