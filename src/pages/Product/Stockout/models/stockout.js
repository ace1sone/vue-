import {
  queryStockoutOrders,
  exportStockoutReport,
  outApprovalOrReject,
  stockoutOrderDetail,
  addStockout,
  validStockoutNum,
  getSpus,
  getSpuDetail,
  editStockout
} from '@/services/stock';
import { notification } from 'antd';

const defaultState = {
  data: [],
  detail: {},
};

export default {
  namespace: 'stockout',

  state: {
    ...defaultState
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(queryStockoutOrders, payload);
      yield put({
        type: 'loadList',
        payload: response,
      });
    },

    *getValidSpus({ payload }, { call }) {
      const { current, size, spuSearchWord } = payload;
      const response = yield call(getSpus, { current, size, spuSearchWord, flag: 0 });
      return response;
    },

    *getSpuDetail({ payload }, { call }) {
      const response = yield call(getSpuDetail, payload);
      return response;
    },

    *exportExcel({ payload }, { call }) {
      const response = yield call(exportStockoutReport, payload);
      return response;
    },
    *approvalOrReject({ payload }, { call }) {
      const response = yield call(outApprovalOrReject, payload);
      if (response.header.code === 2000) notification.success({ message: response.header.msg });
      return response;
    },

    *detail({ payload }, { call }) {
      const response = yield call(stockoutOrderDetail, payload);
      return response;
    },

    *create({ payload }, { call }) {
      const response = yield call(addStockout, payload);
      return response;
    },

    *vaildNum({ payload }, { call }) {
      const response = yield call(validStockoutNum, payload);
      return response;
    },
    *edit({ payload }, { call }) {
      const response = yield call(editStockout, payload);
      return response;
    },
  },

  reducers: {
    clearList(state) {
      return {
        ...state,
        ...defaultState,
        loading: false,
      };
    },
    loadList(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      return {
        ...state,
        data: data || [],
        loading: false,
      };
    }
  },
};
