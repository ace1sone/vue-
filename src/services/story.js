import request from '@/utils/request';

export async function getStorys(payload) {
  return request(`/activity/plot/admin/page`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function storyDetail(payload) {
  return request(`/activity/plot/admin/detail`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

export async function saveStory(payload) {
  return request(`/activity/plot/admin/save`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
