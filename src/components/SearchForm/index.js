import React from 'react';
import { Form, Select, Input, Button, Row, Col } from 'antd';
import { FormattedMessage } from 'umi/locale';

class SearchForm extends React.Component {
  static Field = Form.Item;

  handleSubmit = e => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    form.validateFields((err, fields) => {
      onSubmit(fields);
    });
  };

  createField = props => {
    if (props.type === 'input') {
      return (
        <Input
          key={props.name}
          name={props.name}
          placeholder={props.placeholder}
          style={{ width: 200 }}
        />
      );
    }
    if (props.type === 'select') {
      const filterOption = (input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

      return (
        <Select
          key={props.name}
          showSearch
          style={{ width: 200 }}
          placeholder={props.placeholder}
          filterOption={filterOption}
          loading={props.loading}
        >
          {props.dataSource.map(option => (
            <Select.Option key={option.id}>{option.name}</Select.Option>
          ))}
        </Select>
      );
    }
    throw new Error('<SearchForm.Field /> only supports "input" and "select" type!');
  };

  render() {
    const { form, children } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Row>
          {React.Children.map(children, child => {
            const { name } = child.props;
            const field = getFieldDecorator(name)(this.createField(child.props));
            return (
              <Col xl={7} xs={24} md={12}>
                {React.cloneElement(child, null, [field])}
              </Col>
            );
          })}
          <Col span={3}>
            <Form.Item>
              <Button type="primary" icon="search" htmlType="submit">
                <FormattedMessage id="form.search" />
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create('filterUser')(SearchForm);
