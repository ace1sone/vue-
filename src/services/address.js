import request from '@/utils/request';

// 查询列表
export async function getAddressList(payload) {
  return request(`/activity/store-address/all`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 查询详情
export async function detail(payload) {
  return request(`/activity/store-address/view`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// update
export async function update(payload) {
  return request(`/activity/store-address/update`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 新建
export async function addAddress(payload) {
  return request(`/activity/store-address/create`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
