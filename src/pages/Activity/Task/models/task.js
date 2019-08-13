import {
  getSkus,
  getTasks,
  getActivitys,
  addInvited,
  viewInvited,
  addPuzzle,
  viewPuzzle,
  deleteTask,
  updateInvited,
  updatePuzzle,
  getSpus,
  viewRandomdraw,
  createRandomdraw,
  updateRandomdraw,
  exportExcel,
  awardsList,
  uploadAwards,
  giveOutAwards,
  batch,
} from '@/services/activity';
import { getAddressList } from '@/services/address';

import moment from 'moment';
import { notification } from 'antd';

const defaultState = {
  data: [],
  inviteDetail: {
    relatedProducts: [],
  },
  puzzleDetail: {
    relatedProducts: [],
  },

  randomdrawDetail: {
    relatedProducts: [],
    offlineDrawAddresses: [{}],
  },
};

export default {
  namespace: 'task',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(getTasks, payload);
      yield put({
        type: 'loadList',
        payload: response,
      });
      return response;
    },
    *getValidSpus({ payload }, { call }) {
      const response = yield call(getSpus, { ...payload });
      return response;
    },
    *getSkus({ payload }, { call }) {
      const response = yield call(getSkus, payload);
      return response;
    },
    *getActs({ payload }, { call }) {
      const response = yield call(getActivitys, payload);
      return response;
    },
    *getAddress({ payload }, { call }) {
      const response = yield call(getAddressList, payload);
      return response;
    },
    *invited({ payload }, { call }) {
      const response = yield call(addInvited, payload);
      if (response.header.code !== 2000) {
        notification.error({
          message: response.header.message,
        });
      }
      return response;
    },
    *loadInvited({ payload }, { call, put }) {
      const response = yield call(viewInvited, payload);
      yield put({
        type: 'loadInviteDetail',
        payload: response,
      });
    },
    *editInvited({ payload }, { call }) {
      const response = yield call(updateInvited, payload);
      if (response.header.code !== 2000) {
        notification.error({
          message: response.header.message,
        });
      }
      return response;
    },
    *puzzle({ payload }, { call }) {
      const response = yield call(addPuzzle, payload);
      if (response.header.code !== 2000) {
        notification.error({
          message: response.header.message,
        });
      }
      return response;
    },
    *loadPuzzle({ payload }, { call, put }) {
      const response = yield call(viewPuzzle, payload);
      yield put({
        type: 'loadPuzzleDetail',
        payload: response,
      });
    },

    *editPuzzle({ payload }, { call }) {
      const response = yield call(updatePuzzle, payload);
      if (response.header.code !== 2000) {
        notification.error({
          message: response.header.message,
        });
      }
      return response;
    },

    *delete({ payload }, { call }) {
      const response = yield call(deleteTask, payload);
      return response;
    },

    *randomdraw({ payload }, { call }) {
      const response = yield call(createRandomdraw, payload);
      if (response.header.code !== 2000) {
        notification.error({
          message: response.header.message,
        });
      }
      return response;
    },
    *editRandomdraw({ payload }, { call }) {
      const response = yield call(updateRandomdraw, payload);
      if (response.header.code !== 2000) {
        notification.error({
          message: response.header.message,
        });
      }
      return response;
    },

    *loadRandomdraw({ payload }, { call, put }) {
      const response = yield call(viewRandomdraw, payload);
      yield put({
        type: 'LoadRandomdrawDetail',
        payload: response,
      });
    },

    *export({ payload }, { call }) {
      const response = yield call(exportExcel, payload);
      return response;
    },

    *getAwards({ payload }, { call }) {
      const response = yield call(awardsList, payload);
      return response;
    },

    *upload({ payload }, { call }) {
      const response = yield call(uploadAwards, payload);
      return response;
    },

    *giveOut({ payload }, { call }) {
      const response = yield call(giveOutAwards, payload);
      return response;
    },

    *batch({ payload }, { call }) {
      const response = yield call(batch, payload);
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
    loadInviteDetail(state, { payload }) {
      if (!payload) return defaultState;
      const { data } = payload;
      if (data) {
        const { startTime, endTime, syncActivityTime, activityId, activityName, activityStartTime, activityEndTime } = data;
        data.time = syncActivityTime ? [moment(activityStartTime), moment(activityEndTime)] : [moment(startTime), moment(endTime)];
        data.actInfo = {
          title: activityName,
          id: activityId,
        };
      }

      return {
        ...state,
        inviteDetail: data || {},
        loading: false,
      };
    },
    loadPuzzleDetail(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;

      if (data) {
        const { startTime, endTime, syncActivityTime, activityId, activityName, puzzleIssuanceTime, activityStartTime, activityEndTime } = data;
        data.time = syncActivityTime ? [moment(activityStartTime), moment(activityEndTime)] : [moment(startTime), moment(endTime)];
        data.puzzleIssuanceTime = puzzleIssuanceTime && moment(puzzleIssuanceTime);
        data.actInfo = {
          title: activityName,
          id: activityId,
        };
      }
      return {
        ...state,
        puzzleDetail: data || {},
        loading: false,
      };
    },
    LoadRandomdrawDetail(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;

      if (data) {
        const { startTime, endTime, activityId, syncActivityTime, activityStartTime, activityEndTime, activityName, puzzleIssuanceTime } = data;
        data.time = syncActivityTime ? [moment(activityStartTime), moment(activityEndTime)] : [moment(startTime), moment(endTime)];
        data.puzzleIssuanceTime = puzzleIssuanceTime && moment(puzzleIssuanceTime);
        data.actInfo = {
          title: activityName,
          id: activityId,
        };
      }
      return {
        ...state,
        randomdrawDetail: data || {},
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
    clearDetail(state) {
      return {
        ...state,
        ...defaultState,
      };
    },
  },
};
