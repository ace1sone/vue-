import { brandList, brandModify, brandSave, brandDetail, searchAllBrands } from '@/services/props';

const defaultState = {
  data: [],
  detail: {
    brandAttachList: [],
    brandShowList: [],
    proBrandDTO: {},
    seriesCount: 0,
    seriesDTOList: [],
  },
};

export default {
  namespace: 'brand',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *getBrands({ payload }, { call, put }) {
      const response = yield call(brandList, payload);

      yield put({
        type: 'loadList',
        payload: response,
      });
    },

    *searchAllBrands({ payload }, { call }) {
      const response = yield call(searchAllBrands, payload);

      return response;
    },

    *brandModify({ payload, success }, { call }) {
      const response = yield call(brandModify, payload);
      return response;
    },

    *brandSave({ payload, success }, { call }) {
      const response = yield call(brandSave, payload);
      if (success) success(response);
    },

    *brandDetail({ payload }, { call, put }) {
      const response = yield call(brandDetail, payload);

      yield put({
        type: 'loadDetail',
        payload: response,
      });
    },

    *brandSpuDownload({ payload }, { call, put }) {
      const response = yield call(brandSpuDownload, payload);
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
