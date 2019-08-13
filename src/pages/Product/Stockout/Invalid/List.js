import React from 'react';
import { autobind } from 'core-decorators';
import List from '../Common/List/List'

@autobind
class InvalidList extends React.Component {

  state = {
    title: '已作废'
  }

  render() {
    const { title } = this.state;
    return (
      <List title={title} />
    );
  }
}

export default InvalidList;
