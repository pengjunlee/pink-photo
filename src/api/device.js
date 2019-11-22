import request from '@/utils/request'

export function getDeviceInfo(mac) {
  return request({
    url: '/device/info',
    method: 'get',
    params: { mac }
  })
}
export function getDeviceGlobal(deviceId) {
  return request({
    url: '/device/global/' + deviceId,
    method: 'get'
  })
}
export function getDeviceBody(query) {
  return request({
    url: '/device/body',
    method: 'get',
    params: query
  })
}
export function deviceList(query) {
  return request({
    url: '/device/list',
    method: 'get',
    params: query
  })
}
export function devicePoseList(query) {
  return request({
    url: '/device/pose/list',
    method: 'get',
    params: query
  })
}
export function createDevice(data) {
  return request({
    url: '/device/create',
    method: 'post',
    data
  })
}

export function updateDevice(data) {
  return request({
    url: '/device/update',
    method: 'put',
    data
  })
}

export function updateDeviceGlobal(data) {
  return request({
    url: '/device/global/update',
    method: 'put',
    data
  })
}
export function updateDeviceBody(data) {
  return request({
    url: '/device/body/update',
    method: 'put',
    data
  })
}
export function deleteDevice(id) {
  return request({
    url: '/device/delete/' + id,
    method: 'delete'
  })
}

export function getDeviceBasic(id) {
  return request({
    url: '/device/basic/' + id,
    method: 'get'
  })
}

