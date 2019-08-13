import { getShelves, invDetail, prdDetail, saveInv, savePrd } from '@/services/shelve';

const defaultState = {
  data: [],
  invDetail: {
    list: [{ id: 3222, vv: 12, cc: '蓝', dd: 100 }],
  },
  prdDetail: {
    list: [{ id: 3222, vv: 12, cc: '蓝', dd: 100 }],
  },
};

export default {
  namespace: 'shelve',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *getShelves({ payload }, { call, put }) {
      // return {
      //   data: {
      //     current: 0,
      //     pages: 0,
      //     records: [
      //       {
      //         brandName: 'string',
      //         sellingStatus: 0,
      //         seriesName: 'string',
      //         shelfNum: 0,
      //         skuImg: 'string',
      //         spuId: 0,
      //         spuName: 'string',
      //       },
      //     ],
      //     size: 0,
      //     total: 0,
      //   },
      //   header: {
      //     code: 0,
      //     msg: 'string',
      //     transactionId: 'string',
      //   },
      // };
      const response = yield call(getShelves, payload);
      yield put({
        type: 'loadList',
        payload: response,
      });
    },

    *saveInv({ payload, success }, { call }) {
      const response = yield call(saveInv, payload);
      if (success) success(response);
    },

    *savePrd({ payload, success }, { call }) {
      const response = yield call(savePrd, payload);
      if (success) success(response);
    },

    *invDetail({ payload }, { call, put }) {
      const response = yield call(invDetail, payload);
      yield put({
        type: 'loadInvDetail',
        payload: response,
      });
    },

    *prdDetail({ payload }, { call, put }) {
      // const response = {
      //   data: {
      //     allServiceList: [
      //       {
      //         createdAt: '2019-06-04T05:47:43.389Z',
      //         createdBy: 0,
      //         delFlag: 0,
      //         detail: 'string',
      //         icon: 'string',
      //         id: 0,
      //         isUsed: true,
      //         name: 'string',
      //         updatedAt: '2019-06-04T05:47:43.389Z',
      //         updatedBy: 0,
      //       },
      //     ],
      //     brandName: 'string',
      //     jointServiceList: [
      //       {
      //         delFlag: 0,
      //         id: 0,
      //         skuId: 0,
      //         skuServiceIcon: 'string',
      //         skuServiceId: 0,
      //         skuServiceName: 'string',
      //         spuId: 0,
      //       },
      //     ],
      //     logList: [
      //       {
      //         createBy: 'string',
      //         createdAt: '2019-06-04T05:47:43.389Z',
      //         delFlag: 0,
      //         description: 'string',
      //         id: 0,
      //         operation: 'string',
      //         operationCode: 0,
      //         targetId: 0,
      //         type: 0,
      //         updateBy: 'string',
      //         updatedAt: '2019-06-04T05:47:43.389Z',
      //       },
      //     ],
      //     sellingStatus: 0,
      //     seriesName: 'string',
      //     skuImg: 'string',
      //     skuAvailableNumber: 11,
      //     skuRespList: [
      //       {
      //         basisList: [
      //           {
      //             basisId: 0,
      //             basisName: 'string',
      //             basisValue: 'string',
      //             createdBy: 0,
      //             delFlag: 0,
      //             id: 0,
      //             skuId: 0,
      //             type: 0,
      //           },
      //         ],
      //         createdBy: 0,
      //         delFlag: 0,
      //         id: 0,
      //         inventory: {
      //           createdBy: 0,
      //           delFlag: 0,
      //           id: 0,
      //           skuAvailableNumber: 0,
      //           skuFreezeNumber: 0,
      //           skuFreezingNumber: 0,
      //           skuId: 0,
      //           skuInventorySum: 0,
      //           skuShelvesSum: 0,
      //           skuStockNumber: 0,
      //           skuSum: 0,
      //           spuId: 0,
      //         },
      //         sellerId: 0,
      //         sellerName: 'string',
      //         sellingPrice: 'string',
      //         sellingStatus: 0,
      //         spuId: 0,
      //       },
      //     ],
      //     spuId: 2222,
      //     spuName: 'string',
      //   },
      //   header: {
      //     code: 0,
      //     msg: 'string',
      //     transactionId: 'string',
      //   },
      // };
      const response = yield call(prdDetail, payload);
      yield put({
        type: 'loadPrdDetail',
        payload: response,
      });
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
    loadInvDetail(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      return {
        ...state,
        invDetail: data || {},
        loading: false,
      };
    },
    loadPrdDetail(state, { payload }) {
      if (!payload) return defaultState;

      const { data } = payload;
      return {
        ...state,
        prdDetail: data || {},
        loading: false,
      };
    },
    clearDetail(state) {
      return {
        ...state,
        invDetail: {},
        prdDetail: {},
        loading: false,
      };
    },
  },
};
