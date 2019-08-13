import request from '@/utils/request';

export async function login(values) {
  return request(`/user/wfBusinessUser/login`, {
    method: 'POST',
    data: {
      data: values,
    },
  });
}

export default {
  login,
};
