import request from '@/utils/request';

// 查询列表
export async function getOps(payload) {
  return request(`/user/client/list`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 查询详情
export async function detail(payload) {
  return request(`/user/client/detail`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 删除
export async function del(payload) {
  return request(`/user/client/remove`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 新增
export async function save(payload) {
  return request(`/user/client/create`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 编辑
export async function update(payload) {
  return request(`/user/client/update`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 获取状态
export async function getStatus(payload) {
  return request(`/user/client/status`, {
    method: 'POST',
    data: {
      data: payload,
    },
  });
}

// 用户信息同步
export async function userSync() {
  return request(`http://operation.heywoof.com/aly/RDS/BackupPlay/pgsql`, {
    method: 'GET',
  });
}

// 活动信息同步
export async function activitySync() {
  return request(`http://operation.heywoof.com/aly/RDS/BackupPlay/mongod`, {
    method: 'GET',
  });
}
