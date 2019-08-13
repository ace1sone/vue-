import { notification } from 'antd';
import { getSaleTabs, addSaleTab, getNewestTabs, addNewestTab, publishTabs } from '@/services/homemgmt';
import { getActivitys } from '@/services/activity';

const defaultState = {
  data: [],
  source: {},
  newests: [],
  sales: [],
};

export default {
  namespace: 'homemgmt',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *sources({ payload }, { call, put }) {
      const { type } = payload;
      let response = '';
      if (type === 'ACTIVITY') {
        response = yield call(getActivitys, { isOnline: true, ...payload });
      }
      yield put({
        type: 'loadSources',
        payload: { ...response, type },
      });
    },
    *saleTabs({ payload }, { call, put }) {
      const response = yield call(getSaleTabs, payload);
      yield put({
        type: 'loadSales',
        payload: response,
      });
    },
    *newestTabs({ payload }, { call, put }) {
      const response = yield call(getNewestTabs, payload);
      yield put({
        type: 'loadNewest',
        payload: response,
      });
    },
    *saveSaleTab({ payload }, { call }) {
      const response = yield call(addSaleTab, payload);
      if (response.header.code !== 2000) {
        notification.error({
          message: response.header.message,
        });
      }
      return response;
    },

    *saveNewest({ payload }, { call }) {
      const response = yield call(addNewestTab, payload);
      return response;
    },

    *publish({ payload }, { call }) {
      const response = yield call(publishTabs, payload);
      return response;
    },
  },

  reducers: {
    loadSources(state, { payload }) {
      const { data, type } = payload;
      return {
        ...state,
        source: { type, ...data },
        loading: false,
      };
    },

    loadSales(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        sales: data || [],
        loading: false,
      };
    },
    loadNewest(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        newests: data || [],
        loading: false,
      };
    },

    clearList(state) {
      return {
        ...state,
        ...defaultState,
        loading: false,
      };
    },
  },
};
