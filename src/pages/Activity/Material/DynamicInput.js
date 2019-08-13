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
    mode: PropTypes.string,
    isNeedValidate: PropTypes.bool,
  };

  static defaultProps = {
    label: '',
    options: {},
    placeholder: '',
    mode: 'edit',
    isNeedValidate: false,
  };

  cacheOriginData = {};

  childForm = null;

  state = {
    list: [{}],
  };

  constructor(props) {
    super(props);
    const { value } = props;
    if (props.value) {
      this.state = {
        list: value,
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

    if (list && list.length >= 5) return;

    const newList = _.cloneDeep(list);
    newList.push({ isAdd: true, ...basic });
    this.setState({
      list: newList,
    });
    onChange(newList);
  };

  validateChildForm() {
    const {
      childForm,
      props: { isNeedValidate },
    } = this;

    if (childForm && isNeedValidate) return childForm.validateForm();
    return false;
  }

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
    const { list } = this.state;
    const newlist = _.cloneDeep(list);

    if (data && i >= 0) {
      newlist[i] = data;
      this.setState({ list: newlist });
      const { onChange } = this.props;
      onChange(newlist);
    }
  }

  render() {
    const { list } = this.state;

    const { form, label, options, placeholder, placeholder2, mode, activityId, materialId } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row>
        {list.map((ele, i) => (
          <div key={ele.id || i}>
            <Col span={3}>
              <Form.Item wrapperCol={{ span: 24 }}>
                <span style={{ color: '#f5222d', fontFamily: 'SimSun, sans-serif' }}>{options.required ? '*' : ''}</span> {label}
                {i + 1}
              </Form.Item>
            </Col>
            <Col span={21}>
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
                    activityId={activityId}
                    materialId={materialId}
                    placeholder={placeholder}
                    placeholder2={placeholder2}
                    options={options}
                    onChange={(data, idx) => this.handleChange(data, idx)}
                    onDelete={idx => this.handleDelete(idx)}
                    wrappedComponentRef={childForm => {
                      this.childForm = childForm;
                    }}
                    mode={mode}
                  />
                )}
              </div>
            </Col>
          </div>
        ))}

        <Col span={3} offset={3}>
          {mode !== 'view' && (
            <Button style={{ width: '100%' }} onClick={this.addInputItem} disabled={list.length >= 5}>
              新增
            </Button>
          )}
        </Col>
      </Row>
    );
  }
}

export default DynamicInput;
