import React from 'react';
import { Form, Button, Icon } from 'antd';
import { PropTypes } from 'prop-types';
import { getGuid } from '@/utils/utils';
import EvenlySplitRow from '@/components/EvenlySplitRow';

class DynamicField extends React.Component {
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
    const newKey = getGuid();
    const nextKeys = keys.concat(newKey);
    form.getFieldDecorator(`${newKey}`, { initialValue: '' });
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  renderDeleteButton = key => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length < 2) {
      return null;
    }
    return <Icon type="minus-circle" onClick={() => this.handleDelete(key)} style={{ marginLeft: 8, cursor: 'pointer', fontSize: 18 }} />;
  };

  renderField = ({ key, label, options, children, showLabel }) => {
    const { form } = this.props;
    return (
      <Form.Item label={showLabel ? label : ' '} key={key}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {form.getFieldDecorator(`${key}`, {
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
        {keys.map((key, i) => {
          const showLabel = i === 0;
          if (wrapper) {
            return React.cloneElement(wrapper, { key }, this.renderField({ key, label, options, children, showLabel }));
          }
          return this.renderField({ key, label, children, showLabel });
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
  // onChange: () => {},
  // value: [],
};

DynamicField.propTypes = {
  // value: PropTypes.array.isRequired,
  // onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

const onValuesChange = (props, changedValues, allValues) => {
  const { onChange } = props;
  const { keys } = allValues;
  onChange(
    keys.map(key => ({
      id: key,
      fildValue: allValues[key],
    }))
  );
};

const mapPropsToFields = props => {
  const { value } = props;
  const keys = [];
  const fields = {};
  value.forEach(item => {
    const k = item.id || getGuid();
    keys.push(k);
    fields[k] = Form.createFormField({ value: item.fildValue });
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
