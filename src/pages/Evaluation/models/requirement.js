import { getEvalOrders, getEvaluators, getALlBrands, correctOrders } from '@/services/evel';

const defaultState = {
  data: [],
  total: 0,
  current: 1,
  size: 20,
};

export default {
  namespace: 'requirement',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *searchEvalOrders({ payload }, { call, put }) {
      let { page = '' } = payload;
      const response = yield call(getEvalOrders, payload);

      yield put({
        type: 'loadOrders',
        payload: { ...response, ...{ page: page } },
      });
    },

    *searchEvaluators({ payload }, { call }) {
      const response = yield call(getEvaluators, payload);
      return response;
    },

    *searchBrands({ payload }, { call }) {

      const response = yield call(getALlBrands, payload);
      return response;
    },

    *correct({ payload }, { call }) {
      const response = yield call(correctOrders, payload);
      return response;
    },
  },

  reducers: {
    loading(state, { payload }) {
      const { loading } = payload;
      return {
        ...state,
        loading,
      };
    },

    loadOrders(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      return {
        ...state,
        data: data || [],
        loading: false,
      };
    },
  },
};
