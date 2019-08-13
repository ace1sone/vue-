import {
  getBackCatalog,
  changeStatus,
  searchCatalog,
  backCatalogDetail,
  spuListByBackClassId,
  modifySpuNewBackItem,
  checkForeByClass,
} from '@/services/backCatalog';
import _ from 'lodash';

const defaultState = {
  catalogDatas: [[], [], [], []],
  selectedCatalogIds: [],
  catalogLevelLoadings: [],
  catalogModifyLoadings: {},
};

export default {
  namespace: 'backCatalog',
  state: {
    ...defaultState,
  },

  effects: {
    *fetchBackCatalog({ payload }, { call, put }) {
      const { id, level } = payload;
      if (!id || id === 0) {
        yield put({
          type: 'clearBackCatalogPage',
        });
      }
      yield put({
        type: 'updateCatalogLevelLoading',
        payload: { level, loading: true },
      });
      const response = yield call(getBackCatalog, id);
      yield put({
        type: 'loadFetchBackCatalog',
        payload: { response, id, level },
      });
    },
    *selectCatalog({ payload }, { put }) {
      yield put({
        type: 'doSelectCatalog',
        payload,
      });
      const fetchPayload = {
        ...payload,
        level: payload.level + 1,
      };
      yield put({
        type: 'fetchBackCatalog',
        payload: fetchPayload,
      });
    },
    *changeStatus({ payload }, { call, put }) {
      const { params, id, level } = payload;
      yield put({
        type: 'updataCatalogLoading',
        payload: { id, loading: true },
      });
      const response = yield call(changeStatus, params);
      yield put({
        type: 'doUpdateCatalog',
        payload: { response, params, id, level },
      });
    },
    *searchCatalog({ payload }, { call, put }) {
      const { searchWord } = payload;
      yield put({
        type: 'clearBackCatalogPage',
      });
      const response = yield call(searchCatalog, searchWord);
      yield put({
        type: 'loadSearchCatalog',
        payload: { response },
      });
    },
    *backCatalogDetail({ payload }, { call }) {
      const { id } = payload;
      const response = yield call(backCatalogDetail, id);
      return response;
    },
    *catalogParentSpuList({ payload }, { call }) {
      const { id } = payload;
      const response = yield call(spuListByBackClassId, id);
      return response;
    },
    *modifySpuNewBackItem({ payload }, { call }) {
      const { params } = payload;
      const response = yield call(modifySpuNewBackItem, params);
      return response;
    },
    *checkForeByClassId({ payload }, { call }) {
      const { id } = payload;
      const response = yield call(checkForeByClass, id);
      return response;
    },
  },

  reducers: {
    clearBackCatalogPage(state) {
      return {
        state,
        ...defaultState,
      };
    },
    updateCatalogLevelLoading(state, { payload }) {
      const { level, loading } = payload;
      const { catalogLevelLoadings } = state;
      catalogLevelLoadings[level] = loading;
      return {
        ...state,
        catalogLevelLoadings,
      };
    },
    loadFetchBackCatalog(state, { payload }) {
      const { response, level } = payload;
      const { catalogLevelLoadings } = state;
      catalogLevelLoadings[level] = false;
      if (!_.isArray(response.data)) {
        return {
          ...state,
          catalogLevelLoadings,
        };
      }

      const { data } = response;
      const levelIndex = level - 1;
      const catalogDatas = _.slice(state.catalogDatas, 0, levelIndex);
      catalogDatas[levelIndex] = data;
      return {
        ...state,
        catalogDatas,
        catalogLevelLoadings,
      };
    },
    loadSearchCatalog(state, { payload }) {
      const { response } = payload;
      if (!response || !response.data) return defaultState;

      const catalogDTOList = response.data;
      const catalogDatas = [[], [], [], []];
      const selectedCatalogIds = [];
      if (_.isArray(catalogDTOList)) {
        catalogDTOList.forEach(catalog => {
          catalogDatas[catalog.level - 1].push(catalog);
          if (catalog.level >= 2) {
            selectedCatalogIds[catalog.level - 2] = catalog.parentClassId;
          }
        });
      }
      return {
        ...state,
        catalogDatas,
        selectedCatalogIds,
      };
    },
    doSelectCatalog(state, { payload }) {
      const { id, level } = payload;
      const levelIndex = level - 1;
      const catalogDatas = _.slice(state.catalogDatas, 0, levelIndex + 1);
      const selectedCatalogIds = _.slice(state.selectedCatalogIds, 0, levelIndex);
      selectedCatalogIds[levelIndex] = id;
      return {
        ...state,
        catalogDatas,
        selectedCatalogIds,
      };
    },
    updataCatalogLoading(state, { payload }) {
      const { id, loading } = payload;
      const { catalogModifyLoadings } = state;
      if (loading) {
        catalogModifyLoadings[id] = loading;
      } else {
        delete catalogModifyLoadings[id];
      }
      return {
        ...state,
        catalogModifyLoadings,
      };
    },
    doUpdateCatalog(state, { payload }) {
      const { response, params, id, level } = payload;
      const { catalogModifyLoadings } = state;
      delete catalogModifyLoadings[id];

      if (response && response.data === true) {
        const levelIndex = level - 1;
        const catalogList = state.catalogDatas[levelIndex];
        const itemIndex = _.findIndex(catalogList, ['id', id]);
        if (itemIndex !== -1) {
          catalogList[itemIndex] = {
            ...catalogList[itemIndex],
            ...params,
          };
          return {
            ...state,
            catalogDatas: [...state.catalogDatas],
            catalogModifyLoadings,
          };
        }
      }
      return {
        ...state,
        catalogModifyLoadings,
      };
    },
  },
};
