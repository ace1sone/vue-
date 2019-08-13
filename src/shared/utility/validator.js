import Validator from 'validatorjs';
import _ from 'lodash';
import moment from 'moment';
import Utils from './Utils';

import lang from 'validatorjs/src/lang';
import messages from 'validatorjs/src/lang/zh';
lang._set('en', messages);
lang._set('zh', messages);

Validator.useLang('zh');

const ID_CARD_REGEXP_15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
const ID_CARD_REGEXP_18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[X0-9]{1}$/i;
/*
  手机号码正则表达式：
  时间截止为：2018年1月11日
  移动号段：134 135 136 137 138 139 147 148 150 151 152 157 158 159 172 178 182 183 184 187 188 198
  联通号段：130 131 132 145 146 155 156 166 171 175 176 185 186
  电信号段：133 149 153 173 174 177 180 181 189 199
  虚拟运营商：170
 */
const MOBILE_REGEXP = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
const LICENSE_NUMBER_REGEXP = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[-]?[A-Z_0-9]{5}$/i;
const VERIFY_CODE_REGEXP = /^[0-9]{4}$/;
const USERNAME_REGEXP = /^[A-Z][A-Z0-9]{3,19}$/i;
const PASSWORD_REGEXP = /^[A-Z0-9]{6,20}$/i;
const NAME_REGEXP = /^[\u4e00-\u9fa5]{2,20}/;
const POSTAL_REGEXP = /^\d{6}$/;
const EXPRESS_REGEXP = /^\w{10,}$/;
const CURRENCY_REGEXP = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;   // 小数和逗号可选

Validator.register('requiredNumber', function (value, requirement /* defaults to null */, attribute) {
  return value > 0;
}, '请输入正确的:attribute.');

Validator.register('json', function (value, requirement /* defaults to null */, attribute) {
  return Validators.isJson(value);
}, ':attribute不是正确的JSON格式.');

Validator.register('requiredBool', function (value, requirement /* defaults to null */, attribute) {
  return !!value;
}, '必须选中:attribute.');

Validator.register('notEmpty', function (value, requirement /* defaults to null */, attribute) {
  return Validators.notEmpty(value);
}, ':attribute不能为空.');

Validator.register('mobile', function (value, requirement /* defaults to null */, attribute) {
  return Validators.isMobile(value);
}, ':attribute格式不正确.');

Validator.register('password', function (value, requirement, attribute) {
  return Validators.isPassword(value);
}, ':attribute格式不正确.');

Validator.register('verifyCode', function (value, requirement, attribute) {
  return Validators.isVerifyCode(value);
}, ':attribute是4位数字.');

Validator.register('licenseNumber', function (value, requirement, attribute) {
  return Validators.isLicenseNumber(value);
}, '请输入正确格式的:attribute，如：沪A98981.');

Validator.register('idCard', function (value, requirement, attribute) {
  return Validators.isExpressId(value);
}, '请输入正确格式的:attribute.');

Validator.register('expressId', function (value, requirement, attribute) {
  return Validators.isExpressId(value);
}, '请输入正确格式的:attribute.');

Validator.register('isDate', function (value, requirement, attribute) {
  return Validators.isDate(value);
}, '请输入正确格式的:attribute.');

Validator.register('currency', function (value, requirement, attribute) {
  return Validators.isCurrency(value);
}, '请输入正确格式的:attribute.');

Validator.register('afterNow', function (value, requirement, attribute) {
  return Validators.afterNow(value);
}, ':attribute不能早于现在.');

Validator.register('afterToday', function (value, requirement, attribute) {
  return Validators.afterToday(value);
}, ':attribute不能早于今日.');

Validator.register('uniqueArray', function (value, requirement, attribute) {
  return Validators.isUniqueArray(value);
}, ':attribute不能有重复数据.');

Validator.register('numberMin', function (value, requirement /* defaults to null */, attribute) {
  return parseFloat(value) >= parseFloat(requirement);
}, ':attribute不能小于:numberMin.');

Validator.register('numberMax', function (value, requirement /* defaults to null */, attribute) {
  return parseFloat(value) <= parseFloat(requirement);
}, ':attribute不能大于:numberMax.');

export class Validators {

  static notEmpty(value) {
    return !_.isEmpty(value);
  }

  static isDate(date) {
    return moment(date, 'YYYY/MM/DD').isValid();
  }

  static isJson(val) {
    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }

  static isIdCard(id) {
    return (ID_CARD_REGEXP_15.test(id) || ID_CARD_REGEXP_18.test(id));
  }

  static isMobile(mobile) {
    return MOBILE_REGEXP.test(mobile);
  }

  static isLicenseNumber(license) {
    return LICENSE_NUMBER_REGEXP.test(license);
  }

  static isVerifyCode(code) {
    return VERIFY_CODE_REGEXP.test(code);
  }

  static isUsername(username) {
    return USERNAME_REGEXP.test(username);
  }

  static isPassword(passwd) {
    return PASSWORD_REGEXP.test(passwd);
  }

  static isName(name) {
    return NAME_REGEXP.test(name);
  }

  static isPostal(postal) {
    return POSTAL_REGEXP.test(postal);
  }

  static isExpressId(expressId) {
    return EXPRESS_REGEXP.test(expressId);
  }

  static isCurrency(currency) {
    return CURRENCY_REGEXP.test(currency);
  }

  static afterNow(date) {
    return moment(date).isSameOrAfter(Date.now(), 'day');
  }

  static afterToday(date) {
    return moment(date).isAfter(Date.now(), 'day');
  }

  static afterDate(prevDate, nextDate) {
    if (!prevDate) return false;
    if (!moment.isMoment(prevDate)) prevDate = moment(prevDate);
    return prevDate.isAfter(nextDate);
  }

  static isUniqueArray(arr) {
    if (!arr) return false;
    if (!arr.length) return false;
    return _.uniq(arr).length === arr.length;
  }

}

function validate(label, value, rules, errMsg) {
  const validation = new Validator({ [label]: value }, { [label]: rules }, errMsg);
  validation.passes();
  const error = validation.errors.first(label);
  return error === '' ? false : error;
};

export function validateAll(data, rules, attrNames, errMsg) {
  const validation = new Validator(data, rules, errMsg);
  if (attrNames) validation.setAttributeNames(attrNames);
  if (validation.passes()) return null;
  validation.errors.firstMessage = Utils.first(validation.errors.errors)[0];
  return validation.errors;
}

export function rcValidator(rules, errMsg) {
  return (_, data, callback) => {
    const validation = new Validator({ test: data }, { test: rules });
    if (validation.passes()) return callback();
    callback(errMsg);
  }
}

export default validate;
