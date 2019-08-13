import React, {Component} from 'react';
import { Form, Icon, Input, Button } from 'antd';

import RegisterForm from './RegisterForm';

import styles from './Register.less';

class RegisterPage extends Component {

  form = new RegisterForm(this.props.form);

  handleSubmit = async (e) => {
    e.preventDefault();
    let values = await this.form.validate();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className={styles.registerPage}>
        <Form.Item>
          {getFieldDecorator(...this.form.mail)(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入邮箱" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator(...this.form.mobile)(
            <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入手机号" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator(...this.form.password)(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}  type="password" placeholder="请输入密码" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator(...this.form.confirm)(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}  type="password" placeholder="请确认密码" />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.submitButton}>注册</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create(RegisterForm.options)(RegisterPage);

