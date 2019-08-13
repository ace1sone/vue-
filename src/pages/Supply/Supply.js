import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { connect } from 'dva';
import qs from 'query-string';

import { inject } from '@/config';

import SupplyForm from './SupplyForm';
import styles from './Supply.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

@connect()
class SupplyPage extends Component {

  utilService = inject('utilService');
  eventService = inject('eventService');

  state = {
    form: undefined
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    let id = qs.parse(this.props.location.search).id;
    if (!id) {
      return this.setState({
        form: new SupplyForm(this.props.form)
      });
    };
    this.isEditing = true;
    let result = await this.props.dispatch({ type: 'supply/load', payload: { id } });
    this.supply = result.message;
    this.setState({
      form: new SupplyForm(this.props.form, this.supply)
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    let values = await this.state.form.validate();
    if (this.isEditing) {
      await this.props.dispatch({ type: 'supply/update', payload: { supply: { guid: this.supply.guid, ...values } } });
    } else {
      await this.props.dispatch({ type: 'supply/create', payload: { supply: values } });
      this.eventService.emit('supply-created', values);
    }
    this.utilService.goBack();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let { form } = this.state;
    if (!form) return null;
    return (
      <Form onSubmit={this.handleSubmit} className={styles.supplyPage}>
        <Form.Item {...formItemLayout} label='供应商名称'>
          {getFieldDecorator(...form.supplierName)(
            <Input placeholder="请输入供应商名称" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label='联系人'>
          {getFieldDecorator(...form.contactPerson)(
            <Input placeholder="请输入联系人" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label='手机号码'>
          {getFieldDecorator(...form.mobileNo)(
            <Input placeholder="请输入手机号码" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label='公司电话'>
          {getFieldDecorator(...form.companyPhoneNo)(
            <Input placeholder="请输入公司电话" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label='公司地址'>
          {getFieldDecorator(...form.address)(
            <Input placeholder="请输入公司地址" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label='详细地址'>
          {getFieldDecorator(...form.detailedAddress)(
            <Input placeholder="请输入详细地址" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label='微信'>
          <Input placeholder="请输入微信" />
        </Form.Item>
        <Form.Item {...formItemLayout} label='QQ'>
          <Input placeholder="请输入QQ" />
        </Form.Item>
        <Form.Item {...formItemLayout} label='Email'>
          <Input placeholder="请输入Email" />
        </Form.Item>
        <Form.Item {...formItemLayout} label='传真'>
          <Input placeholder="请输入传真" />
        </Form.Item>
        <Form.Item {...formItemLayout} label='备注'>
          <Input placeholder="请输入备注" />
        </Form.Item>
        <Form.Item {...formItemLayout} label=' ' colon={false} className={styles.operations}>
          <Button onClick={() => this.utilService.goBack()}>取消</Button>
          <Button type="primary" htmlType="submit">保存</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create(SupplyForm.options)(SupplyPage);

