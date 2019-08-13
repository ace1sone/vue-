import { getSkuServices, detail, addOrEdit, checkSku, del } from '@/services/skuService';

const defaultState = {
  data: [],
  detail: {},
};

export default {
  namespace: 'skuservice',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *getSkuServices({ payload }, { call, put }) {
      const response = yield call(getSkuServices, payload);

      yield put({
        type: 'loadList',
        payload: response,
      });
    },

    *detail({ payload }, { call, put }) {
      const response = yield call(detail, payload);
      yield put({
        type: 'loadDetail',
        payload: response,
      });
    },

    *addOrEdit({ payload, success }, { call }) {
      const response = yield call(addOrEdit, payload);
      if (success) success(response);
    },

    *checkSku({ payload }, { call }) {
      const response = yield call(checkSku, payload);
      return response;
    },

    *del({ payload, success }, { call }) {
      const response = yield call(del, payload);
      success(response);
    },
  },

  reducers: {
    loadList(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      return {
        ...state,
        data: data || [],
        loading: false,
      };
    },
    loadDetail(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      return {
        ...state,
        detail: data || {},
        loading: false,
      };
    },
    clearDetail(state) {
      return {
        ...state,
        detail: {},
        loading: false,
      };
    },
  },
};
