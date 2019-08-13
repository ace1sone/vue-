/* eslint-disable */
import { inject } from '@/config';

export default {
  namespace: 'sys',
  state: {},
  effects: {
    *error({ payload: e }) {
      yield console.error('error:', e);
    },
  },
  reducers: {
    networkError(state, _) {
      const utilService = inject('utilService');
      utilService.toast('网络可能出现了问题。');
      return state;
    },
    tokenExpired(state, { payload }) {
      const utilService = inject('utilService');
      // const userService = inject('userService');
      // userService._deleteToken();
      utilService.handleLogin();
      return state;
    },
    serviceUnavailable(state, { payload }) {
      const utilService = inject('utilService');
      utilService.alert('系统维护中。');
      return state;
    },
    resultSucceed(state, { payload }) {
      // let message = result.msg;
      // if (!_.isEmpty(message)) this.utilService.toast(message, { type: 'success' });
      return state;
    },
    resultFailed(state, { payload }) {
      const utilService = inject('utilService');
      if (!payload) return;
      // payload = Utils.parseJson(payload);
      const message = payload.message || payload.errCode || '访问服务出错';
      utilService.alert(message, { type: 'error' });
      return state;
    },
  },
};
