import { getUserInfo, updatePassword } from '@/api/user'
import { login, logout } from '@/api/login'
import { getToken, setToken, removeToken, getName, setName, removeName } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: getName(),
  nickName: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    setToken(token)
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    setName(name)
    state.name = name
  },
  SET_NICKNAME: (state, nickName) => {
    state.nickName = nickName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        const { name } = data
        commit('SET_NAME', name)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.name).then(response => {
        const { data } = response
        if (!data) {
          reject('获取用户信息失败，请重新登录')
        }
        const { roles, nickName, avatar, introduction } = data
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getUserInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', roles)
        commit('SET_NICKNAME', nickName)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_ROLES', [])
        removeToken()
        removeName()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // update password
  updatePassword({ commit }, passwordForm) {
    const { password } = passwordForm
    return new Promise((resolve, reject) => {
      updatePassword({ password: password, username: state.name }).then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_NAME', '')
      commit('SET_ROLES', [])
      removeToken()
      removeName()
      resolve()
    })
  },

  // set token
  setToken({ commit }, token) {
    return new Promise(resolve => {
      commit('SET_TOKEN', token)
      setToken(token)
      resolve()
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
