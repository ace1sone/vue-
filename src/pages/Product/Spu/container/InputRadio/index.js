import React, { PureComponent } from 'react';
import { Input, Form, Radio } from 'antd';
import EvenlySplitRow from '@/components/EvenlySplitRow';
// import _ from 'lodash';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class InputRadio extends PureComponent {
  static defaultProps = {
    radioOptions: [{ label: '是', value: 0 }, { label: '否', value: 1 }],
    radioLabel: '是否为官方名称',
    onChange: () => {},
  };

  state = {
    inputValue: undefined,
    radioValue: undefined,
  };

  static getDerivedStateFromProps(props) {
    const { value } = props;
    if (value) {
      const { name, isChecked } = value;
      return {
        inputValue: name,
        radioValue: isChecked === undefined ? undefined : isChecked,
      };
    }
    return null;
  }

  onInputChange = e => {
    const inputValue = e.target.value;
    const { radioValue } = this.state;
    const { onChange } = this.props;
    this.setState({
      inputValue,
    });
    onChange({
      name: inputValue,
      isChecked: radioValue,
    });
  };

  onRadioChange = e => {
    const { inputValue } = this.state;
    const { onChange } = this.props;
    const radioValue = e.target.value;
    this.setState({
      radioValue,
    });
    onChange({
      name: inputValue,
      isChecked: radioValue,
    });
  };

  render() {
    const { disabled, radioOptions, inputLabel, radioLabel } = this.props;
    const { inputValue, radioValue } = this.state;
    const validateStatus = radioValue === undefined ? 'error' : 'success';
    const help = radioValue === undefined ? '必选' : '';
    return (
      <EvenlySplitRow>
        <FormItem label={inputLabel}>
          <Input onChange={this.onInputChange} disabled={disabled} value={inputValue} />
        </FormItem>
        {inputValue && (
          <FormItem required label={radioLabel} validateStatus={validateStatus} help={help}>
            <RadioGroup options={radioOptions} onChange={this.onRadioChange} disabled={disabled} value={radioValue} />
          </FormItem>
        )}
      </EvenlySplitRow>
    );
  }
}
export default InputRadio;
