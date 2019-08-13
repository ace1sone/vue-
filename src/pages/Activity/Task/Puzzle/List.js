import React from 'react';
import { autobind } from 'core-decorators';
import List from '../Common/List/List';

@autobind
class PuzzleList extends React.Component {
  state = {
    title: '寻找真相',
  };

  render() {
    const { title } = this.state;
    return <List title={title} type="puzzle" />;
  }
}

export default PuzzleList;
