import request from '@/utils/request';

export async function getRoles(payload) {
  return request(`content/mgt/npc/search`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function saveRole(payload) {
  return request(`content/mgt/npc/save`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function getDynamicList(payload) {
  return request(`content/mgt/npc/post/search`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function loadRoleDetail(payload) {
  return request(`content/mgt/npc/detail`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function loadDynamic(payload) {
  return request(`content/mgt/npc/post/detail`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function changeDisabled(payload) {
  return request(`content/mgt/npc/disable`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function saveDynamic(payload) {
  return request(`content/mgt/npc/post/save`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function publishDyn(payload) {
  return request(`content/mgt/npc/post/publish`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function actionDyn(payload) {
  return request(`content/mgt/npc/post/disable`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function getEnableNpcs(payload) {
  return request(`content/app/npc/list`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
