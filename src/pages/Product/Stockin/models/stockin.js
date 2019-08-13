import {
  queryStockinOrders,
  exportStockinReport,
  stockinOrderDetail,
  addOrEditStockinOrder,
  inApprovalOrReject,
  getSpus,
  getSpuDetail,
  rejectSubmit
} from '@/services/stock';
import { notification } from 'antd';

const defaultState = {
  data: [],
  detail: {},
};

export default {
  namespace: 'stockin',

  state: {
    ...defaultState
  },

  effects: {

    *fetchList({ payload }, { call, put }) {
      const response = yield call(queryStockinOrders, payload);
      yield put({
        type: 'loadList',
        payload: response
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
      const response = yield call(exportStockinReport, payload);
      return response;
    },

    *detail({ payload }, { call }) {
      const response = yield call(stockinOrderDetail, payload);
      return response;
    },
    *addOrEditStockinOrder({ payload }, { call }) {
      const response = yield call(addOrEditStockinOrder, payload);
      if (response.header.code === 2000) notification.success({ message: response.header.msg });
      return response;

    },
    *approvalOrReject({ payload }, { call }) {
      const response = yield call(inApprovalOrReject, payload);
      if (response.header.code === 2000) notification.success({ message: response.header.msg });
      return response;
    },
    *edit({ payload }, { call }) {
      const response = yield call(rejectSubmit, payload); // 驳回提交
      if (response.header.code === 2000) notification.success({ message: response.header.msg });
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
    clearList(state) {
      return {
        ...state,
        ...defaultState,
        loading: false,
      };
    },
  },
};
