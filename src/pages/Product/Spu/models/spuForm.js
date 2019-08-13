import { saveSpu, updateSpu, getSpu, modifySpuStatus } from '@/services/product';
import moment from 'moment';
import _ from 'lodash';
import qs from 'query-string';
import { routerRedux } from 'dva/router';
import { getGuid } from '@/utils/utils';

let oldSpuFromServer = {
  oldPlace: [],
};

const defaultSpuEnglishAlias = [
  {
    id: getGuid(),
    fildValue: '',
  },
];

const defaultSpuChineseAlias = [
  {
    id: getGuid(),
    fildValue: '',
  },
];

const defaultState = {
  status: 1, // 启用 1，禁用 0
  backItem: null, // 后台类目 {name,id}
  brandId: '', // 品牌ID
  brand: null, // 品牌 {id name}
  seriesId: undefined, // 系列ids
  spuEnglishName: '', // SPU英文名（官方）
  spuSubEnglishName: '', // SPU英文名（副名）
  spuChineseName: '', // SPU中文名
  spuSubChineseName: '', // SPU中文名（副名）
  spuEnglishAlias: defaultSpuEnglishAlias, // SPU英文别名
  spuChineseAlias: defaultSpuChineseAlias, // SPU中文别名
  place: [], // 产地
  country: '', // 发售国家
  sectionNumber: '', // 品牌自有款号
  saleSeason: '', // 发售季节
  // saleTime: undefined, // 发售时间
  deployTime: undefined, // 发售时间时间戳
  salePrice: undefined, // 发售价格
  coinUnit: undefined, // 货币单位
  skuUnit: undefined, // sku单位
  salePeople: undefined, // 适用性别
  saleAge: undefined, // 适用年龄层
  chineseIntroduction: undefined, // 文字介绍（中文）
  englishIntroduction: undefined, // 文字介绍（英文）
  whiteBg: [], // 白底图
  poster: [], // SPU海报图
  detail: [], // SPU细节图
  spec: [], // 关联规格
  desc: [], // 关联描述
};

const IMG_ENUM = {
  LOGO: 1,
  WHITE_BG: 2,
  OTHER: 3,
  POSTER: 4,
  DETAIL: 5,
};

const SPU_JOIN_ENUM = {
  SPEC: 1,
  DESC: 2,
  BRAND: 3,
};

const SPU_ATTACH_ENUM = {
  ENGLISH_NAME: 1,
  CHINESE_NAME: 2,
  PLACE: 3,
};

const STATUS_ENUM = {
  ENABLE: 0,
  DELETE: 1,
  DISABLE: 3,
};

// function formatSpuShowDTOList(imgs = [], type, actionStatus, delFlag = STATUS_ENUM.ENABLE) {
//   const SPU_IMG_MODULENAME = ['', 'logo大图', '白底图', '其他', '海报', '细节图'];
//   // 1-logo大图，2-白底图，3-其他，4-海报，5-细节图
//   return imgs.map((wbg, i) =>
//     actionStatus === 'edit' && wbg.id
//       ? {
//           delFlag,
//           id: wbg.id,
//           url: wbg.url,
//           moduleName: SPU_IMG_MODULENAME[type],
//           moduleCode: type,
//         }
//       : { url: wbg.url, moduleName: SPU_IMG_MODULENAME[type], moduleCode: type, isDefault: i === 0 ? 1 : 2, delFlag: 0 }
//   );
// }

function formatSpuShowDTOList(imgs = [], type, actionStatus, idKey) {
  const SPU_IMG_MODULENAME = ['', 'logo大图', '白底图', '其他', '海报', '细节图'];
  // 1-logo大图，2-白底图，3-其他，4-海报，5-细节图
  if (imgs.length === 0) return null;
  return actionStatus === 'edit'
    ? {
        id: oldSpuFromServer[idKey],
        urls: imgs.map(__ => __.url),
        moduleName: SPU_IMG_MODULENAME[type],
        moduleCode: type,
      }
    : {
        urls: imgs.map(__ => __.url),
        moduleName: SPU_IMG_MODULENAME[type],
        moduleCode: type,
      };
}

