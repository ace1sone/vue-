import request from '@/utils/request';

export async function getFrontCatalog(parentId = 0) {
  return request(`/product/foreClassRelation/queryForeClass`, {
    method: 'POST',
    data: {
      data: {
        parentId,
      },
    },
  });
}

export async function modifyFrontCatalog(params) {
  return request(`/product/foreClassRelation/modify`, {
    method: 'POST',
    data: {
      data: {
        foreClassRelationDTO: {
          ...params,
        },
      },
    },
  });
}

export async function addFrontCatalog(params = {}) {
  return request(`/product/foreClassRelation/creation`, {
    method: 'POST',
    data: {
      data: {
        ...params,
      },
    },
  });
}
export async function modifyFrontCatalogDetail(params = {}) {
  return request(`/product/foreClassRelation/modify`, {
    method: 'POST',
    data: {
      data: {
        ...params,
      },
    },
  });
}

export async function delLinksFrontCatalogDetail(params = {}) {
  return request(`/product/foreClassRelation/delLinks`, {
    method: 'POST',
    data: {
      data: {
        ...params,
      },
    },
  });
}
export async function getBackItemDetail(classId = '0') {
  return request(`/product/foreClassRelation/backItemDetail`, {
    method: 'POST',
    data: {
      data: {
        foreClassNo: classId,
      },
    },
  });
}

export async function getForeClassDetail(Id = '0') {
  return request(`/product/foreClassRelation/detail`, {
    method: 'POST',
    data: {
      data: {
        id: Id,
      },
    },
  });
}
export async function searchFrontCatalog(searchWord) {
  return request(`/product/foreClassRelation/searchForeClass`, {
    method: 'POST',
    data: {
      data: {
        searchWord,
      },
    },
  });
}

export async function searchFirstCatalog(searchWord, currForeId) {
  return request(`/product/foreClassRelation/searchFirstBackItem`, {
    method: 'POST',
    data: {
      data: {
        currBackItemId: searchWord,
        currForeId,
      },
    },
  });
}

export async function searchChildCatalog(id) {
  return request(`/product/foreClassRelation/searchChildBackItem`, {
    method: 'POST',
    data: {
      data: {
        foreId: id,
      },
    },
  });
}
