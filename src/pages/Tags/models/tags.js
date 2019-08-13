import { createTags, loadTagsList, editTags } from '@/services/tags';

const defaultState = {
  data: [],
};

export default {
  namespace: 'tags',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *createTags({ payload }, { call, put }) {
      const response = yield call(createTags, payload);

      yield put({
        type: 'newTags',
        payload: response,
      });
    },

    *loadTagsList({ payload }, { call, put }) {
      const response = yield call(loadTagsList, payload);
      yield put({
        type: 'TagsList',
        payload: response,
      });
    },

    *editTags({ payload, success }, { call }) {
      const response = yield call(editTags, payload);
      if (success) success();
      return response;
    },
  },

  reducers: {
    newTags(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      return {
        ...state,
        data: data || [],
        loading: false,
      };
    },
    TagsList(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      return {
        ...state,
        data: data || [],
        loading: false,
      };
    },
    clearDetail(state) {
      return {
        ...state,
        data: [],
        loading: false,
      };
    },
  },
};
