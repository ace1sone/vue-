import { getEvaluators, saveEvaluator } from '@/services/evel';

const defaultState = {
  data: [],
  total: 0,
  current: 1,
  size: 20,
};

export default {
  namespace: 'evaluator',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *searchEvaluators({ payload }, { call, put }) {
      const response = yield call(getEvaluators, payload);

      yield put({
        type: 'loadEvaluators',
        payload: response,
      });
    },

    *saveEvaluator({ payload }, { call }) {
      const response = yield call(saveEvaluator, payload);
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

    loadEvaluators(state, { payload }) {
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
