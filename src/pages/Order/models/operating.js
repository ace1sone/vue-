import { cancelOrder, applyAfterSale, completeAfterSale } from '@/services/order';

export default {
  namespace: 'operating',

  state: '',

  effects: {
    *cancel({payload}, {call, put}) {
      const request = yield call(cancelOrder, payload)
      yield put({
        type: 'orderOperating',
        payload: request
      })
    },
    *apply({payload}, {call, put}) {
      const request = yield call(applyAfterSale, payload)
      yield put({
        type: 'orderOperating',
        payload: request
      })
    },
    *complete({payload}, {call, put}) {
      const request = yield call(completeAfterSale, payload)
      yield put({
        type: 'orderOperating',
        payload: request
      })
    }
  },

  reducers: {
    orderOperating(state, { payload }) {
      return payload.data;
    },
  },
};
