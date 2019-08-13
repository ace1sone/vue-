import { changeDescStatus, queryDescInfoByNo, delDesc, addOrEditDesc, downloadSpu, searchDescs, checkSpuNum } from '@/services/props';

const defaultState = {
  data: [],
  detail: {},
};

export default {
  namespace: 'desc',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *getDescs({ payload }, { call, put }) {
      const response = yield call(searchDescs, payload);
      yield put({
        type: 'loadList',
        payload: response,
      });
    },
    *delDesc({ payload, success }, { call }) {
      const response = yield call(delDesc, payload);
      if (success) success(response);
    },
    *changeStatus({ payload }, { call }) {
      const response = yield call(changeDescStatus, payload);
      return response;
    },
    *addOrEditDesc({ payload, success }, { call }) {
      const response = yield call(addOrEditDesc, payload);
      if (success) success(response);
    },
    *queryDescInfoByNo({ payload }, { call, put }) {
      const response = yield call(queryDescInfoByNo, payload);
      yield put({
        type: 'loadDetail',
        payload: response,
      });
    },
    *downloadDesc({ payload }, { call }) {
      const response = yield call(downloadSpu, payload);
      return response;
    },
    *checkDesc({ payload }, { call }) {
      const response = yield call(checkSpuNum, payload);
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
