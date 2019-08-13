import { brandModify, brandSave, brandDetail, searchAllBrands, brandSpuDownload } from '@/services/props';
import _ from 'lodash';

const defaultState = {
  id: '',
  status: '0',
  delFlag: 0,
  spuBinded: false,
  isModifyName: false,
  englishName: [{ isOfficial: 0, isEnglish: 0, isDefault: 0, fieldCode: '1', fieldName: '名称_英文', spuBinded: false }],
  chineseName: [{ isOfficial: 0, isChinese: 0, isDefault: 0, fieldCode: '2', fieldName: '名称_中文' }],
  englishAlias: [{ isOfficial: 0, isDefault: 0, fieldCode: '3', fieldName: '别名_英文' }],
  chineseAlias: [{ isOfficial: 0, isDefault: 0, fieldCode: '4', fieldName: '别名_中文' }],
  shortName: [{ isOfficial: 0, isDefault: 0, fieldCode: '5', fieldName: '简称' }],
  contacter: [{ isDefault: 0, fieldCode: '6', fieldName: '相关人' }],
  designer: [{ isDefault: 0, fieldCode: '7', fieldName: '设计师' }],
  country: '',
  seriesCount: 0,
  desc: '',
  big_logo: [],
  blank_log: [],
  other: [],
  poster: [],
  video: [],
  brandAttachList: [],
  brandShowList: [],
  proBrandDTO: {},
  seriesDTOList: [],
  keys: [], // 该字段用于遍历子form
  deleteSeriesIds: [],
};

let storebrand = {};

const getDefaultVal = (arr = []) => {
  if (!_.isEmpty(arr)) return arr;
  return null;
};
const getFristName = (arr = []) => {
  return !_.isEmpty(arr) && arr[0].name ? arr[0].name : '';
};

const getLastArr = (list = []) => {
  if (!_.isEmpty(list)) {
    const arr = _.cloneDeep(list);
    arr.shift();
    return arr
      .filter(ele => !_.isEmpty(ele.name))
      .map(ele => ({
        ...ele,
        createdBy: 1,
        updatedBy: 1,
      }));
  }
  return list;
};

const getImgArr = (arr = [], info = {}) => {
  if (!_.isEmpty(arr)) {
    return arr
      .filter(ele => !_.isEmpty(ele.url))
      .map(ele => ({
        id: ele.id || '',
        url: ele.url,
        createdBy: 1,
        updatedBy: 1,
        delFlag: ele.delFlag || 0,
        ...info,
      }));
  }
  return arr;
};

