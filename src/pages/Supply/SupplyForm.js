import { rcValidator } from '@/shared/utility';

import BaseForm from '@/utils/BaseForm';

export default class SupplyForm extends BaseForm {

  static options = {
    name: 'supplyForm'
  };

  constructor(form, supply = {}) {
    super();
    this.form = form;
    this.supplierName = ['supplierName', {
      initialValue: supply.supplierName,
      rules: [
        { required: true, whitespace: false, message: '请输入供应商名称' }
      ],
    }];
    this.contactPerson = ['contactPerson', {
      initialValue: supply.contactPerson,
      rules: [
        { required: true, whitespace: false, message: '请输入联系人' }
      ],
    }];
    this.mobileNo = ['mobileNo', {
      initialValue: supply.mobileNo,
      rules: [
        { required: true, whitespace: false, message: '请输入手机号码' },
        { validator: rcValidator('mobile', '请输入正确的手机号码') }
      ],
    }];
    this.companyPhoneNo = ['companyPhoneNo', {
      initialValue: supply.companyPhoneNo,
      rules: [
        { required: true, whitespace: false, message: '请输入公司电话' }
      ],
    }];
    this.address = ['address', {
      initialValue: supply.address,
      rules: [
        { required: true, whitespace: false, message: '请输入地址' }
      ],
    }];
    this.detailedAddress = ['detailedAddress', {
      initialValue: supply.detailedAddress,
      rules: [
        { required: true, whitespace: false, message: '请输入详细地址' }
      ],
    }];
  }

}