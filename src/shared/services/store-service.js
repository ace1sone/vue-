import store from 'store';

import Config from '@/config/Config';

const storagePrefix = Config.storagePrefix || '';

const TOKEN_KEY = `${storagePrefix}token`;

export default class StoreService {
  temp = {};

  storeTemp(k, val) {
    this.temp[k] = val;
  }

  getTemp(k) {
    return this.temp[k];
  }

  deleteTemp(k) {
    delete this.temp[k];
  }

  dGetTemp(k) {
    const tmp = this.getTemp(k);
    this.deleteTemp(k);
    return tmp;
  }

  // eslint-disable-next-line
  getToken() {
    return store.get(TOKEN_KEY);
  }

  // eslint-disable-next-line
  setToken(token) {
    store.set(TOKEN_KEY, token);
  }

  // eslint-disable-next-line
  deleteToken() {
    store.remove(TOKEN_KEY);
  }

  // eslint-disable-next-line
  storeItem(k, val) {
    store.set(storagePrefix + k, val);
  }

  // eslint-disable-next-line
  getItem(k) {
    return store.get(storagePrefix + k);
  }

  // eslint-disable-next-line
  deleteItem(k) {
    store.remove(storagePrefix + k);
  }
}
