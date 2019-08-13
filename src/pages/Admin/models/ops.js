import { getOps, detail, save, update, del, getStatus, userSync, activitySync } from '@/services/ops';

const defaultState = {
  data: [],
  detail: {},
};

export default {
  namespace: 'ops',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *getOps({ payload }, { call, put }) {
      const response = yield call(getOps, payload);

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

    *save({ payload, success }, { call }) {
      const response = yield call(save, payload);
      if (success) success(response);
    },

    *update({ payload, success }, { call }) {
      const response = yield call(update, payload);
      if (success) success(response);
    },

    *getStatus({ payload }, { call }) {
      const response = yield call(getStatus, payload);
      return response;
    },

    *del({ payload, success }, { call }) {
      const response = yield call(del, payload);
      success(response);
    },

    *userSync({ payload, success }, { call }) {
      const response = yield call(userSync, payload);
      success(response);
    },

    *activitySync({ payload, success }, { call }) {
      const response = yield call(activitySync, payload);
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
