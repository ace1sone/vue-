import {
  getRoles,
  saveRole,
  getDynamicList,
  loadRoleDetail,
  loadDynamic,
  changeDisabled,
  saveDynamic,
  publishDyn,
  actionDyn,
  getEnableNpcs,
} from '@/services/npc';
import { getShelves } from '@/services/shelve';
import { getActivitys } from '@/services/activity';
import { notification } from 'antd';

const defaultState = {
  rolesdata: { npcInfoItems: { records: [], total: 10, pages: 10, current: 1 } },
  detail: {},
  dynData: { npcPostsItems: { records: [], total: 10, pages: 10, current: 1 } },
  validRolesData: [],
};

export default {
  namespace: 'npc',

  state: {
    ...defaultState,
  },

  effects: {
    *roles({ payload }, { call, put }) {
      const response = yield call(getRoles, payload);
      yield put({
        type: 'rolesList',
        payload: response,
      });
    },

    *dynamicList({ payload }, { call, put }) {
      const response = yield call(getDynamicList, payload);
      yield put({
        type: 'dynList',
        payload: response,
      });
    },

    *getSpus({ payload }, { call }) {
      const response = yield call(getShelves, payload);
      return response || {};
    },

    *getValidRoles({ payload }, { call, put }) {
      const response = yield call(getEnableNpcs, payload);
      yield put({
        type: 'validRoles',
        payload: response,
      });
    },

    *getActs({ payload }, { call }) {
      const response = yield call(getActivitys, payload);
      return response || {};
    },

    *saveRole({ payload }, { call }) {
      const response = yield call(saveRole, payload);
      if (response.header.code !== 2000) {
        notification.error({
          message: response.header.message,
        });
      }
      return response;
    },

    *saveDyn({ payload }, { call }) {
      const response = yield call(saveDynamic, payload);
      if (response.header.code !== 2000) {
        notification.error({
          message: response.header.message,
        });
      }
      return response;
    },

    *loadRole({ payload }, { call, put }) {
      const response = yield call(loadRoleDetail, payload);
      yield put({
        type: 'role',
        payload: response,
      });
    },

    *loadDyn({ payload }, { call, put }) {
      const response = yield call(loadDynamic, payload);
      yield put({
        type: 'dynamic',
        payload: response,
      });
    },

    *publish({ payload }, { call }) {
      const response = yield call(publishDyn, payload);
      return response;
    },

    *disabled({ payload }, { call }) {
      const response = yield call(changeDisabled, payload);
      return response;
    },

    *actionDynamic({ payload }, { call }) {
      const response = yield call(actionDyn, payload);
      return response;
    },
  },

  reducers: {
    rolesList(state, { payload }) {
      if (!payload) return defaultState;
      const { data } = payload;
      return {
        ...state,
        rolesdata: data || defaultState.rolesdata,
        loading: false,
      };
    },
    dynList(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      return {
        ...state,
        dynData: data || defaultState.dynData,
        loading: false,
      };
    },
    role(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      return {
        ...state,
        detail: data.npcInfo || defaultState.detail,
        loading: false,
      };
    },
    dynamic(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      if (data.npcPost) {
        const { activityInfos, spuInfos } = data.npcPost;
        if (activityInfos && activityInfos.length > 0) {
          data.npcPost.activities = activityInfos;
        }
        if (spuInfos && spuInfos.length > 0) {
          spuInfos.sort((a, b) => a.weight - b.weight);
          const newSpus = spuInfos.forEach(item => {
            const eve = item;
            eve.skuImg = item.cover;
          });
          data.spuInfos = newSpus;
        }
      }
      return {
        ...state,
        detail: data.npcPost || defaultState.detail,
        loading: false,
      };
    },
    validRoles(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      if (data.npcInfos && data.npcInfos.length > 0) {
        data.npcInfos = data.npcInfos.filter(item => item.status === 'ENABLE');
      }
      return {
        ...state,
        validRolesData: data.npcInfos || defaultState.validRolesData,
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
