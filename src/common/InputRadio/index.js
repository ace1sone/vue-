import React from 'react';
import { Input, Form, Radio } from 'antd';
import EvenlySplitRow from '@/components/EvenlySplitRow';
// import _ from 'lodash';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

function InputRadio({
  onChange = () => {},
  form,
  inputLabel,
  inputKey = 'name',
  inputFormOptions,
  radioLabel = '是否为官方名称',
  radioKey = 'isoffical',
  radioFormOptions,
  radioOptions = [{ label: '是', value: 1 }, { label: '否', value: 0 }],
  value,
  defaultValue,
  disabled,
}) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  function triggerChange(v) {
    onChange(v);
  }
  const initialValue = value || defaultValue;

  function onInputChange() {
    validateFieldsAndScroll((err, values) => {
      if (err) return;
      triggerChange(values);
    });
  }

  function onRadioChange() {
    validateFieldsAndScroll((err, values) => {
      if (err) return;
      triggerChange(values);
    });
  }

  return (
    <EvenlySplitRow>
      <FormItem label={inputLabel}>
        {getFieldDecorator(inputKey, {
          ...inputFormOptions,
          initialValue: initialValue ? initialValue[inputKey] : undefined,
        })(<Input onChange={onInputChange} disabled={disabled} />)}
      </FormItem>
      {initialValue && initialValue[inputKey] && (
        <FormItem label={radioLabel}>
          {getFieldDecorator(radioKey, {
            ...radioFormOptions,
            initialValue: initialValue ? initialValue[radioKey] : undefined,
          })(<RadioGroup options={radioOptions} onChange={onRadioChange} disabled={disabled} />)}
        </FormItem>
      )}
    </EvenlySplitRow>
  );
}

export default Form.create()(InputRadio);
