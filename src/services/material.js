import request from '@/utils/request';

export async function getMaterialList(payload) {
  return request(`/activity/scene/admin/list`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function getMaterial(payload) {
  return request(`/activity/scene/admin/detail`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function save(payload) {
  return request(`/activity/scene/admin/save`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function update(payload) {
  return request(`/activity/scene/admin/update`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function setSceneStart(payload) {
  return request(`/activity/scene/admin/root`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function getHotZoneTask(payload) {
  return request(`/activity/scene/admin/hotZoneTask`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
