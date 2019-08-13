import request from '@/utils/request';

export async function getSpus({ current = 1, size = 10, spuSearchWord }) {
  return request(`/product/spu/list`, {
    method: 'POST',
    data: {
      data: {
        current,
        size,
        spuSearchWord
      },
    },
  });
}

export async function saveSpu(payload) {
  return request(`/product/spu/spuCreation`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function updateSpu(payload) {
  return request(`/product/spu/spuModify`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

/**
 * 更新SPU状态
 * @param {Object} payload {spuId delFlag	0-启用，1-删除，3-禁用}
 * @return {Promise}
 */
export async function modifySpuStatus({ spuId, delFlag }) {
  return request(`/product/spu/modifyStatus`, {
    method: 'POST',
    data: {
      data: {
        spuId,
        delFlag,
      },
    },
  });
}

export async function getSpu(spuId) {
  return request(`/product/spu/listDetail`, {
    method: 'POST',
    data: {
      data: {
        spuId,
      },
    },
  });
}

// 品牌
export async function getBrands({ current = 1, descs, size, records, pages, ascs, asc, orderByField, searchWord, from }) {
  return request(`/product/proBrand/list`, {
    method: 'POST',
    data: {
      data: {
        current,
        descs,
        size,
        records,
        pages,
        ascs,
        asc,
        orderByField,
        searchWord,
        from,
      },
    },
  });
}

// 查询所有品牌
export async function searchBrands({ brandNo, chineseName, contacter, country, delFlag, desc, designer, englishName, status }) {
  return request(`/product/proBrand/searchAll`, {
    method: 'POST',
    data: {
      data: {
        brandNo,
        chineseName,
        contacter,
        country,
        delFlag,
        desc,
        designer,
        englishName,
        status,
      },
    },
  });
}

// 查询后台类目
export async function searchAllLeaf(payload) {
  return request(`/product/spu/queryAllLeaf`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 查询后台规格
export async function searchAllSpec(payload) {
  return request(`/product/spu/querySpec`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 查询后台规格
export async function searchAllDesc(payload) {
  return request(`/product/spu/queryDesc`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
