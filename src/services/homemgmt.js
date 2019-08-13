import request from '@/utils/request';

export async function getSaleTabs(payload) {
  return request(`activity/activityTab/admin/list`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
export async function addSaleTab(payload) {
  return request(`activity/activityTab/admin/save`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function addNewestTab(payload) {
  return request(`activity/admin/newest/recommendation/add`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function getNewestTabs(payload) {
  return request(`activity/admin/newest/recommendation/list`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function publishTabs(payload) {
  return request(`activity/admin/newest/recommendation/publish`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
