import { request } from '@/plugins/request'

// 获取公共的文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/api/articles',
    params
  })
}

// 获取关注的用户文章列表
export const getFeedArticles = params => {
  return request({
    method: 'GET',
    url: '/api/articles/feed',
    params
  })
}

// 添加点赞
export const addFavorite = slug => {
  return request({
    method: 'POST',
    url: `/api/articles/${ slug }/favorite`
  })
}

// 删除点赞
export const deleteFavorite = slug => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${ slug }/favorite`
  })
}

// 获取文章详情
export const getArticle = slug => {
  return request({
    method: 'GET',
    url: `/api/articles/${ slug }`
  })
}

// 获取文章评论
export const getComments = slug => {
  return request({
    method: 'GET',
    url: `/api/articles/${ slug }/comments`
  })
}

// 添加文章评论
export const addComment = (data, slug) => {
  return request({
    method: 'POST',
    url: `/api/articles/${ slug }/comments`,
    data
  })
}

// 删除文章评论
export const deleteComment = (slug, id) => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${ slug }/comments/${ id }`
  })
}

// 创建文章
export const createArticle = data => {
  return request({
    method: 'POST',
    url: `/api/articles`,
    data
  })
}

// 更新文章
export const updateArticle = (data, slug) => {
  return request({
    method: 'PUT',
    url: `/api/articles/${ slug }`,
    data
  })
}

// 删除文章
export const deleteArticle = slug => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${ slug }`
  })
}

// 添加关注
export const follow = username => {
  return request({
    method: 'POST',
    url: `api/profiles/${ username }/follow`
  })
}

// 取消关注
export const unfollow = username => {
  return request({
    method: 'DELETE',
    url: `api/profiles/${ username }/follow`
  })
}