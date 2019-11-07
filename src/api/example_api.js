import request from '@/utils/request'

// POST 请求用于创建，data 为字典类型
export function post(data) {
  return request({
    url: '/user/login', // '/user/create'
    method: 'post',
    data
  })
}

// PUT 请求用于更新，data 为字典类型
export function put(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

// GET 请求用于查询，name 为字符串
export function getInfo(name) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { name }
  })
}

// GET 请求用于查询，query 为字典类型
export function getList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

// DELETE 请求用于删除，query 为字典类型
export function deleteUser(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}