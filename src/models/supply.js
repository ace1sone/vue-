import _ from 'lodash';

import { action } from '@/shared/utility';
import { inject } from '@/config';

export default {
  namespace: 'supply',
  state: {
    supplies: null,
    supply: null,
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    updateSupply(state, { payload }) {
      const { supply } = payload;
      const { supplies } = state;
      return {
        ...state,
        supplies: _.map(supplies, item => (item.guid === supply.guid ? supply : item)),
        supply,
      };
    },
  },
  effects: {
    *query({ payload = {} }, { apply, put }) {
      const supplyCtrl = inject('supplyController');
      const result = yield apply(supplyCtrl, supplyCtrl.getSupplies, payload);
      yield put(action('save', { supplies: result.message }));
      return result;
    },
    *load({ payload = {} }, { apply, put }) {
      const supplyCtrl = inject('supplyController');
      const result = yield apply(supplyCtrl, supplyCtrl.getSupply, [payload.id, payload.silent]);
      yield put(action('updateSupply', { supply: result.message }));
      return result;
    },
    *create({ payload = {} }, { apply }) {
      const supplyCtrl = inject('supplyController');
      return yield apply(supplyCtrl, supplyCtrl.createSupply, [payload.supply, payload.silent]);
    },
    *update({ payload = {} }, { apply, put }) {
      const supplyCtrl = inject('supplyController');
      const result = yield apply(supplyCtrl, supplyCtrl.updateSupply, [
        payload.supply,
        payload.silent,
      ]);
      yield put(action('updateSupply', { supply: result.message }));
      return result;
    },
  },
};
