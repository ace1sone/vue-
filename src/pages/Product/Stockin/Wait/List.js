import React from 'react';
import { autobind } from 'core-decorators';
import List from '../Common/List/List'

@autobind
class WaitList extends React.Component {

  state = {
    title: '待审批'
  }

  render() {
    const { title } = this.state;
    return (
      <List title={title} />
    );
  }
}

export default WaitList;