const mapBrandToShow = (data = {}) => {
  const brand = data;
  if (!brand.data.proBrandDTO) brand.data.proBrandDTO = {};
  if (!brand.data.brandAttachList) brand.data.brandAttachList = [];
  if (!brand.data.brandShowList) brand.data.brandShowList = [];
  if (!brand.data.seriesDTOList) {
    brand.data.seriesDTOList = [];
    brand.data.keys = [];
  }

  brand.data.seriesDTOLists = brand.data.seriesDTOList;
  brand.data.keys = brand.data.seriesDTOList;

  if (!_.isEmpty(brand.data) && !_.isEmpty(brand.data.proBrandDTO)) {
    const { proBrandDTO } = brand.data;
    if (proBrandDTO.englishName) {
      brand.data.brandAttachList.unshift({
        name: proBrandDTO.englishName,
        isEnglish: proBrandDTO.isEnglish || 0,
        isOfficial: 0,
        isDefault: 0,
        fieldCode: '1',
        fieldName: '名称_英文',
        spuBinded: proBrandDTO.spuBinded ? true : false,
      });
    }
    if (proBrandDTO.chineseName) {
      brand.data.brandAttachList.unshift({
        name: proBrandDTO.chineseName,
        isChinese: proBrandDTO.isChinese || 0,
        isOfficial: 0,
        isDefault: 0,
        fieldCode: '2',
        fieldName: '名称_中文',
      });
    }
    if (proBrandDTO.contacter) {
      brand.data.brandAttachList.unshift({
        name: proBrandDTO.contacter,
        isOfficial: 0,
        isDefault: 0,
        fieldCode: '6',
        fieldName: '相关人',
      });
    }
    if (proBrandDTO.designer) {
      brand.data.brandAttachList.unshift({
        name: proBrandDTO.designer,
        isOfficial: 0,
        isDefault: 0,
        fieldCode: '7',
        fieldName: '设计师',
      });
    }

    if (!_.isEmpty(brand.data.seriesDTOList)) {
      brand.data.seriesDTOList.forEach(ele => {
        if (ele.englishName) {
          ele.seriesAttachList.unshift({
            name: ele.englishName,
            isEnglish: ele.isEnglish,
            isOfficial: 0,
            isDefault: 0,
            fieldCode: '1',
            fieldName: '名称_英文',
            spuBinded: ele.spuBinded ? true : false,
          });
        }
        if (ele.chineseName) {
          ele.seriesAttachList.unshift({
            name: ele.chineseName,
            isChinese: ele.isChinese,
            isOfficial: 0,
            isDefault: 0,
            fieldCode: '2',
            fieldName: '名称_中文',
          });
        }
        if (ele.contacter) {
          ele.seriesAttachList.unshift({
            name: ele.contacter,
            isOfficial: 0,
            isDefault: 0,
            fieldCode: '6',
            fieldName: '相关人',
          });
        }
        if (ele.principals) {
          ele.seriesAttachList.unshift({
            name: ele.principals,
            isOfficial: 0,
            isDefault: 0,
            fieldCode: '6',
            fieldName: '相关人',
          });
        }
        if (ele.designer) {
          ele.seriesAttachList.unshift({
            name: ele.designer,
            isOfficial: 0,
            isDefault: 0,
            fieldCode: '7',
            fieldName: '设计师',
          });
        }

        if ((ele.isJoint === 1 || ele.isJoint === '1') && !_.isEmpty(ele.jointList)) {
          ele.jointList = ele.jointList.map(item => ({ ...item, delFlag: 1 }));
        }

        if (ele.jointList && !_.isEmpty(ele.jointList)) {
          ele.jointList = ele.jointList.filter(ele2 => ele2.jointId > 0 && ele2.jointName);
        }

        if (ele.seriesShowList && !_.isEmpty(ele.seriesShowList)) {
          ele.big_logo = getDefaultVal(ele.seriesShowList.filter(ele2 => ele2.moduleCode === '1' || ele2.moduleCode === 1)) || [];
          ele.blank_log = getDefaultVal(ele.seriesShowList.filter(ele2 => ele2.moduleCode === '2' || ele2.moduleCode === 2)) || [];
          ele.other = getDefaultVal(ele.seriesShowList.filter(ele2 => ele2.moduleCode === '3' || ele2.moduleCode === 3)) || [];
          ele.poster = getDefaultVal(ele.seriesShowList.filter(ele2 => ele2.moduleCode === '4' || ele2.moduleCode === 4)) || [];
          ele.video = getDefaultVal(ele.seriesShowList.filter(ele2 => ele2.moduleCode === '6' || ele2.moduleCode === 5)) || [];
        } else {
          ele.big_logo = [];
          ele.blank_log = [];
          ele.other = [];
          ele.poster = [];
          ele.video = [];
        }
      });
    }

    // 拼字段值
    brand.data.englishName = getDefaultVal(brand.data.brandAttachList.filter(ele => ele.fieldCode === '1')) || defaultState.englishName;
    brand.data.chineseName = getDefaultVal(brand.data.brandAttachList.filter(ele => ele.fieldCode === '2')) || defaultState.chineseName;
    brand.data.englishAlias = getDefaultVal(brand.data.brandAttachList.filter(ele => ele.fieldCode === '3')) || defaultState.englishAlias;
    brand.data.chineseAlias = getDefaultVal(brand.data.brandAttachList.filter(ele => ele.fieldCode === '4')) || defaultState.chineseAlias;
    brand.data.shortName = getDefaultVal(brand.data.brandAttachList.filter(ele => ele.fieldCode === '5')) || defaultState.shortName;
    brand.data.contacter = getDefaultVal(brand.data.brandAttachList.filter(ele => ele.fieldCode === '6')) || defaultState.contacter;
    brand.data.designer = getDefaultVal(brand.data.brandAttachList.filter(ele => ele.fieldCode === '7')) || defaultState.designer;

    brand.data.country = proBrandDTO.country;
    brand.data.desc = proBrandDTO.desc;
    brand.data.status = proBrandDTO.status;
    brand.data.delFlag = proBrandDTO.delFlag;
    brand.data.delFlagStr = proBrandDTO.delFlag === 0 ? '启用' : '禁用';
    brand.data.id = proBrandDTO.id;

    brand.data.big_logo = getDefaultVal(brand.data.brandShowList.filter(ele => ele.moduleCode === '1' || ele.moduleCode === 1)) || [];
    brand.data.blank_log = getDefaultVal(brand.data.brandShowList.filter(ele => ele.moduleCode === '2' || ele.moduleCode === 2)) || [];
    brand.data.other = getDefaultVal(brand.data.brandShowList.filter(ele => ele.moduleCode === '3' || ele.moduleCode === 3)) || [];
    brand.data.poster = getDefaultVal(brand.data.brandShowList.filter(ele => ele.moduleCode === '4' || ele.moduleCode === 4)) || [];
    brand.data.video = getDefaultVal(brand.data.brandShowList.filter(ele => ele.moduleCode === '6' || ele.moduleCode === 6)) || [];
  }
  storebrand = _.cloneDeep(brand.data);
  console.log('获取详情后拼的结构', brand.data);

  return brand.data;
};

