import {
  getWaybills,
  getShippingStatus,
  getShippingReport,
  getExpressReport,
  getWaybillDetail,
  getOrderDetail,
  getExpressCompanies,
  Shipping,
  getWaybillLogs,
  updateWaybill,
  checkRepeat,
  bulk
} from '@/services/waybill';

export default {
  namespace: 'waybill',
  state: {
    list: {
      current: 1,
      pages: 0,
      records: [],
      searchCount: true,
      size: 10,
      total: 0,
    },
    waybillDetail: {},
    orderDetail: {},
    expressCompanies: {},
    shippingStatus: null,
    log: {}
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        [payload.key]: payload.direct ? payload.data : { ...payload.data },
      };
    },
  },
  effects: {
    *getShippingStatus(action, { call, put }) {
      const res = yield call(getShippingStatus);
      yield put({
        type: 'save',
        payload: { key: 'shippingStatus', data: res.data },
      });
    },
    *getWaybills({ payload }, { call, put }) {
      const res = yield call(getWaybills, payload);
      yield put({
        type: 'save',
        payload: { key: 'list', data: res.data },
      });
      return res
    },
    *getWaybillDetail({ payload }, { call, put }) {
      const waybill = yield call(getWaybillDetail, payload);
      const { orderCode } = waybill.data;
      const order = yield call(getOrderDetail, { id: orderCode });
      yield put({
        type: 'save',
        payload: { key: 'waybillDetail', data: waybill.data },
      });
      yield put({
        type: 'save',
        payload: { key: 'orderDetail', data: order.data },
      });
    },
    *getExpressReport({ payload }, { call }) {
      const res = yield call(getExpressReport, payload);
      return res;
    },
    *getShippingReport({ payload }, { call }) {
      const res = yield call(getShippingReport, payload);
      return res;
    },
    *getExpressCompanies({ payload }, { call, put }) {
      const res = yield call(getExpressCompanies, payload);
      yield put({
        type: 'save',
        payload: { key: 'expressCompanies', data: res.data },
      });
    },
    *shipping({ payload }, { call }) {
      const res = yield call(Shipping, payload);
      return res
    },
    *updateWaybill({ payload }, { call }) {
      const res = yield call(updateWaybill, payload);
      return res
    },
    *getWaybillLogs({ payload }, { call, put }) {
      const res = yield call(getWaybillLogs, payload);
      yield put({ type: 'save', payload: { key: 'log', data: res.data } });
    },
    *checkRepeat({payload}, { call }) {
      const res = yield call(checkRepeat, payload);
      return res
    },
    *bulkShipping({ payload }, { call, put }) {
      const res = yield call(bulk, payload);
      return res
    }
  },
};
