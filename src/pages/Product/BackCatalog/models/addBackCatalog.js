import {
  addBackCatalog,
  fetchSpecData,
  fetchParAttrisData,
  backCatalogDetail,
  checkSpuByBackClass,
  downSpu,
  delCatalog,
  checkForeByClass,
} from '@/services/backCatalog';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

const defaultState = {};

export default {
  namespace: 'addBackCatalog',
  state: {
    ...defaultState,
  },

  effects: {
    *fetchParAttrisData({ payload }, { call }) {
      const response = yield call(fetchParAttrisData, payload);
      return response;
    },
    *backCatalogDetail({ payload }, { call }) {
      const { id } = payload;
      const response = yield call(backCatalogDetail, id);
      return response;
    },
    *checkSpuByBackClass({ payload }, { call }) {
      const response = yield call(checkSpuByBackClass, payload);
      return response;
    },
    *checkForeByClassId({ payload }, { call }) {
      const { id } = payload;
      const response = yield call(checkForeByClass, id);
      return response;
    },
    *downSpu({ payload }, { call }) {
      const response = yield call(downSpu, payload);
      return response;
    },
    *fetchSpec({ payload }, { call }) {
      const response = yield call(fetchSpecData, payload);
      return response;
    },
    *delCatalog({ payload }, { call, put }) {
      yield put({
        type: 'updateReasult',
        loading: true,
      });
      let reasult;
      try {
        const response = yield call(delCatalog, payload);
        reasult = response;
      } catch (error) {
        reasult = error;
      }
      yield put({
        type: 'updateReasult',
        loading: false,
      });
      return reasult;
    },
    *addCatalog({ payload }, { call, put }) {
      yield put({
        type: 'updateReasult',
        loading: true,
      });
      try {
        const response = yield call(addBackCatalog, payload);
        if (response.data) {
          if (payload.id) {
            message.success('编辑成功');
          } else {
            message.success('新增成功');
          }

          yield put(routerRedux.goBack());
        }
      } catch (error) {
        yield put({
          type: 'updateReasult',
          loading: false,
        });
      }
    },
  },

  reducers: {
    cleanDatas(state) {
      return {
        ...state,
        loading: false,
      };
    },

    updateReasult(state, { loading }) {
      return {
        ...state,
        loading,
      };
    },
  },
};
