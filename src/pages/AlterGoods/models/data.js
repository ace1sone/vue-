import { getOrderList, getReverseOrderList } from '@/services/order';

export default {
  namespace: 'orderData',

  state: '',

  effects: {
    *getOrder({ payload }, { call, put }) {
      const request = yield call(getOrderList, payload);
      yield put({
        type: 'getData',
        payload: request,
      });
    },
    *getReverseOrder({ payload }, { call, put }) {
      const request = yield call(getReverseOrderList, payload);
      yield put({
        type: 'getData',
        payload: request,
      });
    },
  },

  reducers: {
    getData(state, { payload }) {
      return payload.data;
    },
  },
};
