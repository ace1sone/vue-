import { getDetailData } from '@/services/order';

export default {
  namespace: 'orderDetailData',

  state: '',

  effects: {
    *getOrderDetail({payload}, {call, put}) {
      const request = yield call(getDetailData, {orderNo: payload})
      yield put({
        type: 'getData',
        payload: request
      })
    }
  },

  reducers: {
    getData(state, { payload }) {
      return payload.data;
    },
  },
};
