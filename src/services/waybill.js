import request from '@/utils/request';

export async function getShippingStatus() {
  return request(`/order/waybills/v2/shipping-status`, {
    method: 'POST',
    data: {
      data: {}
    }
  });
}

export async function getWaybills({ page, size, ...opt }) {
  return request(`/order/waybills/v2/search`, {
    method: 'POST',
    data: {
      data: { "page": page, "size": size, ...opt }
    }
  });
}

export async function getWaybillDetail({ id }) {
  return request(`/order/waybills/v2/view`, {
    method: 'POST',
    data: {
      data: { "id": id }
    }
  });
}

export async function getOrderDetail({ id }) {
  return request(`/order/order/detail`, {
    method: 'POST',
    data: {
      data: { "orderNo": id }
    }
  });
}

export async function getShippingReport(opt) {
  return request(`/order/waybills/v2/shipping-report`, {
    method: 'POST',
    data: {
      data: { ...opt }
    },
    responseType: 'blob',
    action: 'download/xlsx'
  });
}

export async function getExpressReport(payload) {
  return request(`/order/waybills/v2/express-report`, {
    method: 'POST',
    data: {
      data: { ...payload }
    },
    responseType: 'blob',
    action: 'download/xlsx'
  });
}

export async function updateWaybill(payload) { 
  return request(`/order/waybills/v2/update`, {
    method: 'POST',
    data: {
      data: { ...payload }
    }
  });
}

export async function Shipping(payload) { 
  return request(`/order/waybills/v2/shipping`, {
    method: 'POST',
    data: {
      data: { ...payload }
    }
  });
}

export async function getWaybillLogs({page, size, waybillId}) { 
  return request(`/order/waybills/v2/logs`, {
    method: 'POST',
    data: {
      data: { page, size, waybillId }
    }
  });
}

export async function checkRepeat(payload) {
  return request(`/order/waybills/v2/before-shipping`, {
    method: 'POST',
    data: {
      data: {...payload}
    }
  });
}

export async function getExpressCompanies() {
  return request(`/order/waybills/v2/express-companies`, {
    method: 'POST',
    data: {
      data: {}
    }
  });
}

export async function bulk(payload) {
  return request(`/order/waybills/v2/shipping-all`, {
    method: 'POST',
    data: {
      data: payload
    }
  });
}
