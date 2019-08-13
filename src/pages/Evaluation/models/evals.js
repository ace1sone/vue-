import { notification } from 'antd';

import { inject } from '@/config';

import { getReports, getEvalOrders, saveEvaluator, getEvaluators, sealUser } from '@/services/evel';

const defaultState = {
  data: [],
  total: 0,
  current: 1,
  size: 20,
};

export default {
  namespace: 'evals',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *search({ payload, success }, { call, put }) {
      const response = yield call(getReports, payload);
      yield put({
        type: 'loadReports',
        payload: response,
      });
      if (success) success(response);
    },

    *searchEvalOrders({ payload }, { call, put }) {
      let { page = '' } = payload;
      const response = yield call(getEvalOrders, payload);

      yield put({
        type: 'loadOrders',
        payload: { ...response, ...{ page: page } },
      });
    },

    //对用户进行忽略或者封禁操作
    *sealUser({ payload }, { call }) {
      const response = yield call(sealUser, payload);
      return response;
    },

    *searchUser({ payload }, { apply }) {
      const supplyCtrl = inject('supplyController');
      const response = yield apply(supplyCtrl, supplyCtrl.getSupplies, payload);
      return response;
    },

    *searchBrands({ payload }, { apply, put }) {

      let { page = '', order = '' } = payload;
      const supplyCtrl = inject('supplyController');
      const response = yield apply(supplyCtrl, supplyCtrl.getSupplies, [page, payload, order]);
      return response;
    },

    // *register({ payload, success, fail }, { call }) {
    //   const response = yield call(register, payload);
    //   if (success && response) success(response);
    //   if (fail && !response) fail(response);
    // },

    *delete({ payload }, { call, put, select }) {
      const response = yield call(deleteUser, payload.id);
      const pageConfig = yield select(state => ({
        page: state.users.current,
        size: state.users.size,
      }));
      yield put({
        type: 'search',
        payload: pageConfig,
      });
      if (response.success === 0) {
        notification.success({ message: `删除用户成功 ${payload.actualName}` });
      }
    },

    // *updateStatus({ payload }, { call, put }) {
    //   yield call(updateStatus, payload);
    //   const response = yield call(searchUsers, payload);
    //   yield put({
    //     type: 'loadUpdate',
    //     payload: response.data[0],
    //   });
    // },

    *update({ payload }, { apply, put }) {
      const supplyCtrl = inject('supplyController');
      const result = yield apply(supplyCtrl, supplyCtrl.updateSupply, [
        payload.supply,
        payload.silent,
      ]);
      yield put({ type: 'updateSupply', payload: { supply: result.message } });
      return result;
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

    loadReports(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      return {
        ...state,
        data: data || [],
        loading: false,
      };
    },

    loadOrders(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      return {
        ...state,
        data: data || [],
        loading: false,
      };
    },

    loadUpdate(state, { payload }) {
      const users = state.data.slice(0);
      const index = users.findIndex(user => user.id === payload.id);
      users[index] = payload;
      return {
        ...state,
        data: users,
      };
    },
  },
};
