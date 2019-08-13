import axios from 'axios';
import { notification } from 'antd';
// import { routerRedux } from 'dva/router';
// import _ from 'lodash';
import { getGuid } from '@/utils/utils';
import { getStorageItem } from '@/utils/localStorage';
import Config from '@/config/Config';
import { USER_TOKEN, NETWORK_TIMEOUT } from '../constants';

const ERROR_CODE_MENU = {
  400: '请求参数错误',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  413: 'Request Entity Too Large',
  408: 'Request Timeout',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: '服务器维护中',
  504: 'Gateway Timeout',
  503: '服务器维护中',
  505: 'HTTP Version Not Supported',
};

const getCommonHead = () => ({
  authToken: getStorageItem(USER_TOKEN),
  channel: '110',
  client: '',
  deviceType: '3', // 1 ios，2 android，3 pc，4 h5，5小程序
  transactionId: getGuid(),
});

const { CancelToken } = axios;
const source = CancelToken.source();

const defaultRequestOptions = {
  baseURL: Config.baseURL,
  timeout: NETWORK_TIMEOUT,
  cancelToken: source.token,
};

axios.interceptors.request.use(config => {
  const newConfig = {
    ...config,
    headers: {
      // ...commonHead,
      ...config.headers,
    },
  };
  return newConfig;
});

axios.interceptors.response.use(
  response => {
    const { data, config } = response;

    if (config && config.action === 'download/xlsx') {
      return response;
    }

    // download file
    if (response.status === 200) {
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.length > 0) {
        const matchResult = disposition.match(/filename="?(.+)"?/);
        if (matchResult.length === 2) {
          const filename = matchResult[1];
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          return response;
        }
      }
    }

    if (data.header && data.header.code === 4001) {
      notification.error({
        message: '未登录或登录已过期，请重新登录。',
      });
      // @HACK
      /* eslint-disable no-underscore-dangle */
      window.g_app._store.dispatch({
        type: 'user/logout',
      });
      return response;
    }

    if (data.header && data.header.code !== 2000 && data.header.code !== 4050 && data.header.msg !== '4050') {
      notification.error({ message: data.header.msg || '出错了，稍后再试' });
      return Promise.reject(response.data.header.msg);
    }
    const token = response.headers['x-auth-token'] || '';
    if (token) {
      window.localStorage.setItem(USER_TOKEN, token);
    }
    // mock APIs all have /api/ prefix. if mock API is used...
    // if (response.request.responseURL.indexOf('/api/') !== -1) {
    //   return response.data;
    // }
    return {
      ...response.data,
      message: data.header ? data.header.msg : '',
      success: data.header && data.header.code === 2000,
    };
  },
  error => {
    const response = error.response || {};
    const { status, config } = response;
    const DEFAULT_ERROR = '未知错误';
    const ERROR = ERROR_CODE_MENU[status] || DEFAULT_ERROR;
    // hack 上传bug
    if (config && config.action === 'upload') {
      notification.error({
        message: ERROR,
      });
      return Promise.reject(error);
    }
    if (status === 400) {
      notification.error({
        message: ERROR,
      });
      return Promise.reject(error);
    }

    if (status === 401) {
      notification.error({
        message: '未登录或登录已过期，请重新登录。',
      });
      // @HACK
      /* eslint-disable no-underscore-dangle */
      window.g_app._store.dispatch({
        type: 'user/logout',
      });
      return Promise.reject(error);
    }

    if (status === 403) {
      // window.g_app._store.dispatch(routerRedux.push('/exception/403'));
      return Promise.reject(error);
    }
    if (status <= 504 && status >= 500) {
      notification.error({
        message: ERROR,
      });
      // window.g_app._store.dispatch(routerRedux.push('/exception/500'));
      return Promise.reject(error);
    }
    if (status >= 404 && status < 422) {
      notification.error({
        message: ERROR,
      });
      // window.g_app._store.dispatch(routerRedux.push('/exception/404'));
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

function handleRequestOptions(options) {
  const { method = 'GET', data, action, ...otherProps } = options;
  const uppercaseMethod = method.toUpperCase();
  const newOptions = { ...defaultRequestOptions, ...otherProps, method: uppercaseMethod };
  const commonHead = getCommonHead();

  if (action === 'download/xlsx') {
    Object.assign(newOptions, { action: 'download/xlsx' });
  }
  // hack 上传bug
  const newData = action === 'upload' ? data : { ...data, header: commonHead };
  if (uppercaseMethod === 'POST' || uppercaseMethod === 'PUT' || uppercaseMethod === 'PATCH') {
    return {
      ...newOptions,
      data: newData,
    };
  }
  if (uppercaseMethod === 'DELETE' || uppercaseMethod === 'GET') {
    return {
      ...newOptions,
      params: data,
    };
  }
  return newOptions;
}

function request(...args) {
  let options = {};
  if (args.length === 1) {
    options = { url: args };
  }
  if (args.length === 2) {
    const [url, opt] = args;
    options = { url, ...opt };
  }
  if (args.length === 3) {
    const [url, method, opt] = args;
    options = { url, method, ...opt };
  }
  return axios.request(handleRequestOptions(options)).catch(error => error);
}

export default request;
