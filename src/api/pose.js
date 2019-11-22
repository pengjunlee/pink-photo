import request from '@/utils/request'

export function poseList(query) {
  return request({
    url: '/pose/list',
    method: 'get',
    params: query
  })
}

export function updatePoseStyle(data) {
  return request({
    url: '/pose/style/update',
    method: 'put',
    data
  })
}

export function batchAddPose(data) {
  return request({
    url: '/pose/batch/add',
    method: 'post',
    data
  })
}
export function updatePose(data) {
  return request({
    url: '/pose/update',
    method: 'put',
    data
  })
}

export function deletePose(id) {
  return request({
    url: '/pose/delete/' + id,
    method: 'delete'
  })
}