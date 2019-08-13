import { getFrontCatalog, modifyFrontCatalog, searchFrontCatalog, getBackItemDetail } from '@/services/frontCatalog';
import _ from 'lodash';

const defaultState = {
  catalogDatas: [[], [], [], []],
  catalogUnsignedNums: [],
  selectedCatalogIds: [],
  catalogLevelLoadings: [],
  catalogModifyLoadings: {},
  backItemUseRate: 0,
};

export default {
  namespace: 'frontCatalog',
  state: {
    ...defaultState,
  },

  effects: {
    *fetchFrontCatalog({ payload }, { call, put }) {
      const { parentClassId, level } = payload;
      if (!parentClassId || parentClassId === 0) {
        yield put({
          type: 'clearFrontCatalogPage',
        });
      }
      yield put({
        type: 'updateCatalogLevelLoading',
        payload: { level, loading: true },
      });
      const response = yield call(getFrontCatalog, parentClassId);
      yield put({
        type: 'loadFetchFrontCatalog',
        payload: { response, parentClassId, level },
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
        type: 'fetchFrontCatalog',
        payload: fetchPayload,
      });
    },
    *modifyCatalog({ payload }, { call, put }) {
      const { params, id, level } = payload;
      yield put({
        type: 'updataCatalogLoading',
        payload: { id, loading: true },
      });
      const response = yield call(modifyFrontCatalog, params);
      yield put({
        type: 'doUpdateCatalog',
        payload: { response, params, id, level },
      });
    },
    *searchFrontCatalog({ payload }, { call, put }) {
      const { searchWord } = payload;
      yield put({
        type: 'clearFrontCatalogPage',
      });
      const response = yield call(searchFrontCatalog, searchWord);
      yield put({
        type: 'loadSearchCatalog',
        payload: { response },
      });
    },
    *foreCatalogWithBackItemDetail({ payload }, { call }) {
      const { id } = payload;
      const response = yield call(getBackItemDetail, id);
      return response;
    },
  },

  reducers: {
    clearFrontCatalogPage(state) {
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
    loadFetchFrontCatalog(state, { payload }) {
      const { response, level } = payload;
      const { catalogLevelLoadings, catalogUnsignedNums } = state;
      catalogLevelLoadings[level] = false;
      if (!_.isArray(response.data.classRelationDTOList)) {
        return {
          ...state,
          catalogLevelLoadings,
        };
      }

      const { classRelationDTOList, leftNum } = response.data;
      const levelIndex = level - 1;
      const catalogDatas = _.slice(state.catalogDatas, 0, levelIndex);
      catalogDatas[levelIndex] = classRelationDTOList;
      catalogUnsignedNums[levelIndex] = leftNum;
      const backItemUseRate = levelIndex === 0 ? response.data.backItemUseRate : state.backItemUseRate;
      return {
        ...state,
        catalogDatas,
        catalogLevelLoadings,
        backItemUseRate,
      };
    },
    loadSearchCatalog(state, { payload }) {
      const { response } = payload;
      if (!response || !response.data) return defaultState;

      const catalogDTOList = response.data.classRelationDTOList;
      const catalogDatas = [[], [], [], []];
      const selectedCatalogIds = [];
      if (_.isArray(catalogDTOList)) {
        catalogDTOList.forEach(catalog => {
          catalogDatas[catalog.level - 1].push(catalog);
          if (catalog.level >= 2) {
            selectedCatalogIds[catalog.level - 2] = catalog.parentId;
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
      const { parentClassId, level } = payload;
      const levelIndex = level - 1;
      const catalogDatas = _.slice(state.catalogDatas, 0, levelIndex + 1);
      const selectedCatalogIds = _.slice(state.selectedCatalogIds, 0, levelIndex);
      selectedCatalogIds[levelIndex] = parentClassId;
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
