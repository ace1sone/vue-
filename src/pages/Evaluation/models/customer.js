import { getAllUserInfos, getALlTags, getUserRecords, addTag } from '@/services/evel';

const defaultState = {
  data: {},
  userRecord: {},
};

export default {
  namespace: 'customer',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *searchUsers({ payload }, { call, put }) {
      const response = yield call(getAllUserInfos, payload);

      yield put({
        type: 'loadUsers',
        payload: response,
      });
    },

    *searchTags({ payload }, { call }) {
      const response = yield call(getALlTags, payload);
      return response;
    },

    *getMainRecords({ payload, success }, { call, put }) {
      const response = yield call(getUserRecords, payload);
      yield put({
        type: 'loadRecords',
        payload: response,
      });
      if (success) success(response);
    },

    *getUserRecords({ payload, success }, { call, put }) {
      const response = yield call(getUserRecords, payload);
      if (success) success(response);
    },

    *saveTags({ payload, success }, { call }) {
      const response = yield call(addTag, payload);
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

    loadUsers(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      return {
        ...state,
        data: data || [],
        loading: false,
      };
    },

    loadRecords(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      return { ...state, userRecord: data || {}, loading: false };
    },
  },
};