function formatSpuAttachDTOList(attach = [], type, actionStatus, delFlag = STATUS_ENUM.ENABLE) {
  const SPU_ATTACT_MODULENAME = ['', '英文别名', '中文别名', '产地'];
  const getNewObject = at =>
    SPU_ATTACH_ENUM.PLACE === type
      ? {
          fieldCode: type,
          fieldName: SPU_ATTACT_MODULENAME[type],
          fildValue: at.fildValue,
        }
      : {
          fieldCode: type,
          fieldName: SPU_ATTACT_MODULENAME[type],
          id: _.isString(at.id) ? null : at.id,
          fildValue: at.fildValue,
        };

  // 1-英文别名，2-中文别名，3-产地
  return attach.map(at =>
    actionStatus === 'edit'
      ? {
          fieldCode: type,
          fieldName: SPU_ATTACT_MODULENAME[type],
          fildValue: at.fildValue,
          id: _.isString(at.id) ? null : at.id,
          delFlag,
        }
      : getNewObject(at)
  );
}

function formatSpuJointDTOList(joinList = [], type, actionStatus, delFlag = STATUS_ENUM.ENABLE) {
  return joinList.map(jl =>
    actionStatus === 'edit'
      ? {
          delFlag,
          id: jl.compareId || jl.id,
          type,
          subJointId: jl.subJointId,
          jointId: jl.jointId || jl.id,
          jointName: jl.name || jl.jointName,
        }
      : {
          type,
          jointId: jl.jointId || jl.id,
          jointName: jl.name || jl.jointName,
          subJointId: jl.subJointId,
        }
  );
}

function compareAttachDifferenceData(newArray = [], oldArray = [], action, type, handler, compareKey = 'id') {
  if (_.isEmpty(newArray)) {
    return [];
  }
  const handleNewArray = newArray.map(__ => {
    const fValue = oldArray.find(___ => ___.fildValue === __.fildValue);
    if (fValue) {
      return fValue;
    }
    return __;
  });
  const handlerNewArray = handler(handleNewArray, type, action);
  if (action !== 'edit' || _.isEmpty(oldArray)) {
    return handlerNewArray;
  }
  const differenceData = oldArray.reduce((pre, curr) => {
    if (!newArray.find(__ => __[compareKey] === curr[compareKey])) {
      pre.push(curr);
      return pre;
    }
    return pre;
  }, []);
  return [...handlerNewArray, ...handler(differenceData, type, action, STATUS_ENUM.DELETE)];
}

function compareDifferenceData(newArray = [], oldArray = [], action, type, handler, compareKey = 'id') {
  if (_.isEmpty(newArray)) {
    return handler(oldArray, type, action, STATUS_ENUM.DELETE);
  }
  const handlerNewArray = handler(newArray, type, action);
  if (action !== 'edit' || _.isEmpty(oldArray)) {
    return handlerNewArray;
  }
  const differenceData = oldArray.reduce((pre, curr) => {
    if (!newArray.find(__ => __[compareKey] === curr[compareKey])) {
      pre.push(curr);
      return pre;
    }
    return pre;
  }, []);
  return [...handlerNewArray, ...handler(differenceData, type, action, STATUS_ENUM.DELETE)];
}

function dataToServerData(newData, oldData, key, action, type, handler) {
  const newArray = _.get(newData, key) || [];
  const oldArray = _.get(oldData, key) || [];
  return compareDifferenceData(newArray, oldArray, action, type, handler);
}

function handleNameAndOfficial(obj = {}, nameKey, checkedlKey) {
  const { name, isChecked } = obj;
  if (!name) {
    return {
      [nameKey]: undefined,
    };
  }
  return {
    [nameKey]: name,
    [checkedlKey]: isChecked,
  };
}

function handleNameToState(name, isChecked) {
  if (!name) {
    return {
      name: undefined,
      isChecked: undefined,
    };
  }
  return {
    name,
    isChecked,
  };
}

