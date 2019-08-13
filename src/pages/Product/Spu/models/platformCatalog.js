import { searchAllLeaf } from '@/services/product';

export default {
  namespace: 'platformCatalog',

  state: {
    size: 10,
    records: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(searchAllLeaf, payload);
      if (response) {
        yield put({
          type: 'loadList',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    loadList(state, { payload }) {
      return { ...state, records: payload };
    },
  },
};
