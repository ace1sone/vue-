import React from 'react';
import { autobind } from 'core-decorators';
import List from '../Common/List/List';

@autobind
class All extends React.Component {
  state = {
    title: '已结束',
  };

  render() {
    const { title } = this.state;
    return <List title={title} />;
  }
}

export default All;
