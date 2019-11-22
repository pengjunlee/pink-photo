import request from '@/utils/request'

export function themeList(query) {
  return request({
    url: '/theme/list',
    method: 'get',
    params: query
  })
}

export function createTheme(data) {
  return request({
    url: '/theme/create',
    method: 'post',
    data
  })
}

export function updateTheme(data) {
  return request({
    url: '/theme/update',
    method: 'put',
    data
  })
}

export function deleteTheme(id) {
  return request({
    url: '/theme/delete/' + id,
    method: 'delete'
  })
}
