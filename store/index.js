const cookieparser = process.server ? require('cookieparser') : undefined

// 这里不需要重新创建实例，直接定义并导出各模块就可以了，nuxt 会加载并注册到容器中。
// 在服务端渲染期间运行的都是同一个实例，为防止数据冲突，务必要把 state 定义成一个函数返回数据对象的形式。
export const state = () => {
  return {
    // 当前登录用户的登录状态
    user: null
  }
}

export const mutations = {
  setUser (state, data) {
    state.user = data
  }
}

export const actions = {
  // nuxtServerInit 是 Nuxt.js 中一个特殊的 action 方法，这个 action 会在服务端渲染期间自动调用，且仅在服务端渲染期间调用
  // 作用：初始化容器数据，传递数据给客户端使用
  nuxtServerInit ({ commit }, { req }) {
    let user = null
    
    // 如果请求头中由 cookie
    if (req && req.headers.cookie) {
      // 使用 cookieparser 把 cookie 字符串转换为 js 对象
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (err) {
        // No valid cookie found
      }
    }

    // 提交 mutation 修改 state 状态
    commit('setUser', user)
  }
}