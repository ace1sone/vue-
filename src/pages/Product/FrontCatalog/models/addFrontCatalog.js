import {
  addFrontCatalog,
  searchFirstCatalog,
  modifyFrontCatalogDetail,
  searchChildCatalog,
  getForeClassDetail,
  delLinksFrontCatalogDetail,
} from '@/services/frontCatalog';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

const defaultState = {};
export default {
  namespace: 'addFrontCatalog',
  state: {
    ...defaultState,
    loading: false,
  },

  effects: {
    *addCatalog({ payload }, { call, put }) {
      yield put({
        type: 'addReasult',
        loading: true,
      });
      try {
        const response = yield call(addFrontCatalog, payload);
        if (response.data) {
          message.success('新增成功');
          yield put(routerRedux.goBack());
        }
      } catch (error) {
        yield put({
          type: 'addReasult',
          loading: false,
        });
      }
    },
    *modifyCatalog({ payload }, { call, put }) {
      yield put({
        type: 'addReasult',
        loading: true,
      });

      try {
        const response = yield call(modifyFrontCatalogDetail, payload);
        if (response.data) {
          message.success('编辑成功');
          yield put(routerRedux.goBack());
        }
      } catch (error) {
        yield put({
          type: 'addReasult',
          loading: false,
        });
      }
    },
    *delLinksCatalog({ payload }, { call, put }) {
      yield put({
        type: 'addReasult',
        loading: true,
      });

      try {
        const response = yield call(delLinksFrontCatalogDetail, payload);
        if (response.data) {
          message.success('删除成功');
          yield put(routerRedux.goBack());
        }
      } catch (error) {
        yield put({
          type: 'addReasult',
          loading: false,
        });
      }
    },

    *fetchFirstCatalog({ payload }, { call }) {
      const { id, currForeId } = payload;
      const response = yield call(searchFirstCatalog, id, currForeId);
      return response;
    },
    *fetchChildCatalog({ payload }, { call }) {
      const { id } = payload;
      const response = yield call(searchChildCatalog, id);
      return response;
    },
    *foreCatalogDetail({ payload }, { call }) {
      const { id } = payload;
      const response = yield call(getForeClassDetail, id);
      return response;
    },
  },

  reducers: {
    cleanDatas(state) {
      return {
        ...state,
        loading: false,
      };
    },
    loadFetchBackCatalog(state, { payload }) {
      return {
        ...state,
        loading: false,
        catalogDatas: payload.data,
      };
    },
    updateData(state) {
      return {
        ...state,
      };
    },
    addReasult(state, { loading }) {
      return {
        ...state,
        loading,
      };
    },
  },
};
