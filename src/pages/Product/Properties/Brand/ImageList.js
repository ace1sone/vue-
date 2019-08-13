import React from 'react';
import { Form } from 'antd';
import _ from 'lodash';

@Form.create()
class ImageList extends React.Component {
  state = {
    list: [{}],
  };

  constructor(props) {
    super(props);
    if (props.value) {
      this.state = {
        list: props.value,
      };
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { value } = props;
    const { list } = state;
    if (!_.isEqual(value, list)) {
      return {
        list: value,
      };
    }
    return null;
  }

  render() {
    const { list } = this.state;

    return (
      <div>
        {list.map((ele, i) => (
          <img key={ele.id || i} src={ele.url} alt="" style={{ width: 104, height: 104 }} />
        ))}
      </div>
    );
  }
}

export default ImageList;
