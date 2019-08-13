import { notification } from 'antd';

import { inject } from '@/config';

import { getReports, sealUser } from '@/services/evel';

const defaultState = {
  data: [],
  total: 0,
  current: 1,
  size: 20,
};

export default {
  namespace: 'complaint',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *search({ payload, success }, { call, put }) {
      const response = yield call(getReports, payload);
      yield put({
        type: 'loadReports',
        payload: response,
      });
      if (success) success(response);
    },

    //对用户进行忽略或者封禁操作
    *sealUser({ payload,success}, { call }) {
      const response = yield call(sealUser, payload);
      if (success) success(response);
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

    loadReports(state, { payload }) {
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