const formatSaveData = values => {
  const { keys, ...others } = values;
  console.log('storebrand', storebrand);
  console.log(others);

  if (!_.isEmpty(storebrand)) {
    // 检查图片是否被删除，并设置delflag
    storebrand.big_logo.forEach(img => {
      const imgs = img;
      const tmp = others.big_logo.filter(item => item.id === img.id);
      if (_.isEmpty(tmp)) {
        imgs.delFlag = 1;
        others.big_logo.push(imgs);
      }
    });

    storebrand.blank_log.forEach(img => {
      const imgs = img;
      const tmp = others.blank_log.filter(item => item.id === img.id);
      if (_.isEmpty(tmp)) {
        imgs.delFlag = 1;
        others.blank_log.push(imgs);
      }
    });

    storebrand.other.forEach(img => {
      const imgs = img;
      const tmp = others.other.filter(item => item.id === img.id);
      if (_.isEmpty(tmp)) {
        imgs.delFlag = 1;
        others.other.push(imgs);
      }
    });

    storebrand.poster.forEach(img => {
      const imgs = img;
      const tmp = others.poster.filter(item => item.id === img.id);
      if (_.isEmpty(tmp)) {
        imgs.delFlag = 1;
        others.poster.push(imgs);
      }
    });

    storebrand.video.forEach(img => {
      const imgs = img;
      const tmp = others.video.filter(item => item.id === img.id);
      if (_.isEmpty(tmp)) {
        imgs.delFlag = 1;
        others.video.push(imgs);
      }
    });
  }

  // 拼装接口字段
  if (!_.isEmpty(others.seriesDTOList)) {
    if (!_.isEmpty(storebrand) && !_.isEmpty(storebrand.seriesDTOList)) {
      console.log('storebrand.seriesDTOList', storebrand.seriesDTOList);
      console.log('others.seriesDTOList', others.seriesDTOList);

      // 检查图片是否被删除，并设置delflag
      storebrand.seriesDTOList.forEach((ele, i) => {
        ele.big_logo.forEach(img => {
          const imgs = img;
          if (others.seriesDTOList[i] && others.seriesDTOList[i].id > 0) {
            const tmp = others.seriesDTOList[i].big_logo.filter(item => item.id === img.id);
            if (_.isEmpty(tmp)) {
              imgs.delFlag = 1;
              others.seriesDTOList[i].big_logo.push(imgs);
            }
          }
        });

        ele.blank_log.forEach(img => {
          const imgs = img;
          if (others.seriesDTOList[i] && others.seriesDTOList[i].id > 0) {
            const tmp = others.seriesDTOList[i].blank_log.filter(item => item.id === img.id);
            if (_.isEmpty(tmp)) {
              imgs.delFlag = 1;
              others.seriesDTOList[i].blank_log.push(imgs);
            }
          }
        });

        ele.other.forEach(img => {
          const imgs = img;
          if (others.seriesDTOList[i] && others.seriesDTOList[i].id > 0) {
            const tmp = others.seriesDTOList[i].other.filter(item => item.id === img.id);
            if (_.isEmpty(tmp)) {
              imgs.delFlag = 1;
              others.seriesDTOList[i].other.push(imgs);
            }
          }
        });

        ele.poster.forEach(img => {
          const imgs = img;
          if (others.seriesDTOList[i] && others.seriesDTOList[i].id > 0) {
            const tmp = others.seriesDTOList[i].poster.filter(item => item.id === img.id);
            if (_.isEmpty(tmp)) {
              imgs.delFlag = 1;
              others.seriesDTOList[i].poster.push(imgs);
            }
          }
        });

        ele.video.forEach(img => {
          const imgs = img;
          if (others.seriesDTOList[i] && others.seriesDTOList[i].id > 0) {
            const tmp = others.seriesDTOList[i].video.filter(item => item.id === img.id);
            if (_.isEmpty(tmp)) {
              imgs.delFlag = 1;
              others.seriesDTOList[i].video.push(imgs);
            }
          }
        });
      });
    }

    others.seriesDTOList.forEach(ele => {
      ele.brandId = others.id || '';
      ele.englishName = getFristName(ele.englishNames);
      ele.chineseName = getFristName(ele.chineseNames);
      ele.principals = getFristName(ele.contacters);
      ele.designer = getFristName(ele.designers);
      ele.isEnglish = 0;
      ele.delFlag = 0;

      if (ele.englishNames[0].isModifyName) {
        ele.isModifyName = true;
      } else {
        ele.isModifyName = false;
      }

      // if ((ele.isJoint === 0 || ele.isJoint === '0') && _.isEmpty(ele.jointList)) hasError = true;
      if (ele.chineseName) ele.isChinese = 0;
      if (!ele.seriesAttachList) ele.seriesAttachList = [];
      ele.seriesAttachList = [].concat(
        getLastArr(ele.englishNames),
        getLastArr(ele.chineseNames),
        getLastArr(ele.contacters),
        getLastArr(ele.designers),
        ele.shortName ? ele.shortName.filter(item => !_.isEmpty(item.name)) : [],
        ele.englishAlias ? ele.englishAlias.filter(item => !_.isEmpty(item.name)) : [],
        ele.chineseAlias ? ele.chineseAlias.filter(item => !_.isEmpty(item.name)) : []
      );

      ele.seriesShowList = [].concat(
        getImgArr(ele.big_logo, {
          moduleCode: 1,
          moduleName: 'logo大图',
        }),
        getImgArr(ele.blank_log, {
          moduleCode: 2,
          moduleName: '白底图',
        }),
        getImgArr(ele.other, {
          moduleCode: 3,
          moduleName: '其他',
        }),
        getImgArr(ele.poster, {
          moduleCode: 4,
          moduleName: '海报',
        }),
        getImgArr(ele.video, {
          moduleCode: 6,
          moduleName: '视频',
        })
      );

      // ele.seriesShowList = [
      //   {
      //     url: 'http://alphabucket-b.oss-cn-shanghai.aliyuncs.com/photo/201905221625279178f3ff8f56cf74af4bd498dcf74e230c09173.jpeg',
      //     moduleCode: 1,
      //     moduleName: 'logo大图',
      //     delFlag: 0,
      //     createdBy: 1,
      //     updatedBy: 1,
      //   },
      //   {
      //     url: 'http://alphabucket-b.oss-cn-shanghai.aliyuncs.com/photo/20190522162532199c9f068d589174043bc5157343010e12b698.jpeg',
      //     moduleCode: 2,
      //     moduleName: '白底图',
      //     delFlag: 0,
      //     createdBy: 1,
      //     updatedBy: 1,
      //   },
      // ];

      if ((ele.isJoint === 1 || ele.isJoint === '1') && !_.isEmpty(ele.jointList)) {
        ele.jointList = ele.jointList.map(item => ({ ...item, delFlag: 1 }));
      }

      if (ele.jointList && !_.isEmpty(ele.jointList)) {
        ele.jointList = ele.jointList.filter(ele => ele.jointId > 0 && ele.jointName);
      }

      ele.seriesAttachList.forEach(ele2 => {
        ele2.brandId = others.id || '';
        ele2.seriesId = ele.id || ele.seriesId || '';
      });

      ele.seriesShowList.forEach(ele2 => {
        ele2.brandId = others.id || '';
        ele2.seriesId = ele.id || ele.seriesId || '';
      });
    });
  }

  const param = {};
  if (getFristName(others.chineseName)) param.isChinese = 0;
  if (getFristName(others.englishName)) param.isEnglish = 0;
  if (others.englishName[0].isModifyName) {
    param.isModifyName = true;
  } else {
    param.isModifyName = false;
  }

  const data = {
    proBrandDTO: {
      id: others.id || '',
      chineseName: getFristName(others.chineseName),
      contacter: getFristName(others.contacter),
      country: others.country,
      createdBy: 1,
      desc: others.desc,
      designer: getFristName(others.designer),
      englishName: getFristName(others.englishName),
      status: others.status || 0,
      delFlag: others.delFlag || 0,
      updatedBy: 1,
      ...param,
    },
    brandAttachList: [],
    brandShowList: [],
    deleteSeriesIds: others.deleteSeriesIds,
  };

  data.brandAttachList = [].concat(
    getLastArr(others.englishName),
    getLastArr(others.chineseName),
    getLastArr(others.contacter),
    getLastArr(others.designer),
    others.shortName.filter(ele => !_.isEmpty(ele.name)),
    others.englishAlias.filter(ele => !_.isEmpty(ele.name)),
    others.chineseAlias.filter(ele => !_.isEmpty(ele.name))
  );

  data.brandShowList = [].concat(
    getImgArr(others.big_logo, {
      moduleCode: 1,
      moduleName: 'logo大图',
    }),
    getImgArr(others.blank_log, {
      moduleCode: 2,
      moduleName: '白底图',
    }),
    getImgArr(others.other, {
      moduleCode: 3,
      moduleName: '其他',
    }),
    getImgArr(others.poster, {
      moduleCode: 4,
      moduleName: '海报',
    }),
    getImgArr(others.video, {
      moduleCode: 6,
      moduleName: '视频',
    })
  );

  // data.brandShowList = [
  //   {
  //     url: 'http://alphabucket-b.oss-cn-shanghai.aliyuncs.com/photo/201905221625279178f3ff8f56cf74af4bd498dcf74e230c09173.jpeg',
  //     moduleCode: 1,
  //     moduleName: 'logo大图',
  //     delFlag: 0,
  //     createdBy: 1,
  //     updatedBy: 1,
  //   },
  //   {
  //     url: 'http://alphabucket-b.oss-cn-shanghai.aliyuncs.com/photo/20190522162532199c9f068d589174043bc5157343010e12b698.jpeg',
  //     moduleCode: 2,
  //     moduleName: '白底图',
  //     delFlag: 0,
  //     createdBy: 1,
  //     updatedBy: 1,
  //   },
  // ];

  data.brandAttachList.forEach(ele => {
    ele.brandId = others.id || '';
  });

  data.brandShowList.forEach(ele => {
    ele.brandId = others.id || '';
  });

  data.seriesDTOList = others.seriesDTOList.map(ele => {
    const {
      englishNames,
      chineseNames,
      contacters,
      designers,
      shortName,
      englishAlias,
      chineseAlias,
      big_logo,
      blank_log,
      poster,
      video,
      other,
      ...obj
    } = ele;
    return obj;
  });

  console.log('组装的新增修改接口数据', data);

  return data;
};

