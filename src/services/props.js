import request from '@/utils/request';

// 规格管理 - 新增编辑规格
export async function addOrEditSpec(payload) {
  return request(`/product/spec/addOrEditSpec`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 规格管理 - 规格启用禁用
export async function changeStatus(payload) {
  return request(`/product/spec/changeStatus`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 规格管理 -  规格删除
export async function delSpec(payload) {
  return request(`/product/spec/delSpec`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 规格管理 -  查询属性是否关联的有SPU
export async function checkSpu(payload) {
  return request(`/product/spec/checkSpu`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 规格管理 - 下载管理spu信息
export async function downloadSpecSpu(payload) {
  return request(`/product/spec/downloadSpu`, {
    method: 'POST',
    data: {
      data: payload,
    },
    responseType: 'blob',
  });
}

// 类目使用 规格管理 - 根据类目编号查询描述列表
export async function querySpec(payload) {
  return request(`/product/spec/querySpec`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 规格管理 - 查看规格详情
export async function querySpecInfoByNo(payload) {
  return request(`/product/spec/querySpecInfoByNo`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 规格管理 - 条件查询
export async function selectAllSpecs(payload) {
  return request(`/product/spec/selectAllByParam`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 描述管理 - 新增/编辑描述
export async function addOrEditDesc(payload) {
  return request(`/product/description/addOrEditDesc`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 描述管理 - 启用/禁用
export async function changeDescStatus(payload) {
  return request(`/product/description/changeStatus`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 描述管理 -  删除
export async function delDesc(payload) {
  return request(`/product/description/delDesc`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 描述管理 -  下载关联的SPU信息
export async function downloadSpu(payload) {
  return request(`/product/description/downloadSpu`, {
    method: 'POST',
    data: {
      data: payload,
    },
    responseType: 'blob',
  });
}

// 描述管理 -  查询属性是否关联的有SPU
export async function checkSpuNum(payload) {
  return request(`/product/description/checkSpuNum`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 类目使用 描述管理 -  根据类目编号查询描述列表
export async function queryDesc(payload) {
  return request(`/product/description/queryDesc`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 描述管理 -  查看描述详情
export async function queryDescInfoByNo(payload) {
  return request(`/product/description/queryDescInfoByNo`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 描述管理 -  条件查询
export async function searchDescs(payload) {
  return request(`/product/description/search`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 品牌详情
export async function brandDetail(payload) {
  return request(`/product/proBrand/detail`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 品牌列表
export async function brandList(payload) {
  return request(`/product/proBrand/list`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 品牌更新
export async function brandModify(payload) {
  return request(`/product/proBrand/modify`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 品牌新增
export async function brandSave(payload) {
  return request(`/product/proBrand/save`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 类目使用 所有品牌查询
export async function searchAllBrands(payload) {
  return request(`/product/proBrand/searchAll`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 根据品牌编号查询系列列表
export async function seriesByBrandSearch(payload) {
  return request(`/product/proBrand/seriesByBrandSearch`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function brandSpuDownload(payload) {
  return request(`/product/proBrand/downloadSpu`, {
    method: 'POST',
    data: {
      data: payload,
    },
    responseType: 'blob',
  });
}