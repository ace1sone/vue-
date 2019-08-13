import React from 'react';
import { autobind } from 'core-decorators';
import ActivityForm from '../Common/Detail/ActivityForm';

@autobind
class Detail extends React.Component {
  render() {
    const { location } = this.props;
    return <ActivityForm location={location.query} />;
  }
}

export default Detail;
