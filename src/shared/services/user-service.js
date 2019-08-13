/* eslint-disable */
import _ from 'lodash';
import { Config } from '@/config';

import BaseService from './base-service';

export default class UserService extends BaseService {
  constructor(storeService) {
    super(storeService);
  }

  async login(user) {
    const resp = await this._post(`/ipo-bapigateway/common/v1/user/login.json`, user);
    const result = resp.data;
    result.token = resp.headers['x-auth-token'];
    this._setToken(result.token);
    this.storeService.storeItem('user', { username: user.name });
    return result;
  }

  async changePassword(prePassword, password) {
    const resp = await this._post(`/ipo-bapigateway/v1/user/changePassword.json`, {
      prePassword,
      password,
    });
    return resp.data;
  }

  isLoggedIn() {
    const token = this.storeService.getToken();
    return !_.isEmpty(token);
  }

  getUser() {
    return this.storeService.getItem('user');
  }

  setUser(user) {
    this.storeService.storeItem('user', user);
  }

  async logout() {
    await this._get(`/ipo-bapigateway/common/v1/user/logout`);
    this._deleteToken();
    this.storeService.deleteItem('user');
  }

  _setToken(token) {
    this.storeService.setToken(token);
  }

  _deleteToken() {
    this.storeService.deleteToken();
  }
}
