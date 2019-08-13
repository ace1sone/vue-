import React from 'react';
import { autobind } from 'core-decorators';
import List from '../Common/List/List'

@autobind
class RejectList extends React.Component {

  state = {
    title: '已驳回'
  }

  render() {
    const { title } = this.state;
    return (
      <List title={title} />
    );
  }
}

export default RejectList;
