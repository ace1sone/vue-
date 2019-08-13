/* eslint-disable */
import qs from 'query-string';
import _ from 'lodash';

import BaseService from './base-service';

export default class SupplyService extends BaseService {
  constructor(storeService) {
    super(storeService);
  }

  async getSupplies(page = 1, query = {}, order = '-createdAt') {
    let querystr = qs.stringify(_.omitBy(query, _.isEmpty));
    if (querystr) querystr = `&${querystr}`;
    const resp = await this._get(
      `/ec-bapigateway/v1/supplier?page=${page}${querystr}&sortField=${order}`
    );
    return resp.data;
  }

  async getSupply(guid) {
    const resp = await this._get(`/ec-bapigateway/v1/supplier/${guid}`);
    return resp.data;
  }

  async createSupply(supply) {
    const resp = await this._post(`/ec-bapigateway/v1/supplier`, supply);
    return resp.data;
  }

  async updateSupply(supply) {
    const resp = await this._post(`/ec-bapigateway/v1/supplier/${supply.guid}`, supply);
    return resp.data;
  }
}
