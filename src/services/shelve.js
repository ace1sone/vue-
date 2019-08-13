import request from '@/utils/request';

// 查询列表
export async function getShelves(payload) {
  return request(`/product/skuShelf/searchInfo`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 查询库存详情
export async function invDetail(payload) {
  return request(`/product/skuShelf/queryInventoryDetail`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 查询商品详情
export async function prdDetail(payload) {
  return request(`/product/skuShelf/querySkuDetail`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 保存库存
export async function saveInv(payload) {
  return request(`/product/skuShelf/editInventoryDetail`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 保存库存
export async function savePrd(payload) {
  return request(`/product/skuShelf/editSkuDetail`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
