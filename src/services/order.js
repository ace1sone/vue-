import request from '@/utils/request';

// 查询全部订单
export async function getOrderList(payload) {
  return request('/order/order/admin/page', {
    method: 'POST',
    data: {
      data: payload,
    },
  })
}

// 查询售后单
export async function getReverseOrderList(payload) {
  return request('/order/reverseSingle/page', {
    method: 'POST',
    data: {
      data: payload,
    },
  })
}

// 查询订单详情
export async function getDetailData(payload) {
  return request('/order/order/admin/detail', {
    method: 'POST',
    data: {
      data: payload
    }
  })
}

// 取消订单
export async function cancelOrder(payload) {
  return request('/order/order/admin/cancelOrder', {
    method: 'POST',
    data: {
      data: payload
    }
  })
}

// 申请售后
export async function applyAfterSale(payload) {
  return request('/order/reverseSingle/create', {
    method: 'POST',
    data: {
      data: payload
    }
  })
}

// 完成售后
export async function completeAfterSale(payload) {
  return request('/order/reverseSingle/process', {
    method: 'POST',
    data: {
      data: payload
    }
  })
}
