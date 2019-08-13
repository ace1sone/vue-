
import React from 'react';
import { autobind } from 'core-decorators';
import List from '../Common/List/List'

@autobind
class CompletedList extends React.Component {

  state = {
    title: '已出库'
  }

  render() {
    const { title } = this.state;
    return (
      <List title={title} />
    );
  }
}

export default CompletedList;
