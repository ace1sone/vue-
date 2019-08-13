import request from '@/utils/request';

export async function uploadFile(payload = {}, onUploadProgress, timeout = 20 * 1000) {
  const { channel = 1, file } = payload;
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
    onUploadProgress,
  });
}

export async function ossPolicy(payload = { base64Str: '', channel: 1, fileName: '', fileType: 0 }) {
  return request(`/user/file/ossPolicy`, {
    method: 'POST',
    data: payload,
  });
}

export async function uploadFileByOSS(
  payload = {},
  config = { accessId: '', dir: '', expire: 0, fileUrlPrefix: '', host: '', policy: '', signature: '' }
) {
  const { file, shortname, fileId } = payload;
  const fileName = shortname + fileId;
  const formData = new FormData();
  formData.append('key', config.dir + fileName);
  formData.append('policy', config.policy);
  formData.append('OSSAccessKeyId', config.accessId);
  formData.append('Signature', config.signature);
  formData.append('success_action_status', 200);
  formData.append('file', file);

  return request(`${config.host}`, {
    method: 'POST',
    data: formData,
    action: 'upload',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export default {
  uploadFile,
  uploadFileByOSS,
};
