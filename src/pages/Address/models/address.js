import { getAddressList, detail, update, addAddress } from '@/services/address';

const defaultState = {
  data: [],
  detail: {},
};

export default {
  namespace: 'address',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *getAddressList({ payload }, { call, put }) {
      const response = yield call(getAddressList, payload);

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

    *update({ payload, success }, { call }) {
      const response = yield call(update, payload);
      if (success) success();
      return response;
    },
    *addAddress({ payload, success }, { call }) {
      const response = yield call(addAddress, payload);
      if (success) success();
      return response;
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
