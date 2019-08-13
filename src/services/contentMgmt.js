import request from '@/utils/request';

export function getCardList({ current, size, req, status }) {
  return request(`/content/backPoster/searchInfo`, {
    method: 'POST',
    data: {
      data: {
        current,
        size,
        req,
        status,
      },
    },
  });
}

export function getCardListByActivity({ current, size, req, status }) {
  return request(`/content/backPoster/searchActPoster`, {
    method: 'POST',
    data: {
      data: {
        current,
        size,
        req,
        status,
      },
    },
  });
}

export function handleTop({ idList, isTop }) {
  return request(`/content/backPoster/isTop`, {
    method: 'POST',
    data: {
      data: {
        idList,
        isTop
      },
    },
  });
}

export function handleLock({ id, status }) {
  return request(`/content/backPoster/changeStatus`, {
    method: 'POST',
    data: {
      data: {
        id,
        status
      },
    },
  });
}

export function getCardDetail({ id }) {
  return request(`/content/backPoster/detail`, {
    method: 'POST',
    data: {
      data: {
        id,
      },
    },
  });
}

export function updateCard(payload) {
  return request(`/content/backPoster/addOrEdit`, {
    method: 'POST',
    data: {
      data: {
        ...payload,
      },
    },
  });
}

export function createCard(payload) {
  return request(`/content/backPoster/addOrEdit`, {
    method: 'POST',
    data: {
      data: {
        ...payload,
      },
    },
  });
}

export function handleDelete({ id }) {
  return request(`/content/backPoster/del`, {
    method: 'POST',
    data: {
      data: {
        id,
        delFlag: 1
      },
    },
  });
}

export function uploadFile({ channel = 1, file, onProgress, timeout = 20 * 1000 }) {
  const formData = new FormData();
  formData.append('channel', channel);
  formData.append('file', file);
  return request(`/user/file/upload`, {
    method: 'POST',
    data: formData,
    action: 'upload',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout,
    onUploadProgress: onProgress,
  });
}
