import React from 'react';
import { autobind } from 'core-decorators';
import List from '../Common/List/List';

@autobind
class RandomDramList extends React.Component {
  state = {
    title: '抽签任务',
  };

  render() {
    const { title } = this.state;
    return <List title={title} type="randomdraw" />;
  }
}

export default RandomDramList;
