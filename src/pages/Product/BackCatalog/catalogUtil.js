import _ from 'lodash';
// 后台类目使用

// eslint-disable-next-line
export function findCatalogInList(catalogList, id) {
  const catalogIndex = _.findIndex(catalogList, ['id', id]);
  if (catalogIndex === -1) return null;
  return catalogList[catalogIndex];
}

export function findCatalogInDatas(catalogDatas, id, level = -1) {
  if (level < 1) {
    return (
      findCatalogInList(catalogDatas[0], id) ||
      findCatalogInList(catalogDatas[1], id) ||
      findCatalogInList(catalogDatas[2], id) ||
      findCatalogInList(catalogDatas[3], id)
    );
  }
  return findCatalogInList(catalogDatas[level - 1], id);
}

export function levelStr(level) {
  switch (level) {
    case 1:
      return '一级类目';
    case 2:
      return '二级类目';
    case 3:
      return '三级类目';
    default:
      return '四级类目';
  }
}

export function getAttributeStr(attList, parAttList = []) {
  let delArray = [];
  delArray = _.concat(delArray, parAttList || [], attList || []);
  return delArray
    .filter(e => e.name)
    .map(e => e.name)
    .join('/');
}

export function catalogNeedDisable(catalogDatas, id) {
  if (id === undefined || id === 0 || id === '' || id === '0') {
    return false;
  }
  // debugger;
  let catalog = findCatalogInDatas(catalogDatas, id);
  while (catalog) {
    if (catalog.status !== 0) {
      return true;
    }
    catalog = findCatalogInDatas(catalogDatas, catalog.parentClassId, catalog.level - 1);
  }
  return false;
}

export function canAddNewCatalog(catalogDatas, selectedCatalogIds, level) {
  if (level >= 3) {
    // 父级的父级是冻结
    const checkLevelIndex = level - 3;
    const checkCatalogId = selectedCatalogIds[checkLevelIndex];
    const catalog = findCatalogInDatas(catalogDatas, checkCatalogId, checkLevelIndex + 1);
    return catalog.status !== 2;
  }
  return true;
}
