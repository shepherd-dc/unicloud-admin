import {
	setToken,
	getToken
} from '@/utils'
import {
	login,
	getAdminUserInfo,
	logout
} from '@/api/login'
import {
	Message,
	Notice
} from 'view-design';
import router from '@/router'

export default {
	state: {
		uid: uni.getStorageSync('uni') || '',
		token: getToken() || '',
		UseInfo: uni.getStorageSync('UseInfo') || '',
		access: uni.getStorageSync('access') || '',
		hasGetInfo: false
	},
	mutations: {
		setUid(state, uid) {
			state.uid = uid
			uni.setStorageSync('uni', uid)
		},
		setToken(state, token) {
			state.token = token
			setToken(token)
		},
		setAccess(state, access) {
			state.access = access
			uni.setStorageSync('access', access)
		},
		setUserInfo(state, UseInfo) {
			state.UseInfo = UseInfo
			uni.setStorageSync('UseInfo', UseInfo)
		},
		setHasGetInfo(state, status) {
			state.hasGetInfo = status
		}
	},
	getters: {},
	actions: {
		// 登录
		handleLogin({
			dispatch,
			commit
		}, {
			username,
			password
		}) {
			return new Promise(async (resolve, reject) => {
				try {
					const res = await login({
						username,
						password
					})
					if (res.code === 0) {
						commit('setUid', res.uid)
						commit('setToken', res.token)
						await dispatch('getUserInfo')
						Notice.success({
							title: '登录成功'
						});
						router.replace({
							name: 'index'
						});
						resolve()
					}
				} catch (error) {
					reject(error)
				}
			})
		},
		// 退出登录
		handleLogOut({
			commit
		}) {
			return new Promise(async (resolve, reject) => {
				try {
					await logout()
					commit('setUid', '')
					commit('setToken', '')
					commit('setHasGetInfo', '')
					getToken('')
					router.replace({
						name: 'login'
					});
					resolve()
				} catch (error) {
					reject(error)
				}
			})
		},
		// 获取用户相关信息
		getUserInfo({
			state,
			commit,
			dispatch
		}) {
			return new Promise(async (resolve, reject) => {
				try {
					const result = await getAdminUserInfo()
					const {data} = result
					const [res] = data
					commit('setUserInfo', res)
					commit('setAccess', res.access[0].node)
					commit('setHasGetInfo', res ? true : false)
					resolve(res.access[0].node)
				} catch (error) {
					await dispatch('handleLogOut')
					reject(error)
				}
			})
		}
	}
}
