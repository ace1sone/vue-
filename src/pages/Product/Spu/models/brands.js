import { getBrands } from '@/services/product';
import { seriesByBrandSearch } from '@/services/props';

const defaultSeriesList = [
  {
    label: '空',
    value: '',
  },
];

export default {
  namespace: 'spuBrands',

  state: {
    size: 10,
    records: [],
    series: {
      list: defaultSeriesList,
    },
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(getBrands, payload);
      yield put({
        type: 'loadList',
        payload: response.data,
      });
    },
    *seriesByBrandSearch({ payload }, { call, put }) {
      const response = yield call(seriesByBrandSearch, payload);
      yield put({
        type: 'saveSeries',
        payload: response.data,
      });
    },
  },

  reducers: {
    loadList(state, { payload }) {
      return { ...state, ...payload };
    },
    saveSeries(state, { payload }) {
      return {
        ...state,
        series: {
          ...payload,
          list: defaultSeriesList.concat(payload.seriesList.map(__ => ({ ...__, value: __.id, label: __.englishName }))),
        },
      };
    },
    clearSeries(state) {
      return {
        ...state,
        series: {
          list: [],
        },
      };
    },
  },
};
