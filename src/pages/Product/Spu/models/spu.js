import { getSpus, modifySpuStatus } from '@/services/product';

export default {
  namespace: 'spu',

  state: {
    current: 1,
    size: 10,
    records: [],
    spuSearchWord: '',
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const { current, size, spuSearchWord } = payload;
      const response = yield call(getSpus, { current, size, spuSearchWord });
      yield put({
        type: 'save',
        payload: { ...response.data, spuSearchWord },
      });
    },
    *modifySpuStatus({ payload }, { call, put, select }) {
      yield call(modifySpuStatus, payload);
      const { current, size, spuSearchWord } = yield select(({ spu }) => spu);
      yield put({
        type: 'fetchList',
        payload: { current, size, spuSearchWord },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
