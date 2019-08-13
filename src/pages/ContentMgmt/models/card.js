import { getCardList, handleTop, handleLock, getCardDetail, updateCard, createCard, handleDelete, uploadFile } from '@/services/contentMgmt';

export default {
  namespace: 'contentMgmt',
  state: {
    imgLoading: false
  },
  effects: {
    *fetchCardList({ payload }, { call }) {
      const response = yield call(getCardList, payload);
      return response;
    },
    *handleTop({ payload }, { call }) {
      const response = yield call(handleTop, payload);
      return response;
    },
    *handleLock({ payload }, { call }) {
      const response = yield call(handleLock, payload);
      return response;
    },
    *handleDelete({ payload }, { call }) {
      const response = yield call(handleDelete, payload);
      return response;
    },
    *getCardDetail({ payload }, { call }) {
      const response = yield call(getCardDetail, payload);
      return response;
    },
    *updateCard({ payload }, { call }) {
      const response = yield call(updateCard, payload);
      return response;
    },
    *createCard({ payload }, { call }) {
      const response = yield call(createCard, payload);
      return response;
    },
    *uploadFile({ payload }, { call }) {
      const response = yield call(uploadFile, payload);
      return response;
    }
  },
  reducers: {
    save(state, { payload }) {
      const { key, value } = payload;
      return {
        ...state,
        [state[key]]: value,
      };
    },
  },
};
