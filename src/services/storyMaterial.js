import request from '@/utils/request';

export async function getMaterialList(payload) {
  return request(`/activity/scene/plot/page`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function getMaterial(payload) {
  return request(`/activity/scene/plot/detail`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function save(payload) {
  return request(`/activity/scene/plot/create`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function update(payload) {
  return request(`/activity/scene/plot/update`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
