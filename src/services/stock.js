import request from '@/utils/request';

export async function getSpus({ current = 1, size = 10, spuSearchWord, flag = null }) {
  return request(`/product/skuShelf/findSpuPage`, {
    method: 'POST',
    data: {
      data: {
        current,
        size,
        spuSearchWord,
        flag,
        isJoint: false
      },
    },
  });
}

export async function getSpuDetail({ spuId }) {
  return request(`/product/skuShelf/searchSpuDetail`, {
    method: 'POST',
    data: {
      data: {
        spuId,
      },
    },
  });
}

// 入库管理 - 新增编辑入库单
export async function addOrEditStockinOrder(payload) {
  return request(`/product/receipt/reSave`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 入库管理 - 查询入库单详情
export async function stockinOrderDetail(payload) {
  return request(`/product/receipt/reDetails`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 入库管理 - 查询所有入库单
export async function queryStockinOrders(payload) {
  return request(`/product/receipt/reList`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 入库管理 - 导出报表
export async function exportStockinReport(payload) {
  return request(`/product/receipt/receiptExport`, {
    method: 'POST',
    data: {
      data: payload,
    },
    responseType: 'blob',
  });
}

// 入库管理 - 审批通过&&驳回
export async function inApprovalOrReject(payload) {
  return request(`/product/receipt/approval`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 入库管理 - 驳回提交
export async function rejectSubmit(payload) {
  return request(`/product/receipt/rejected`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 出库管理 - 查询所有出库单
export async function queryStockoutOrders(payload) {
  return request(`/product/proOutbound/searchList`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 出库管理 - 新增商品出库
export async function addStockout(payload) {
  return request(`/product/proOutbound/add`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 出库管理 - 修改更新商品出库
export async function editStockout(payload) {
  return request(`/product/proOutbound/modify`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 出库管理 -  商品出库单详情
export async function stockoutOrderDetail(payload) {
  return request(`/product/proOutbound/outboundInfo`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 出库管理 -  导出报表
export async function exportStockoutReport(payload) {
  return request(`/product/proOutbound/excelExport`, {
    method: 'POST',
    data: {
      data: payload,
    },
    responseType: 'blob',
  });
}

// 出库管理 - 审批通过&&驳回
export async function outApprovalOrReject(payload) {
  return request(`/product/proOutbound/modifyOutboundStatus`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 出库管理 - 获取库存可用数量
export async function validStockoutNum(payload) {
  return request(`/product/proOutbound/skuDetailBySpu`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