function formatSpuToServer(values, action) {
  const {
    backItem,
    spuEnglishName, // SPU英文名（官方）
    spuEnglishAlias, // SPU英文别名
    spuChineseAlias, // SPU中文别名
    chineseIntroduction,
    englishIntroduction,
    coinUnit,
    skuUnit,
    country,
    place,
    saleAge,
    salePeople,
    salePrice,
    saleSeason,
    deployTime,
    sectionNumber,
    seriesId,
    seriesEnglishName,
    status,
    brand,
    id: spuId,
    desc,
    spuSubEnglishNameItem,
    spuChineseNameItem,
    spuSubChineseNameItem,
    whiteBg,
    poster,
    detail,
  } = values;
  const { id, name } = backItem || {};
  const formatPlace = place.length >= 1 ? place[0] : undefined;
  const filterSpuEnglishAlias = spuEnglishAlias.filter(__ => __.fildValue);
  const filterSpuChineseAlias = spuChineseAlias.filter(__ => __.fildValue);
  const formatSpuEnglishAlias = filterSpuEnglishAlias.length >= 1 ? filterSpuEnglishAlias[0].fildValue : undefined;
  const formatSpuChineseAlias = filterSpuChineseAlias.length >= 1 ? filterSpuChineseAlias[0].fildValue : undefined;
  const handleName = {
    ...handleNameAndOfficial(spuSubEnglishNameItem, 'spuSubEnglishName', 'isSubEnglishName'),
    ...handleNameAndOfficial(spuChineseNameItem, 'spuChineseName', 'isChineseName'),
    ...handleNameAndOfficial(spuSubChineseNameItem, 'spuSubChineseName', 'isSubChineseName'),
  };
  const proSpuDTO = {
    backItemId: id, // 后台类目ID
    backItemName: name,
    chineseIntroduction,
    englishIntroduction,
    coinUnit,
    country,
    place: formatPlace,
    saleAge,
    salePeople,
    salePrice,
    saleSeason,
    saleTime: deployTime.toDate(),
    deployTime: deployTime.valueOf(),
    sectionNumber,
    seriesId,
    seriesEnglishName,
    spuEnglishName,
    spuEnglishAlias: formatSpuEnglishAlias,
    spuChineseAlias: formatSpuChineseAlias,
    status,
    skuUnit,
    brandId: brand ? brand.id : null,
    brandEnglishName: brand ? brand.name : null,
    ...handleName,
  };
  // 编辑
  if (spuId) {
    proSpuDTO.id = spuId;
  }
  // type 关联类型 1-规格 2-描述 3-品牌
  const spuJointDTOList = [];
  const spuAttachDTOList = [];
  const spuShowDTOList = [];

  // spuShowDTOList.push(
  //   ...dataToServerData(values, oldSpuFromServer, 'whiteBg', action, IMG_ENUM.WHITE_BG, formatSpuShowDTOList),
  //   ...dataToServerData(values, oldSpuFromServer, 'poster', action, IMG_ENUM.POSTER, formatSpuShowDTOList),
  //   ...dataToServerData(values, oldSpuFromServer, 'detail', action, IMG_ENUM.DETAIL, formatSpuShowDTOList)
  // );

  spuShowDTOList.push(
    formatSpuShowDTOList(whiteBg, IMG_ENUM.WHITE_BG, action, 'whiteBgId'),
    formatSpuShowDTOList(poster, IMG_ENUM.POSTER, action, 'posterId'),
    formatSpuShowDTOList(detail, IMG_ENUM.DETAIL, action, 'detailId')
  );

  function getNewValueAndSlice(arrs = [], key = 'fildValue') {
    return arrs.slice(1).map(__ => ({
      [key]: __,
    }));
  }
  const newPlace = getNewValueAndSlice(place);
  const newSpuEnglishAlias = filterSpuEnglishAlias.slice(1);
  const newSpuChineseAlias = filterSpuChineseAlias.slice(1);
  const serverPlace = compareAttachDifferenceData(
    newPlace,
    oldSpuFromServer.addPlace,
    action,
    SPU_ATTACH_ENUM.PLACE,
    formatSpuAttachDTOList,
    'fildValue'
  );
  const serverSpuEnglishAlias = compareDifferenceData(
    newSpuEnglishAlias,
    oldSpuFromServer.addSpuEnglishAlias,
    action,
    SPU_ATTACH_ENUM.ENGLISH_NAME,
    formatSpuAttachDTOList
  );
  const serverSpuChineseAlias = compareDifferenceData(
    newSpuChineseAlias,
    oldSpuFromServer.addSpuChineseAlias,
    action,
    SPU_ATTACH_ENUM.CHINESE_NAME,
    formatSpuAttachDTOList
  );
  spuAttachDTOList.push(...serverPlace, ...serverSpuEnglishAlias, ...serverSpuChineseAlias);

  // const newBrand = brand
  //   ? compareDifferenceData([brand], oldSpuFromServer.brand, action, SPU_JOIN_ENUM.BRAND, formatSpuJointDTOList, 'compareId')
  //   : [];
  const newDesc = desc.reduce((pre, curr) => {
    const newResult = curr.attrs.map(__ => ({ ...curr, subJointId: __.selected || __.id, compareId: __.compareId, id: __.id }));
    return [...pre, ...newResult];
  }, []);
  const serverSpec = dataToServerData(values, oldSpuFromServer, 'spec', action, SPU_JOIN_ENUM.SPEC, formatSpuJointDTOList);
  const serverDesc = compareDifferenceData(newDesc, oldSpuFromServer.oldDesc, action, SPU_JOIN_ENUM.DESC, formatSpuJointDTOList, 'subJointId');
  // spuJointDTOList.push(...newBrand, ...serverSpec, ...serverDesc);
  spuJointDTOList.push(...serverSpec, ...serverDesc);

  return {
    proSpuDTO,
    spuAttachDTOList,
    spuShowDTOList,
    spuJointDTOList,
  };
}

