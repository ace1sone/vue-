import {
  saveActivity,
  getTasks,
  activityDetail,
  getActivitys,
  activityOffline,
  activityOnline,
  getTaskData,
  batch,
  deleteActivity,
  activitySpus,
  sortTask,
  getIntro,
  saveIntro,
  getEnableNpcs,
  getSpus,
  getClientId,
  getClientContent,
  getMiniProgrameQRCode,
} from '@/services/activity';
// import { getSpus } from '@/services/product';
import { getShelves } from '@/services/shelve';
import { setSceneStart } from '@/services/material';
import { getCardListByActivity } from '@/services/contentMgmt';
import { get, isEmpty } from 'lodash';

const defaultState = {
  data: [],
  detail: {},
  taskData: [],
  activitySpus: [],
  replyId: [],
  replyContent: [],
};

export default {
  namespace: 'activity',

  state: {
    ...defaultState,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(getActivitys, payload);
      yield put({
        type: 'loadList',
        payload: response,
      });
    },

    *getSpus({ payload }, { call }) {
      const { current, size, spu } = payload;
      const response = yield call(getShelves, { current, size, spu, sellingStatus: 1 });
      return response || {};
    },

    *getRecomSpus({ payload }, { call }) {
      const response = yield call(getSpus, payload);
      return response || {};
    },

    *getTasks({ payload }, { call }) {
      const response = yield call(getTasks, payload);
      return response;
    },

    *saveActivity({ payload, success }, { call }) {
      const response = yield call(saveActivity, payload);
      if (success) success(response);
    },

    *detail({ payload }, { call, put }) {
      const response = yield call(activityDetail, payload);

      yield put({
        type: 'loadDetail',
        payload: response,
      });
    },

    *online({ payload, success }, { call }) {
      const response = yield call(activityOnline, payload);
      if (success) success(response);
    },

    *offline({ payload, success }, { call }) {
      const response = yield call(activityOffline, payload);
      if (success) success(response);
    },

    *batch({ payload, success }, { call }) {
      const response = yield call(batch, payload);
      if (success) success(response);
    },

    *getTaskData({ payload }, { call, put }) {
      yield put({
        type: 'loadTaskData',
        payload: { lists: [] },
      });

      const response = yield call(getTaskData, payload);
      yield put({
        type: 'loadTaskData',
        payload: { lists: response.data.activityRelevanceTasks || [] },
      });
    },

    *getActivitySpus({ payload }, { call, put }) {
      yield put({
        type: 'loadActivitySpus',
        payload: { lists: [] },
      });

      const response = yield call(activitySpus, payload);
      yield put({
        type: 'loadActivitySpus',
        payload: { lists: response.data || [] },
      });
    },

    *delete({ payload, success }, { call }) {
      const response = yield call(deleteActivity, payload);
      if (success) success(response);
    },

    *setSceneStart({ payload }, { call }) {
      const response = yield call(setSceneStart, payload);
      return response;
    },

    *sortTask({ payload }, { call }) {
      const response = yield call(sortTask, payload);
      return response;
    },

    *getCards({ payload }, { call }) {
      const response = yield call(getCardListByActivity, payload);
      return response;
    },

    *getIntro({ payload }, { call }) {
      const response = yield call(getIntro, payload);
      return response;
    },

    *saveIntro({ payload, success }, { call }) {
      const response = yield call(saveIntro, payload);
      if (success) success(response);
    },
    *getNpclist({ payload }, { call, put }) {
      const response = yield call(getEnableNpcs, payload);
      yield put({
        type: 'loadNpcs',
        payload: response,
      });
    },

    *clientList({ payload }, { call, put }) {
      const response = yield call(getClientId, payload);
      yield put({
        type: 'loadCliList',
        payload: response,
      });
    },

    *clientContent({ payload }, { call }) {
      const response = yield call(getClientContent, payload);
      return response;
    },
    *getMiniProgrameQRCode({ payload }, { call }) {
      const response = yield call(getMiniProgrameQRCode, payload);
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

    loadCliList(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      const newDatas = [];
      if (data) {
        data.forEach((item, index) => newDatas.push({ id: item, value: index }));
      }
      return {
        ...state,
        replyIds: newDatas || [],
        loading: false,
      };
    },

    loadDetail(state, { payload }) {
      if (!payload) return defaultState;
      const { data } = payload;
      if (data && data.npcList && data.npcList.length > 0) {
        const newNpc = [];
        data.npcList.forEach(item => newNpc.push({ npcId: item.id, avatar: item.image, name: item.name }));
        data.npcList = newNpc;
      }
      return {
        ...state,
        detail: data || {},
        loading: false,
      };
    },

    loadNpcs(state, { payload }) {
      if (!payload) return defaultState;
      const { data } = payload;
      if (data.npcInfos && data.npcInfos.length > 0) {
        data.npcInfos = data.npcInfos.filter(item => item.status === 'ENABLE');
      }
      return {
        ...state,
        npcDatas: data.npcInfos || [],
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
    loadTaskData(state, { payload }) {
      const { lists } = payload;
      return {
        ...state,
        loading: false,
        taskData: lists || [],
      };
    },
    loadActivitySpus(state, { payload }) {
      const { lists } = payload;
      return {
        ...state,
        loading: false,
        activitySpus: lists || [],
      };
    },
  },
};
