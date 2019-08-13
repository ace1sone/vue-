import request from '@/utils/request';
import { get } from 'lodash';

const downLoad = (response, name = 'report.xlsx') => {
  const source = new Blob([get(response, 'data')]);
  const url = window.URL.createObjectURL(source);
  const aLink = document.createElement('a');
  aLink.style.display = 'none';
  aLink.href = url;
  aLink.setAttribute('download', name);
  document.body.appendChild(aLink);
  aLink.click();
  document.body.removeChild(aLink);
  window.URL.revokeObjectURL(url);
};

export async function getSkus(payload) {
  return request(`/product/skuActive/findSkuListForTask`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
export async function getSpus(payload) {
  return request(`/activity/activity/activitySpus`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 任务管理
export async function getTasks(payload) {
  return request(`/activity/task/list`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function awardsList(payload) {
  return request(`/activity/task/draw/winners/list`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function uploadAwards(payload) {
  return request(`/activity/task/draw/winners/upload`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function giveOutAwards(payload) {
  return request(`/activity/task/draw/issue-offline-draw-code`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function addInvited(payload) {
  return request(`/activity/task/invitation/create`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function viewInvited(payload) {
  return request(`/activity/task/invitation/view`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function updateInvited(payload) {
  return request(`/activity/task/invitation/update`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function addPuzzle(payload) {
  return request(`/activity/task/puzzle/create`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function viewPuzzle(payload) {
  return request(`/activity/task/puzzle/view`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function updatePuzzle(payload) {
  return request(`/activity/task/puzzle/update`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function deleteTask(payload) {
  return request(`/activity/task/delete`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function createRandomdraw(payload) {
  return request(`/activity/task/draw/create`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function viewRandomdraw(payload) {
  return request(`/activity/task/draw/view`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function updateRandomdraw(payload) {
  return request(`/activity/task/draw/update`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
export async function exportExcel(payload) {
  const res = await request(`/activity/task/draw/players/export`, {
    method: 'POST',
    data: {
      data: payload,
    },
    responseType: 'blob',
    action: 'download/xlsx',
  });
  return downLoad(res);
}

//

export async function saveActivity(payload) {
  return request(`/activity/activity/save`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function activityDetail(payload) {
  return request(`/activity/activity/detail`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function getActivitys(payload) {
  return request(`/activity/activity/list`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function activityOffline(payload) {
  return request(`/activity/activity/offline`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function activityOnline(payload) {
  return request(`/activity/activity/online`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

function myPost(url, data) {
  return request(url, {
    method: 'POST',
    data: {
      data,
    },
  });
}

function myPostActivity(url, data, addPrefix = false) {
  const mockUrl = 'http://127.0.0.1:3000/mock/11/';
  const allUrl = addPrefix ? `${mockUrl}${url}` : `activity/${url}`;
  return myPost(allUrl, data);
}

export async function getTaskData(payload) {
  return myPostActivity('task/statistics', payload);
}

export async function batch(payload) {
  return myPostActivity('task/batch', payload);
}

export async function deleteActivity(payload) {
  return myPostActivity('activity/del', payload);
}

export async function activitySpus(payload) {
  return myPostActivity('activity/activitySpus', payload);
}

export async function sortTask(payload) {
  return myPostActivity('task/sort', payload);
}

export async function getIntro(payload) {
  return request(`/activity/activity/intro/admin/detail`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function saveIntro(payload) {
  return request(`/activity/activity/intro/admin/save`, {
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

/* 用户回复ID接口 */
export async function getClientId(payload) {
  return request(`/activity/dialog-answer/dialog-ids`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
/* 用户回复内容接口 */
export async function getClientContent(payload) {
  return request(`/activity//dialog-answer/list`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function getMiniProgrameQRCode({ activityId, channel }) {
  return request(`/activity/activity/createQRCode`, {
    method: 'POST',
    data: {
      data: {
        channel,
        activityId,
        width: 1280
      },
    },
  });
}