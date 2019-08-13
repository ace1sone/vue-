import React from 'react';
import { Col, Row, Form } from 'antd';
import _ from 'lodash';
import { PropTypes } from 'prop-types';
import DynamicTextItem from './DynamicTextItem';

@Form.create()
class DynamicText extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    options: PropTypes.object,
    placeholder: PropTypes.string,
    official: PropTypes.bool,
  };

  static defaultProps = {
    label: '',
    options: {},
    placeholder: '',
    official: true,
  };

  cacheOriginData = {};

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

    const { form, label, options, placeholder, official, allItems, type } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row>
        <Col span={3}>
          <Form.Item wrapperCol={{ span: 24 }}>
            <span style={{ color: '#f5222d', fontFamily: 'SimSun, sans-serif' }}>{options.required ? '*' : ''}</span> {label}
          </Form.Item>
        </Col>
        <Col span={18}>
          {list.map((ele, i) => (
            <div key={ele.id || i}>
              {getFieldDecorator(`items[${i}]`, {
                initialValue: ele || {},
                ...options,
              })(
                <DynamicTextItem
                  key={ele.id || i}
                  val={ele}
                  index={i}
                  label={label}
                  placeholder={placeholder}
                  options={options}
                  official={official}
                  allItems={allItems}
                  type={type}
                />
              )}
            </div>
          ))}
        </Col>
        <Col span={3} />
      </Row>
    );
  }
}

export default DynamicText;
