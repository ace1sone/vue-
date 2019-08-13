import request from '@/utils/request';


export async function createTags(payload) {
  return request('/activity/label/admin/create', {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}
export async function loadTagsList(payload) {
    return request('/activity/label/admin/list', {
      method: 'POST',
      data: {
        data: payload,
      },
    });
  }

  export async function editTags(payload) {
    return request('/activity/label/admin/edit', {
      method: 'POST',
      data: {
        data: payload,
      },
    });
  }
  