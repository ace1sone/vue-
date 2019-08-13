import {
  selectAllSpecs,
  changeStatus,
  querySpecInfoByNo,
  addOrEditSpec,
  delSpec,
  checkSpu,
  downloadSpecSpu
} from '@/services/props';

const defaultState = {
  data: [],
  detail: {},
};

export default {
  namespace: 'spec',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *getSpecs({ payload }, { call, put }) {
      const response = yield call(selectAllSpecs, payload);

      yield put({
        type: 'loadList',
        payload: response,
      });
    },

    *delSpec({ payload, success }, { call }) {
      const response = yield call(delSpec, payload);
      if (success) success(response);
    },

    *checkSpu({ payload }, { call }) {
      const response = yield call(checkSpu, payload);
      return response;
    },

    *changeStatus({ payload }, { call }) {
      const response = yield call(changeStatus, payload);
      return response;
    },

    *addOrEditSpec({ payload, success }, { call }) {
      const response = yield call(addOrEditSpec, payload);
      if (success) success(response);
    },

    *querySpecInfoByNo({ payload }, { call, put }) {
      const response = yield call(querySpecInfoByNo, payload);
      yield put({
        type: 'loadDetail',
        payload: response,
      });
    },

    *downloadSpu({ payload }, { call }) {
      const response = yield call(downloadSpecSpu, payload);
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
