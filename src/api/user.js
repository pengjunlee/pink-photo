import request from '@/utils/request'

export function getUserInfo(name) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { name }
  })
}

export function updatePassword(data) {
  return request({
    url: '/user/password/update',
    method: 'put',
    data
  })
}

export function userList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/delete/' + id,
    method: 'delete'
  })
}

