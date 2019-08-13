import request from '@/utils/request';

export async function getBackCatalog(id = 0) {
  return request(`/product/classDetail/querySubOne`, {
    method: 'POST',
    data: {
      data: {
        id,
      },
    },
  });
}

export async function changeStatus(params) {
  return request(`/product/classDetail/changeStatus`, {
    method: 'POST',
    data: {
      data: {
        ...params,
      },
    },
  });
}

export async function searchCatalog(searchWord) {
  return request(`/product/classDetail/queryCompleteLinks`, {
    method: 'POST',
    data: {
      data: {
        req: searchWord,
      },
    },
  });
}

export async function backCatalogDetail(id) {
  return request(`/product/classDetail/queryDetail`, {
    method: 'POST',
    data: {
      data: {
        id,
      },
    },
  });
}

export async function addBackCatalog(params) {
  return request(`/product/classDetail/addOrEdit`, {
    method: 'POST',
    data: {
      data: params,
    },
  });
}

export async function fetchSpecData(params) {
  return request(`/product/classDetail/queryAvailableAttributes`, {
    method: 'POST',
    data: {
      data: params,
    },
  });
}

export async function fetchParAttrisData(params) {
  return request(`/product/classDetail/queryParAttris`, {
    method: 'POST',
    data: {
      data: params,
    },
  });
}

export async function spuListByBackClassId(id) {
  return request(`/product/classDetail/querySpuByClass`, {
    method: 'POST',
    data: {
      data: {
        id,
      },
    },
  });
}

export async function modifySpuNewBackItem(params) {
  return request(`/product/spu/modifySpuNewBackItem`, {
    method: 'POST',
    data: {
      data: params,
    },
  });
}

export async function checkForeByClass(id) {
  return request(`/product/classDetail/checkForeByClass`, {
    method: 'POST',
    data: {
      data: {
        id,
      },
    },
  });
}

export async function checkSpuByBackClass(params) {
  return request(`/product/classDetail/checkSpuByBackClass`, {
    method: 'POST',
    data: {
      data: params,
    },
  });
}

export async function downSpu(params) {
  return request(`/product/classDetail/down`, {
    method: 'POST',
    responseType: 'blob',
    data: {
      data: params,
    },
  });
}

export async function delCatalog(params) {
  return request(`/product/classDetail/del`, {
    method: 'POST',
    data: {
      data: params,
    },
  });
}
