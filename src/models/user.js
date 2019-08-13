import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import { reloadAuthorized } from '@/utils/Authorized';
import { setAuthority } from '@/utils/authority';
import { login } from '@/services/user';
import { getPageQuery } from '@/utils/utils';
import { CURRENT_USER, USER_TOKEN } from '@/constants';
import { getStorageItem, removeStorageItems, setStorageItem } from '@/utils/localStorage';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { put }) {
      const currentUser = getStorageItem(CURRENT_USER);
      yield put({
        type: 'saveCurrentUser',
        payload: currentUser,
      });
      if (!currentUser) {
        yield put({ type: 'logout' });
        notification.error({
          message: '请先登录',
        });
      }
    },

    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      // if (!response.success) return;
      setAuthority('admin');
      // Login successful
      yield put({
        type: 'saveCurrentUser',
        payload: response.data.nickName,
      });
      yield setStorageItem(CURRENT_USER, response.data.nickName);
      yield setStorageItem(USER_TOKEN, response.data.token);
      reloadAuthorized();
      // Handling redirect
      const urlParams = new URL(window.location.href);
      let { redirect } = getPageQuery();
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          redirect = null;
        }
      }
      yield put(routerRedux.replace(redirect || '/'));
    },

    *logout(_, { put }) {
      // yield call(logout);
      yield removeStorageItems(USER_TOKEN, CURRENT_USER);
      yield put({
        type: 'saveCurrentUser',
        payload: {},
      });
      setAuthority('guest');
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          // search: stringify({
          //   redirect: window.location.href,
          // }),
        })
      );
    },
  },

  reducers: {
    saveCurrentUser(state, { payload }) {
      return {
        ...state,
        currentUser: payload || {},
      };
    },
  },
};
