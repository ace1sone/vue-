import { getALlTags, saveTag } from '@/services/evel';
import { message, Modal} from 'antd';

const defaultState = {
  data: [],
  total: 0,
  current: 0,
  size: 20,
};

export default {
  namespace: 'tags',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *searchTags({ payload }, { call, put }) {
      const response = yield call(getALlTags, payload);

      yield put({
        type: 'loadTags',
        payload: response,
      });
    },

    *saveTag({ payload }, { call }) {
      const response = yield call(saveTag, payload);
      if(response.header.code != 2000 ){
        Modal.info({
          title: "错误信息",
          content: 'Tag 重复或者其他错误'
        })
      }
      return response;
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

    loadTags(state, { payload }) {
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