function formatBrand(brands = [], type) {
  const brandsArr = brands.filter(item => item.type === SPU_JOIN_ENUM.BRAND);
  if (type === 'all') {
    return brandsArr.map(__ => ({ ...__, compareId: __.id }));
  }
  const brand =
    brandsArr.length > 0
      ? {
          id: brandsArr[0].jointId || brandsArr[0].id,
          jointId: brandsArr[0].jointId,
          compareId: brandsArr[0].id,
          name: brandsArr[0].jointName,
        }
      : null;
  return brand;
}

function formatServerSpuToState(spuFromSpu) {
  const { proSpuDTO, spuShowDTOList, spuJointDTOList, spuAttachDTOList, spuId, totalSpuSpecList = [], totalSpuDescList = [] } = spuFromSpu;
  const newTotalSpuSpecList = totalSpuSpecList.filter(__ => __);
  const newTotalSpuDescList = totalSpuDescList.filter(__ => __);
  const {
    spuEnglishAlias, // SPU英文别名
    spuChineseAlias, // SPU中文别名
    place,
    saleTime,
    backItemId, // 后台类目ID
    backItemName,
    salePeople,
    coinUnit,
    skuUnit,
    saleAge,
    spuSubEnglishName, // SPU英文名（副名）
    spuChineseName, // SPU中文名
    spuSubChineseName, // SPU中文名（副名）
    isSubEnglishName, // SPU英文名（副名）
    isChineseName, // SPU中文名
    isSubChineseName, // SPU中文名（副名）
    delFlag,
    brandId,
    brandEnglishName,
    seriesId,
    // deployTime,
    ...otherProSpuDTO
  } = proSpuDTO;
  const addSpuEnglishAlias = spuAttachDTOList.filter(item => item.fieldCode - 0 === SPU_ATTACH_ENUM.ENGLISH_NAME);
  const addSpuChineseAlias = spuAttachDTOList.filter(item => item.fieldCode - 0 === SPU_ATTACH_ENUM.CHINESE_NAME);
  const addPlace = spuAttachDTOList.filter(item => item.fieldCode - 0 === SPU_ATTACH_ENUM.PLACE);
  const newPlace = addPlace.map(__ => __.fildValue);
  // const newSpuEnglishAlias = addSpuEnglishAlias.map(__ => __.fildValue);
  // const newSpuChineseAlias = addSpuChineseAlias.map(__ => __.fildValue);
  const backItem = {
    id: backItemId,
    name: backItemName,
  };
  const desc = spuJointDTOList.filter(item => item.type === SPU_JOIN_ENUM.DESC);
  const newDesc = desc.reduce((pre, curr) => {
    const fDesc = pre.find(__ => __.jointId === curr.jointId);
    const fNewTotalSpuDescList = newTotalSpuDescList.find(tsdl => tsdl.id === curr.jointId);
    const { descSubsetDTOList = [] } = fNewTotalSpuDescList || {};
    const fDescSubsetDTOList = descSubsetDTOList.find(dsdl => dsdl.id === curr.subJointId);
    let newAttr = null;
    if (fNewTotalSpuDescList) {
      newAttr = {
        key: curr.id,
        id: curr.id,
        selected: curr.subJointId,
        compareId: curr.id,
        name: fDescSubsetDTOList ? fDescSubsetDTOList.name : undefined,
        allSelectArr: descSubsetDTOList,
        tableDataSource: fDescSubsetDTOList ? fDescSubsetDTOList.descSubsetDetailDTOList : [],
      };
    }
    if (fDesc) {
      fDesc.attrs.push({ ...newAttr });
      return [...pre];
    }
    const attrs = newAttr ? [newAttr] : undefined;
    const defaultDesc = {
      ...curr,
      attrs,
      name: curr.jointName,
      descSubsetDTOList,
    };
    return pre.concat(defaultDesc);
  }, []);

  // const brand = formatBrand(spuJointDTOList);
  const brand = brandId
    ? {
        id: brandId,
        name: brandEnglishName,
      }
    : null;
  const spuSubEnglishNameItem = handleNameToState(spuSubEnglishName, isSubEnglishName);
  const spuChineseNameItem = handleNameToState(spuChineseName, isChineseName);
  const spuSubChineseNameItem = handleNameToState(spuSubChineseName, isSubChineseName);

  function serverImgsToShowData(serverImgs = [], type) {
    return serverImgs
      .filter(__ => __.moduleCode === type)
      .reduce((pre, next) => pre.concat(next.url.split(',').map(__ => ({ ...next, url: __ }))), []);
  }

  const whiteBg = serverImgsToShowData(spuShowDTOList, IMG_ENUM.WHITE_BG);
  const poster = serverImgsToShowData(spuShowDTOList, IMG_ENUM.POSTER);
  const detail = serverImgsToShowData(spuShowDTOList, IMG_ENUM.DETAIL);

  const newState = {
    ...otherProSpuDTO,
    seriesId: seriesId || '',
    delFlag: delFlag - 0,
    spuSubEnglishNameItem,
    spuChineseNameItem,
    spuSubChineseNameItem,
    salePeople: salePeople - 0,
    coinUnit: coinUnit - 0,
    skuUnit: skuUnit - 0,
    saleAge: saleAge - 0,
    // saleTime: moment(saleTime, 'YYYY-MM-DD'),
    deployTime: moment(saleTime, 'YYYY-MM-DD'),
    spuId,
    backItem,
    // whiteBg: spuShowDTOList.filter(item => item.moduleCode === IMG_ENUM.WHITE_BG),
    // poster: spuShowDTOList.filter(item => item.moduleCode === IMG_ENUM.POSTER),
    // detail: spuShowDTOList.filter(item => item.moduleCode === IMG_ENUM.DETAIL),
    whiteBg,
    poster,
    detail,
    whiteBgId: whiteBg[0].id,
    posterId: poster[0].id,
    detailId: detail[0].id,
    spec: spuJointDTOList
      .filter(item => item.type === SPU_JOIN_ENUM.SPEC)
      .map(__ => {
        const fSpec = newTotalSpuSpecList.find(tssl => tssl.id === __.jointId);
        if (fSpec) {
          return {
            ...__,
            specStandardDTOList: fSpec.specStandardDTOList,
          };
        }
        return __;
      }),
    desc: newDesc,
    brand,
    spuEnglishAlias: spuEnglishAlias ? [{ id: getGuid(), fildValue: spuEnglishAlias }].concat(addSpuEnglishAlias) : defaultSpuEnglishAlias,
    spuChineseAlias: spuChineseAlias ? [{ id: getGuid(), fildValue: spuChineseAlias }].concat(addSpuChineseAlias) : defaultSpuEnglishAlias,
    place: place ? [place].concat(newPlace) : [],
  };
  console.log('newState', newState);
  oldSpuFromServer = { ...newState, brand: formatBrand(spuJointDTOList, 'all'), addPlace, addSpuEnglishAlias, addSpuChineseAlias, oldDesc: desc };
  console.log('oldSpuFromServer', oldSpuFromServer);

  return newState;
}

