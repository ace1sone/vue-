import request from '@/utils/request';

// 查询列表
export async function getSkuServices(payload) {
  return request(`/product/skuService/searchInfo`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 查询详情
export async function detail(payload) {
  return request(`/product/skuService/queryDetail`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 删除
export async function del(payload) {
  return request(`/product/skuService/del`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 检查是否关联sku
export async function checkSku(payload) {
  return request(`/product/skuService/checkSku`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 新建或编辑
export async function addOrEdit(payload) {
  return request(`/product/skuService/addOrEdit`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
