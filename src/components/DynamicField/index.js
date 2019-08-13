import React from 'react';
import { Form, Button, Icon } from 'antd';
import { PropTypes } from 'prop-types';

import EvenlySplitRow from '@/components/EvenlySplitRow';

class DynamicField extends React.Component {
  onChange = (fieldValue, i) => {
    const { value } = this.props;
    const nextValue = value.slice(0);
    nextValue[i] = fieldValue;
    this.setValue(nextValue);
  };

  handleDelete = k => {
    const { form, disabled } = this.props;
    const keys = form.getFieldValue('keys');
    if (disabled) return;
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  handleAdd = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const newKey = keys.length;
    const nextKeys = keys.concat(newKey);
    form.getFieldDecorator(`field[${newKey}]`, { initialValue: '' });
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  setValue = nextValue => {
    const { onChange } = this.props;
    onChange(nextValue);
  };

  renderDeleteButton = key => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length < 2) {
      return null;
    }
    return <Icon type="minus-circle" onClick={() => this.handleDelete(key)} style={{ marginLeft: 8, cursor: 'pointer', fontSize: 18 }} />;
  };

  renderField = ({ key, label, options, children }) => {
    const { form } = this.props;
    return (
      <Form.Item label={!key ? label : ' '} key={key}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {form.getFieldDecorator(`field[${key}]`, {
            initialValue: '',
            ...options,
          })(children)}
          {this.renderDeleteButton(key)}
        </div>
      </Form.Item>
    );
  };

  render() {
    const { label, form, children, wrapper, options, disabled } = this.props;
    const { getFieldDecorator } = form;
    // important! initialize 'keys' to solve warning
    // 'cannot set value to a field before rendering it'
    getFieldDecorator('keys', { initialValue: [] });
    const keys = form.getFieldValue('keys');
    return (
      <div>
        {keys.map(key => {
          if (wrapper) {
            return React.cloneElement(wrapper, { key }, this.renderField({ key, label, options, children }));
          }
          return this.renderField(key, label, children);
        })}
        <EvenlySplitRow>
          <Form.Item label=" " colon={false}>
            <Button type="dashed" icon="plus" onClick={this.handleAdd} disabled={disabled}>
              新增
            </Button>
          </Form.Item>
        </EvenlySplitRow>
      </div>
    );
  }
}

DynamicField.defaultProps = {
  label: '',
};

DynamicField.propTypes = {
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

const onValuesChange = (props, changedValues, allValues) => {
  const { onChange } = props;
  const { field, keys } = allValues;
  onChange(keys.map(key => field[key]));
};

const mapPropsToFields = props => {
  const { value } = props;
  const keys = [];
  const fields = {};
  value.forEach((fieldValue, i) => {
    keys.push(i);
    fields[`field[${i}]`] = Form.createFormField({ value: fieldValue });
  });
  return {
    keys: Form.createFormField({ value: keys }),
    ...fields,
  };
};

export default Form.create({
  onValuesChange,
  mapPropsToFields,
})(DynamicField);
