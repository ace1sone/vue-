import { getTasks, getActivitys, getSpus } from '@/services/activity';

import { getMaterialList, getMaterial, save, update, getHotZoneTask } from '@/services/material';
import { getEnableNpcs } from '@/services/npc';

const defaultState = {
  list: [],
  detail: {},
};

export default {
  namespace: 'material',

  state: {
    ...defaultState,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(getMaterialList, payload);
      yield put({
        type: 'loadList',
        payload: response,
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(getMaterial, payload);
      yield put({
        type: 'loadDetail',
        payload: response,
      });
    },
    *getActs({ payload }, { call }) {
      const response = yield call(getActivitys, payload);
      return response;
    },

    *getTasks({ payload }, { call }) {
      const response = yield call(getTasks, payload);
      return response;
    },

    *getMaters({ payload }, { call }) {
      const response = yield call(getMaterialList, payload);
      return response;
    },

    *save({ payload, success }, { call }) {
      const response = yield call(save, payload);
      if (success) success(response);
    },

    *update({ payload, success }, { call }) {
      const response = yield call(update, payload);
      if (success) success(response);
    },

    *getNpclist({ payload }, { call }) {
      const response = yield call(getEnableNpcs, payload);
      return response;
    },

    *getActivitySpus({ payload }, { call }) {
      const response = yield call(getSpus, payload);
      return response;
    },

    *getHotZoneTask({ payload }, { call }) {
      const response = yield call(getHotZoneTask, payload);
      return response;
    },
  },

  reducers: {
    loadList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        list: data,
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
    clearList(state) {
      return {
        ...state,
        ...defaultState,
      };
    },
    clearDetail(state) {
      return {
        ...state,
        ...defaultState,
      };
    },
  },
};
