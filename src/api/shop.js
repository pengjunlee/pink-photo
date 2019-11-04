import request from '@/utils/request'

export function shopList(query) {
  return request({
    url: '/tmall/shop/list',
    method: 'get',
    params: query
  })
}

export function goodsList(query) {
  return request({
    url: '/tmall/goods/list/',
    method: 'get',
    params: query
  })
}

export function updateShop(query) {
  return request({
    url: '/tmall/shop/update/' + query.shopId,
    method: 'get'
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
