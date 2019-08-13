import { rcValidator } from '@/shared/utility';

import BaseForm from '@/utils/BaseForm';

export default class RegisterForm extends BaseForm {

  static options = {
    name: 'registerForm'
  };

  constructor(form) {
    super();
    this.form = form;
    this.mail = ['mail', {
      rules: [
        { required: true, whitespace: false, message: '请输入邮箱地址' },
        { type: 'email', message: '邮箱地址格式错误' }
      ],
    }];
    this.mobile = ['mobile', {
      rules: [
        { required: true, whitespace: false, message: '请输入手机号' },
        { validator: rcValidator('mobile', '请输入正确的手机号') }
      ],
    }];
    this.password = ['password', {
      rules: [
        { required: true, whitespace: false, message: '请输入密码' },
        {
          validator: (rule, value, callback) => {
            if (form.isFieldTouched('confirm')) {
              form.validateFields(['confirm'], { force: true });
            }
            callback();
          }
        }
      ]
    }];
    this.confirm = ['confirm', {
      rules: [
        { required: true, whitespace: false, message: '请确认密码', },
        {
          validator: (rule, value, callback) => {
            if (value && value !== this.form.getFieldValue('password')) {
              return callback('密码不匹配');
            }
            callback();
          }
        }
      ],
    }];
  }

}