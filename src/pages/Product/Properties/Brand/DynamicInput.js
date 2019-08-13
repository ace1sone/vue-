import React from 'react';
import { Col, Row, Form, Button } from 'antd';
import _ from 'lodash';
import { PropTypes } from 'prop-types';
import DynamicItem from './DynamicItem';

@Form.create()
class DynamicInput extends React.Component {
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

  addInputItem = () => {
    const { basic, onChange } = this.props;
    const { list } = this.state;
    const newList = _.cloneDeep(list);
    newList.push({ isOfficial: 0, isDefault: 1, createdBy: 1, updatedBy: 1, isAdd: true, ...basic });
    this.setState({
      list: newList,
    });
    onChange(newList);
  };

  handleDelete(i) {
    const { list } = this.state;
    let newlist;
    if (i > 0) {
      if (list[i].id > 0 && !list[i].isAdd) {
        list[i].delFlag = 1;
        newlist = list;
      } else {
        newlist = list.filter((item, idx) => idx !== i);
      }
      this.setState({ list: newlist });

      const { onChange } = this.props;
      onChange(newlist);
    }
  }

  handleChange(data, i) {
    const { basic } = this.props;
    const { list } = this.state;
    const newlist = _.cloneDeep(list);

    if (data && i >= 0) {
      if (data.isEnglish === 0) {
        data.isModifyName = true;
      }
      newlist[i] = { ...data, ...basic };
      this.setState({ list: newlist });
      const { onChange } = this.props;
      onChange(newlist);
    }
  }

  render() {
    const { list } = this.state;

    const { form, label, options, placeholder, official, allItems, type } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row>
        <Col span={3}>
          <Form.Item wrapperCol={{ span: 24 }}>
            <span style={{ color: '#f5222d',fontFamily: 'SimSun, sans-serif' }}>{options.required ? '*' : ''}</span> {label}
          </Form.Item>
        </Col>
        <Col span={18}>
          {list.map((ele, i) => (
            <div key={ele.id || i}>
              {getFieldDecorator(`items[${i}]`, {
                initialValue: ele || {},
                ...options,
              })(
                <DynamicItem
                  key={ele.id || i}
                  val={ele}
                  index={i}
                  label={label}
                  placeholder={placeholder}
                  options={options}
                  official={official}
                  allItems={allItems}
                  type={type}
                  onChange={(data, idx) => this.handleChange(data, idx)}
                  onDelete={idx => this.handleDelete(idx)}
                />
              )}
            </div>
          ))}
        </Col>
        <Col span={3}>
          <Button onClick={this.addInputItem}>新增</Button>
        </Col>
      </Row>
    );
  }
}

export default DynamicInput;
