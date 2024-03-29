import axios from 'axios';

export default class BaseService {

  constructor(storeService) {
    this.storeService = storeService;
  }

  async _getOptions(opts = {}) {
    opts.headers = await this._getHeaders(opts.headers);
    return {
      ...opts
    };
  }

  async _getHeaders(headers = {}) {
    var tokenHeader;
    var token = await this.storeService.getToken();
    if (token) {
      tokenHeader = { 'x-auth-token': `${token}` }
    }
    return {
      ...tokenHeader,
      ...headers
    };
  }

  async _get(url, opts = {}) {
    return axios.get(url, await this._getOptions(opts));
  }

  async _post(url, data, opts = {}) {
    return axios.post(url, data, await this._getOptions(opts));
  }

  async _put(url, data, opts = {}) {
    return axios.put(url, data, await this._getOptions(opts));
  }

  async _delete(url, opts = {}) {
    return axios.delete(url, await this._getOptions(opts));
  }

}