export default {
  namespace: 'brandDetail',

  state: {
    ...defaultState,
    loading: true,
  },

  effects: {
    *searchAllBrands({ payload }, { call }) {
      const response = yield call(searchAllBrands, payload);

      return response;
    },

    *brandModify({ payload, success }, { call }) {
      const newPayload = formatSaveData(payload);
      const response = yield call(brandModify, newPayload);
      if (success) success(response);
    },

    *brandDelete({ payload, success }, { call }) {
      const response = yield call(brandModify, payload);
      if (success) success(response);
    },

    *brandSave({ payload, success }, { call }) {
      const newPayload = formatSaveData(payload);
      const response = yield call(brandSave, newPayload);
      if (success) success(response);
    },

    *brandDetail({ payload }, { call, put }) {
      const response = yield call(brandDetail, payload);

      yield put({
        type: 'loadDetail',
        payload: mapBrandToShow(response),
      });
    },

    *brandSpuDownload({ payload }, { call }) {
      const response = yield call(brandSpuDownload, payload);
      return response;
    },
  },

  reducers: {
    loadDetail(state, { payload }) {
      if (!payload) return defaultState;
      return {
        ...payload,
        loading: false,
      };
    },
    updateForm(state, { payload }) {
      return payload;
    },
    clearDetail() {
      return defaultState;
    },
  },
};
