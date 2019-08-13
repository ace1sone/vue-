import React from 'react';
import { autobind } from 'core-decorators';
import List from '../Common/List/List';

@autobind
class InvitedList extends React.Component {
  state = {
    title: '拉新任务',
  };

  render() {
    const { title } = this.state;
    return <List title={title} type="invited" />;
  }
}

export default InvitedList;
