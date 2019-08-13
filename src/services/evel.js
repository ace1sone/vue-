import request from '@/utils/request';

// 查询举报列表
export async function getReports(payload) {
  return request(`/evaluation/operation/evaluator/report/search`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 保存鉴定师
export async function saveEvaluator(payload) {
  return request(`/evaluation/operation/evaluator/save`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 查询所有鉴定师
export async function getEvaluators(payload) {
  return request(`/evaluation/operation/evaluator/search`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 忽略封禁用户
export async function sealUser(payload) {
  return request(`/evaluation/operation/customer/seal`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 获取所有鉴定订单
export async function getEvalOrders(payload) {
  return request(`/evaluation/operation/evaluation/search`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 纠错鉴定订单
export async function correctOrders(payload) {
  return request(`/evaluation/operation/evaluation/correct`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 用户鉴定记录列表
export async function getAllUserInfos(payload) {
  return request(`/evaluation/operation/customer/search/statistics`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 查询用户鉴定记录
export async function getUserRecords(payload) {
  return request(`/evaluation/evaluator/customer/evaluation/statistics`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 查询所有标签
export async function getALlTags(payload) {
  return request(`/evaluation/operation/customer/mark/search`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 保存标签
export async function saveTag(payload) {
  return request(`/evaluation/operation/customer/mark/add`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 打标签接口
export async function addTag(payload) {
  return request(`/evaluation/evaluator/customer/addmark`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 查询所有品牌系列
export async function getALlBrands(payload) {
  return request(`/evaluation/product/all`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