export default {
  namespace: 'spuForm',

  state: defaultState,

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        if (pathname === '/product/spu/new') {
          const { id } = qs.parse(search);
          if (id) {
            dispatch({
              type: 'getSpu',
              payload: id,
            });
          }
        }
      });
    },
  },

  effects: {
    *saveSpu({ payload }, { call, put }) {
      try {
        const newPayload = formatSpuToServer(payload);
        console.log('saveSpu newPayload', newPayload);
        yield call(saveSpu, newPayload);
        yield put(routerRedux.goBack());
      } catch (error) {
        console.log('error', error);
      }
    },
    *updateSpu({ payload }, { put, call }) {
      try {
        const newPayload = formatSpuToServer(payload, 'edit');
        console.log('updateSpu newPayload', newPayload);
        yield call(updateSpu, newPayload);
        yield put(routerRedux.goBack());
      } catch (error) {
        console.log('error', error);
      }
    },
    *updateStatusSpu({ payload }, { put, call }) {
      yield call(modifySpuStatus, payload);
      yield put(
        routerRedux.replace({
          pathname: '/product/spu',
        })
      );
    },
    *getSpu({ payload }, { call, put }) {
      const response = yield call(getSpu, payload);
      const { proSpuDTO } = response.data;
      // const brand = formatBrand(spuJointDTOList);
      if (proSpuDTO.brandId) {
        yield put({ type: 'spuBrands/seriesByBrandSearch', payload: { brandId: proSpuDTO.brandId } });
      }
      yield put({ type: 'spuServerToState', payload: { ...response.data, spuId: payload } });
    },
  },

  reducers: {
    updateForm(state, { payload }) {
      return payload;
    },
    spuServerToState(state, { payload }) {
      const newPayload = formatServerSpuToState(payload);
      return { ...state, ...newPayload };
    },
    clearForm() {
      return defaultState;
    },
  },
};
